<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';

const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;

const router = useRouter();
const clubsAValider = ref([]);
const chargement = ref(true);

const getTypesChambresUniques = (listeChambres) => {
    if (!listeChambres || listeChambres.length === 0) return [];
    
    const uniqueTypes = {};
    listeChambres.forEach(ch => {
        const type = ch.type_chambre;
        if (type && !uniqueTypes[type.idtypechambre]) {
            uniqueTypes[type.idtypechambre] = type;
        }
    });
    return Object.values(uniqueTypes);
};

const chargerClubs = async () => {
    try {
        const token = localStorage.getItem('user_token');
        const resRaw = await fetch(`${apiBaseURL}/GetAllClubAValideParVente`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });

        if (!resRaw.ok) {
            throw new Error(`Erreur HTTP : ${resRaw.status}`);
        }

        const response = await resRaw.json();
        clubsAValider.value = response.filter(c => c.statut_mise_en_ligne === 'A_VALIDER_PAR_VENTE');
        console.log(clubsAValider.value);
    } catch (e) {
        console.error("Erreur chargement clubs", e);
        alert("Impossible de charger les dossiers.");
    } finally {
        chargement.value = false;
    }
};

const validerDossier = async (idClub) => {
    if (!confirm("Confirmer la validation de ce dossier ? Il passera en création pour le Marketing.")) return;

    try {
        const response = await fetch(`${apiBaseURL}/clubs/${idClub}/retrograder`, {
            method: 'PATCH',
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

        const result = await response.json();
        
        alert("Dossier validé avec succès !");
        
        clubsAValider.value = clubsAValider.value.filter(c => c.idclub !== idClub);
        
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la validation.");
    }
};

onMounted(async () => {
    try {
        const token = localStorage.getItem('user_token');
        
        
        const response = await fetch(`${apiBaseURL}/check-token`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
    });

        if (response.ok) {

            const data = await response.json();
            if (data.user.role !== 'DIRECTEUR-VENTE') {
                router.push('/'); 
            } else {
                chargerClubs();
            }
        } else {
            router.push('/connexion');
        }
    } catch (e) {
        console.error(e);
    }
});
</script>

<template>
    <NavBar />
    
    <div class="page-container">
        <div class="header-section">
            <h1>Validation des Séjours</h1>
            <p>Analysez le contenu saisi par le marketing avant validation.</p>
        </div>

        <div v-if="chargement" class="loading">Recherche des dossiers...</div>

        <div v-else-if="clubsAValider.length === 0" class="empty-state">
            <h3>🎉 Tout est à jour !</h3>
            <p>Aucun dossier en attente de validation.</p>
            <button @click="router.push('/directeur-vente')" class="btn-back">Retour Dashboard</button>
        </div>

        <div v-else class="clubs-list">
            <div v-for="club in clubsAValider" :key="club.idclub" class="club-detailed-card">
                
                <div class="card-top">
                    <div class="image-wrapper">
                        <img v-if="club.photo" :src="BASE_IMG_URL + club.photo.url" alt="Club" class="club-img" />
                        <div v-else class="no-img">Pas d'image</div>
                    </div>
                    <div class="main-info">
                        <div class="badges">
                            <span class="badge-status">À VALIDER</span>
                            <span v-if="club.pays" class="badge-country">📍 {{ club.pays.nompays }}</span>
                        </div>
                        <h2>{{ club.titre }}</h2>
                        <p class="ville">{{ club.ville }}</p>
                        <p class="desc-text">"{{ club.description }}"</p>
                    </div>
                    <div class="actions">
                        <button class="btn-validate" @click="validerDossier(club.idclub)">
                            ✅ VALIDER LE DOSSIER
                        </button>
                    </div>
                </div>

                <div class="separator"></div>

                <div class="card-details">
                    
                    <div class="detail-col">
                        <h3>🚴 Activités ({{ club.activites ? club.activites.length : 0 }})</h3>
                        <div v-if="club.activites && club.activites.length > 0" class="items-list">
                            <div v-for="act in club.activites" :key="act.idactivite" class="item-row">
                                <div class="item-header">
                                    <strong>{{ act.titre }}</strong>
                                    <span class="price-tag" v-if="act.prixmin > 0">{{ act.prixmin }}€</span>
                                    <span class="free-tag" v-else>Inclus</span>
                                </div>
                                <p class="item-desc">{{ act.description }}</p>
                            </div>
                        </div>
                        <p v-else class="empty-txt">Aucune activité.</p>
                    </div>

                    <div class="detail-col">
                        <h3>🛏️ Chambres</h3>
                        <div v-if="club.chambres && club.chambres.length > 0" class="items-list">
                            <div v-for="type in getTypesChambresUniques(club.chambres)" :key="type.idtypechambre" class="item-row">
                                <div class="item-header">
                                    <strong>{{ type.nomtype }}</strong>
                                    <span class="specs">{{ type.capacitemax }} pers. | {{ type.metrescarres }}m²</span>
                                </div>
                                <p class="item-desc">{{ type.textepresentation }}</p>
                            </div>
                        </div>
                        <p v-else class="empty-txt">Aucune chambre.</p>
                    </div>

                    <div class="detail-col">
                        <h3>🍹 Bars & Resto ({{ club.lieurestauration ? club.lieurestauration.length : 0 }})</h3>
                        <div v-if="club.lieurestauration && club.lieurestauration.length > 0" class="items-list">
                            <div v-for="bar in club.lieurestauration" :key="bar.numrestauration" class="item-row bar-row">
                                <div class="item-header">
                                    <strong>{{ bar.nom }}</strong>
                                    <span class="bar-badge" v-if="bar.estbar">BAR</span>
                                </div>
                                <p class="item-desc"><em>{{ bar.presentation }}</em></p>
                                <p class="item-context" v-if="bar.pivot && bar.pivot.description">
                                    Context : {{ bar.pivot.description }}
                                </p>
                            </div>
                        </div>
                        <p v-else class="empty-txt">Aucun bar/resto.</p>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style scoped>
.page-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; min-height: 80vh; background-color: #f4f6f8; }
.header-section { text-align: center; margin-bottom: 30px; }
.header-section h1 { color: #2c3e50; margin-bottom: 5px; }
.loading, .empty-state { text-align: center; padding: 50px; color: #7f8c8d; }

.clubs-list { display: flex; flex-direction: column; gap: 30px; }

/* CARTE */
.club-detailed-card {
    background: white; border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e4e8;
}

/* TOP */
.card-top { display: flex; padding: 20px; gap: 20px; }
.image-wrapper { width: 200px; height: 140px; border-radius: 8px; overflow: hidden; background: #eee; flex-shrink: 0; }
.club-img { width: 100%; height: 100%; object-fit: cover; }
.no-img { display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 0.9rem; }

.main-info { flex: 1; }
.badges { margin-bottom: 10px; display: flex; gap: 10px; }
.badge-status { background: #e67e22; color: white; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; }
.badge-country { background: #3498db; color: white; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; }
.main-info h2 { margin: 0 0 5px 0; color: #2c3e50; font-size: 1.5rem; }
.ville { color: #7f8c8d; margin: 0 0 10px 0; font-style: italic; }
.desc-text { color: #555; font-size: 0.95rem; line-height: 1.4; background: #f9f9f9; padding: 10px; border-radius: 6px; border-left: 3px solid #ddd; }

.actions { display: flex; align-items: center; justify-content: center; width: 200px; }
.btn-validate { width: 100%; padding: 15px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1rem; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(39, 174, 96, 0.2); }
.btn-validate:hover { background: #219150; transform: translateY(-2px); }

.separator { height: 1px; background: #eee; margin: 0 20px; }

/* DETAILS */
.card-details { display: flex; padding: 20px; gap: 20px; background: #fff; }
.detail-col { flex: 1; min-width: 0; /* Important pour le text-overflow */ }
.detail-col h3 { font-size: 1.1rem; color: #34495e; border-bottom: 2px solid #f0f2f5; padding-bottom: 8px; margin-bottom: 15px; }

.items-list { display: flex; flex-direction: column; gap: 10px; }
.item-row { background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #eee; }
.item-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.95rem; align-items: center; }
.item-desc { margin: 0; font-size: 0.85rem; color: #666; }
.item-context { margin-top: 5px; font-size: 0.8rem; color: #888; font-style: italic; border-top: 1px dashed #ddd; padding-top: 4px; }

.price-tag { color: #c0392b; font-weight: bold; }
.free-tag { color: #27ae60; font-weight: bold; font-size: 0.8rem; text-transform: uppercase; }
.specs { font-size: 0.8rem; color: #2980b9; background: #eaf2f8; padding: 2px 6px; border-radius: 4px; }
.bar-badge { background: #8e44ad; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
.empty-txt { color: #aaa; font-style: italic; font-size: 0.9rem; }

.btn-back { margin-top: 20px; padding: 10px 20px; background: #34495e; color: white; border: none; border-radius: 4px; cursor: pointer; }

@media (max-width: 900px) {
    .card-top, .card-details { flex-direction: column; }
    .image-wrapper, .actions { width: 100%; }
    .image-wrapper { height: 200px; }
}
</style>