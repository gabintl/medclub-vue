<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import NavBar from '../components/NavBar.vue';

const protocol = window.location.protocol;
const hostname = window.location.hostname;
const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;

const router = useRouter();
const avis = ref(null)
const reponseBool = ref({});
const veutReponse = ref(false);
const erreur = ref(false);
const envoyer = ref(false)
const supprimer = ref(false)
const reponses = ref({})
const messageErreur = ref({})
const avi = ref(null);
const avisfiltrer = ref(null)

const texteReponse = ref("");

const filtreActif = ref('tous');

const avisFiltres = computed(() => {
    if (!avis.value) return [];
    if (filtreActif.value === 'a_traiter') {
        return avis.value.filter(a => !a.reponse);
    } else if (filtreActif.value === 'traites') {
        return avis.value.filter(a => a.reponse);
    }
    return avis.value;
});
onMounted(async () => {
    try {
            const token = localStorage.getItem('user_token');
            const resRaw = await fetch(`${apiBaseURL}/avis`, {
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

            const json = await resRaw.json();
            avis.value = json;
            console.log(avis)
            avisfiltrer.value = avis.value
            avis.value.forEach(avi => {
                reponses.value[avi.numavis] = avi.reponse || ""; 
                messageErreur[avi.numavis] = "";
            });
            console.log(avis.value)
    }
    catch (e) {
            console.error(e);
            message.value = "Erreur serveur";
    }
});

const AjouterReponse = async (numAvis, reponse) => {
    console.log(reponse)
    avi.value = avis.value.find(avi => avi.numavis = numAvis)
    if (!reponse || reponse.trim().length == 0){
        messageErreur.value[numAvis] = "Attention : Vous ne pouvez pas envoyer une réponse vide !";
        console.log(messageErreur[numAvis])
        return;
    }
    else{
         messageErreur.value[numAvis] = ""
    }
    avi.value.reponse = reponse;
    try {
        const response = await fetch(`${apiBaseURL}/avis/reponse`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                numavis: avi.value.numavis,
                reponse : avi.value.reponse,
            })
        });
        envoyer.value = true;
    } catch (e) {
        console.error(e);
        messageErreur.value = "Erreur : Impossible de sauvegarder la réponse.";
    }

}

const SupprimerReponse = async(numAvis) => {
    try {
        const response = await fetch(`${apiBaseURL}/avis/reponse`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                numavis: numAvis,
                reponse : null,
            })
        });
        supprimer.value = true;
    } catch (e) {
        console.error(e);
        messageErreur.value = "Erreur : Impossible de sauvegarder la réponse.";
    }
}
</script>
<template>
    <NavBar /> 
        <h1 style="margin: 150px auto 40px auto;text-align: center;">AVIS CLIENTS</h1>
        <div class="filter-container">
                <button @click="filtreActif = 'tous'" :class="{ active: filtreActif === 'tous' }" class="filter-btn">
                    Tous
                </button>
                <button @click="filtreActif = 'a_traiter'" :class="{ active: filtreActif === 'a_traiter' }" class="filter-btn">
                    À répondre
                </button>
                <button @click="filtreActif = 'traites'" :class="{ active: filtreActif === 'traites' }" class="filter-btn">
                    Répondus
                </button>
            </div>

        <div v-if="true">
             <div v-for="avi in avisFiltres" :key="avi.numavis" class="avis-card">
                <h3>
                    
                    <span v-if="avi.club"> {{ avi.club.titre }}</span>
                </h3>
                <p><strong>Note :</strong> {{ avi.note }}/5</p>
                <p>Titre : {{ avi.commentaire }}</p>
                <p>Commentaire : {{ avi.commentaire }}</p>
               
                <div>
                    <textarea 
                        v-model="reponses[avi.numavis]" 
                        placeholder="Écrivez votre réponse ici..."
                        :disabled="avi.reponse"
                    ></textarea>
                    <button v-if="avi.reponse == null" @click = "AjouterReponse(avi.numavis,reponses[avi.numavis] )">
                        Valider
                    </button>
                    <button v-if="avi.reponse != null" @click = "SupprimerReponse(avi.numavis)">
                        Supprimer
                    </button>
                    <div v-if="messageErreur[avi.numavis]" class="error">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                        </svg>
                        <span>{{ messageErreur[avi.numavis] }}</span>
                    </div>
                </div>
                 
                 <hr>
            </div>
            <div v-if="envoyer" class="overlay">
                <div class="popup popup-success">
                    <div class="icon-circle success">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                        </svg>
                    </div>
                    <h2>Reponse publié !</h2>
                    
                    <button @click="envoyer=false" class="btn-popup">Retour au avis</button>
                </div>
            </div>
            <div v-if="supprimer" class="overlay">
                <div class="popup popup-success">
                    <div class="icon-circle success">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                        </svg>
                    </div>
                    <h2>Reponse supprimé !</h2>
                    
                    <button @click="supprimer=false" class="btn-popup">Retour au avis</button>
                </div>
            </div>
        </div>

        <p v-else-if="!message">Chargement des avis...</p>
    
</template>
<style>
.overlay {
    position: fixed; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); 
    backdrop-filter: blur(4px); 
    display: flex;
    justify-content: center; 
    align-items: center; 
    z-index: 9999; 
    animation: fadeIn 0.2s ease-out; 
}

.popup {
    background: white;
    padding: 40px;
    text-align: center;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* Belle ombre portée */
    animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Animation avec petit rebond */
}

.icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px auto;
}

.icon-circle.success {
    background-color: #d1fae5;
    color: #059669; /* Vert */
}

.icon-circle.error {
    background-color: #fee2e2;
    color: #dc2626; /* Rouge */
}

/* --- TYPOGRAPHIE --- */
.popup h2 {
    font-size: 1.5rem;
    color: #111827;
    margin-bottom: 8px;
    font-weight: 600;
}

.popup p {
    color: #6b7280;
    margin-bottom: 24px;
    line-height: 1.5;
}

.btn-popup {
    background-color: #000;
    color: white;
    border: 1px solid #000;
    padding: 10px 24px;
    font-size: 0.95rem;
    cursor: pointer;
    font-weight: bold;
    transition: all .2s;
    width: 100%;
}

.btn-popup:hover {
    background-color: #fff;
    color: #000;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes zoomIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
.filter-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 30px;
}

.filter-btn {
    padding: 8px 20px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    color: #555;
}

.filter-btn:hover {
    background-color: #f3f4f6;
    border-color: #ccc;
}

.filter-btn.active {
    background-color: #000;
    color: white;
    border-color: #000;
    font-weight: bold;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
