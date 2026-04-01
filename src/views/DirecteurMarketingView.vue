<script setup>
import { ref, onMounted, reactive} from 'vue'; 
import api from '../services/api';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';

const router = useRouter();
const clubs = ref([]);
const periodes = ref([]);
const chargement = ref(true);
const erreur = ref(null);
const prixSaisis = ref({});

const protocol = window.location.protocol;
const hostname = window.location.hostname;
const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;

const showModal = ref(false);
const envoiEnCours = ref(false);
const listePays = ref([]);
const nouveauSejour = reactive({
    titre: '',
    description: '',
    numpays: ''
});

const initPrix = (clubId, typeId, periodeId) => {
    if (!prixSaisis.value[clubId]) prixSaisis.value[clubId] = {};
    if (!prixSaisis.value[clubId][typeId]) prixSaisis.value[clubId][typeId] = {};
    if (prixSaisis.value[clubId][typeId][periodeId] === undefined) {
        prixSaisis.value[clubId][typeId][periodeId] = 0;
    }
};

const chargerDonnees = async () => {
    chargement.value = true;
    erreur.value = null;
    
    try {
        const repPeriodes = await api.get('/getPeriodes'); 
        periodes.value = repPeriodes.data;

        const token = localStorage.getItem('user_token');
        const response = await fetch(`${apiBaseURL}/getClubsEnAttente`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const repClubs = await response.json();
        console.log("Clubs reçus :", repClubs);
        clubs.value = repClubs;
        


        clubs.value.forEach(club => {
            if (club.types_chambres_uniques) {
                club.types_chambres_uniques.forEach(type => {
                    periodes.value.forEach(p => {
                        initPrix(club.idclub, type.idtypechambre, p.numperiode);
                    });
                });
            }
        });

    } catch (e) {
        console.error(e);
        erreur.value = "Erreur de chargement : " + (e.message || "Erreur inconnue");
    } finally {
        chargement.value = false;
    }
};


const chargerPays = async () => {
    try {
        
        const response = await api.get('/pays'); 
        listePays.value = response.data;
    } catch (e) {
        console.warn("Impossible de charger les pays", e);
    }
};

const confirmerCreation = async () => {
    envoiEnCours.value = true;
    try {

        const response = await fetch(`${apiBaseURL}/club/init`, {
        method: 'POST', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            titre: nouveauSejour.titre,
            description: nouveauSejour.description,
            numpays: nouveauSejour.numpays
        })
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

        alert("Processus de création lancé avec succès !");
        
        showModal.value = false;
        nouveauSejour.titre = '';
        nouveauSejour.description = '';
        nouveauSejour.numpays = '';
        
        chargerDonnees(); 

    } catch (e) {
        console.error(e);
        alert("Erreur lors de l'initialisation du séjour.");
    } finally {
        envoiEnCours.value = false;
    }
};

const validerEtPublier = async (club) => {
    if(!confirm("Voulez-vous vraiment valider et publier ce club ?")) return;
    
    const tarifs = [];
    
    for (const type of club.types_chambres_uniques) {
        for (const p of periodes.value) {
            const val = prixSaisis.value[club.idclub][type.idtypechambre][p.numperiode];
            const prixFinal = val ? parseFloat(val) : 0; 

           
            if (prixFinal <= 0) {
                alert(`Erreur : Le prix pour la chambre "${type.nomtype}" (Période : ${p.numperiode}) doit être supérieur à 0.`);
                return;
            }
           

            tarifs.push({
                numperiode: p.numperiode,
                idtypechambre: type.idtypechambre,
                prix: prixFinal 
            });
        }
    }

    try {
        const response = await fetch(`${apiBaseURL}/validerEtTarifer/${club.idclub}`, {
        method: 'POST', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            tarifs : tarifs, 
        })
    });
        alert("Club validé avec succès !");
        clubs.value = clubs.value.filter(c => c.idclub !== club.idclub);
    } catch (e) {
        alert("Erreur lors de la validation");
    }
};

onMounted(() => {
    const userStr = localStorage.getItem('user_infos');
    
    if (!userStr) {
        alert("Accès refusé. Veuillez vous connecter.");
        router.push('/'); 
        return;
    }

    try {
        const user = JSON.parse(userStr);
        
        if (user.role !== 'DIRECTEUR_MARKETING') {
            alert("Accès interdit : Espace réservé au Directeur Marketing.");
            return;
        }

        chargerDonnees();
        chargerPays();

    } catch (e) {
        localStorage.removeItem('user');
    }
});
</script>

<template>
    <NavBar />
    
    <div class="container page-wrapper">
        <h1>Validation Marketing</h1>

        <div style="text-align: center; margin-bottom: 30px;">
            <button class="btn-create" @click="showModal = true">
                Lancer la création d'un nouveau séjour
            </button>
        </div>

        <div v-if="chargement" class="msg">Chargement...</div>
        <div v-else-if="erreur" class="msg error"> {{ erreur }}</div>
        
        <div class="cards-list">
            <div v-for="club in clubs" :key="club.idclub" class="card">
                <div class="card-head">
                    <h2>{{ club.titre }}</h2>
                    <span class="badge">EN CRÉATION</span>
                </div>
                
                <div class="card-content">
                    <p>{{ club.description }}</p>
                    
                    <div class="pricing-grid">
                        <div v-if="club.types_chambres_uniques && club.types_chambres_uniques.length > 0">
                            
                            <div v-for="type in club.types_chambres_uniques" :key="type.idtypechambre" class="room-row">
                                <h4>
                                  {{ type.nomtype }}</h4>
                                
                                <div class="inputs-row">
                                    <div v-for="p in periodes" :key="p.numperiode" class="input-group">
                                        <label>{{ p.numperiode }}</label>
                                        <div class="input-wrapper">
                                            <input 
                                                type="number" 
                                                v-model="prixSaisis[club.idclub][type.idtypechambre][p.numperiode]"
                                            >
                                            <span>€</span>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div v-else class="warning">
                             Ce club n'a pas de chambres liées (table s_unit_a vide).
                        </div>
                    </div>
                </div>

                <button class="btn-valider" @click="validerEtPublier(club)" v-if="club.types_chambres_uniques.length >0">
                    VALIDER DÉFINITIVEMENT
                </button>

                
            </div>
        </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Nouveau Séjour</h2>
                <button class="close-btn" @click="showModal = false"></button>
            </div>
            
            <form @submit.prevent="confirmerCreation">
                <div class="form-group">
                    <label>Titre du séjour</label>
                    <input type="text" v-model="nouveauSejour.titre" required placeholder="Ex: Club Med Bali" />
                </div>

                <div class="form-group">
                    <label>Destination (Pays)</label>
                    <select v-model="nouveauSejour.numpays" required>
                        <option value="" disabled>Choisir un pays</option>
                        <option v-for="pays in listePays" :key="pays.numpays" :value="pays.numpays">
                            {{pays.nompays}}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Description initiale</label>
                    <textarea v-model="nouveauSejour.description" required rows="4" placeholder="Description du concept..."></textarea>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-cancel" @click="showModal = false">Annuler</button>
                    <button type="submit" class="btn-confirm" :disabled="envoiEnCours">
                        {{ envoiEnCours ? 'Création...' : 'Initialiser' }}
                    </button>
                </div>
            </form>
        </div>
    </div>

    <Footer />
</template>

<style scoped>
.btn-valider:hover {
    background-color: #000000;
    color: #fff;
}



.page-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.container {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    flex: 1; 
}

h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 120px 0 80px 0; 
    letter-spacing: -0.025em;
    text-align: center;
}

.msg {
    padding: 1rem;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 500;
}
.msg.info { background-color: #dbeafe; color: #1e40af; }
.msg.error { background-color: #fee2e2; color: #991b1b; }

.cards-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.card {
    background-color: #ffffff;
    overflow: hidden;
    border: 1px solid #ccc;
}

.card-head {
    padding: 1.5rem;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
}

.card-head h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.badge {
    background-color: #fff7ed;
    color: #c2410c;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.35rem 0.75rem;
    border-radius: 9999px;
    letter-spacing: 0.05em;
    border: 1px solid #ffedd5;
}

.card-content {
    padding: 2rem;
}

.description {
    color: #777;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    font-size: 0.95rem;
}

.room-row {
    margin-bottom: 2.5rem;
    padding: 1.5rem;
    border: 1px solid #f3f4f6;
}

.room-row h4 {
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
    display: inline-block;
}

.inputs-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); 
    gap: 1.25rem;
}

.input-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.5rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-wrapper input {
    width: 100%;
    padding: 8px 18px;
    padding-right: 2rem; 
    background-color: #ffffff;
    border: 1px solid #ccc;
    font-size: 0.95rem;
}

.input-wrapper input:focus {
    outline: none;
    border-color: black;
}

.input-wrapper input::-webkit-outer-spin-button,
.input-wrapper input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.input-wrapper .currency {
    position: absolute;
    right: 0.75rem;
    color: #777;
    font-size: 0.9rem;
    pointer-events: none;
    font-weight: 500;
}

.warning {
    background-color: #fffbeb;
    color: #92400e;
    padding: 1rem;
    border: 1px dashed #fcd34d;
    text-align: center;
}

.btn-valider {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    margin: 20px auto;
    display: block;
    transition: 0.2s;
}

.btn-valider:hover {
    background-color: #000000;
    color: #fff;
}
.btn-create {
    background-color: #0069d9;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.3s;
}
.btn-create:hover {
    background-color: #0056b3;
}

.modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 {
    font-size: 1.5rem;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #888;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 0.9rem;
}

.form-group input, 
.form-group select, 
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 25px;
}

.btn-cancel {
    background: #f3f4f6;
    border: 1px solid #ccc;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
}

.btn-confirm {
    background: #0069d9;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
}
.btn-confirm:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>