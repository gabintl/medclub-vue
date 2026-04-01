<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import InfoBulle from '../components/InfoBulle.vue';
import StripePayment from '@/components/StripePayment.vue'; 

axios.defaults.withCredentials = true;

const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;

const router = useRouter();
const message = ref('');
const userInfos = ref({});
const modification = ref(false);
const donneesStockees = localStorage.getItem('user_infos');
let genre = ref('');

const donnerAvis = (resa) =>{
    localStorage.setItem('resa_avis', JSON.stringify(resa))
    router.push('/donner-avis');
}

const lesActivites = ref([])
const lesActivitesSel = ref([])
const showModal = ref(false);
const selectedReservation = ref(null);
const prixTotal = ref(0);
const modalView = ref('details');

const messagePrenom = ref('');
const messageNom = ref('');
const messageNumRue = ref('');
const messageNomRue = ref('');
const messageCodePostal = ref('');
const messageVille = ref('');
const suggestions = ref([]);
const montrerSuggestions = ref(false);
let timerRecherche = null;

const messagePasswordCourt = ref('');
const messagePasswordMaj = ref('');
const messagePasswordMin = ref('');
const messagePasswordSpe = ref('');
const messagePasswordNum = ref('');
const showModalPassword = ref(false);
const formMdp = ref({
    ancien_mdp: '',
    nouveau_mdp: '',
    nouveau_mdp_confirmation: ''
});
const erreursMdp = ref({});
const messageMdpSucces = ref('');

const showModalA2F = ref(false);
const stepA2F = ref(1);
const actionA2F = ref('');
const codeSaisiA2F = ref('');
const messageModal = ref('');

onMounted(async () => {
    console.log("Chargement profil...");
    if (!localStorage.getItem('logged_in')) {
        router.push('/connexion');
        return;
    }
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
        if (data.user) {
            userInfos.value = data.user;
            localStorage.setItem('user_infos', JSON.stringify(data.user));
        } else {
            router.push('/connexion');
        }
    } else {
        console.log("Session expirée");
        router.push('/connexion');
    }
});

if (donneesStockees) {
    try {
        userInfos.value = JSON.parse(donneesStockees);
    } catch (e) {
        console.error("Erreur de lecture du JSON", e);
    }
}
if (userInfos.value && userInfos.value.genre) {
    genre.value = userInfos.value.genre == "M" ? "M." : "Mme."
}

const openModal = async (reservation) => {
    selectedReservation.value = reservation;
    modalView.value = 'details'; 
    showModal.value = true;
    lesActivites.value = []; 

    try {
        const response = await fetch(`${apiBaseURL}/GetAllActivite/${reservation.club.idclub}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            data.activites.forEach(activite => {
                if (parseFloat(activite.prixmin) > 0) {
                    lesActivites.value.push(activite); 
                }
            });
        }
    } catch (e) {
        console.error("Erreur chargement :", e);
    }
};

const closeModal = () => {
    lesActivitesSel.value = []
    showModal.value = false;
    selectedReservation.value = null;
    modalView.value = 'details';
};

const getOptionsDisponibles = (indexActuel) => {
    return lesActivites.value.filter(activite => {
        const estDejaSelectionnee = lesActivitesSel.value.some((sel, idx) => {
            if (idx === indexActuel) return false;
            return sel.activite && sel.activite.idactivite === activite.idactivite;
        });
        return !estDejaSelectionnee;
    });
};

watch(lesActivitesSel, (valeur) => {
    prixTotal.value = 0;
    valeur.forEach(actSel => {
        if (!actSel.activite) return;
        const cleanPrice = actSel.activite.prixmin
            ?.replace(/[^\d.,-]/g, '')   
            .replace(',', '.');          
        prixTotal.value += parseFloat(cleanPrice) * (actSel.nbpersonnes || 0);
    });
}, { deep: true });

const passerAuPaiement = () => {
    let verif = true;
    lesActivitesSel.value.forEach(element => {
        if (element == '') verif = false;
    });
    
    if (verif && lesActivitesSel.value.length > 0) {
        modalView.value = "payment";
    } else {
        alert("Veuillez sélectionner des activités.");
    }
}

const onPaiementSuccess = async () => {
    let donneesReservation = {
        activites: lesActivitesSel.value,
        numreservation: selectedReservation.value.numreservation,
        prixTotal: prixTotal.value
    };

    console.log("Paiement Stripe OK. Enregistrement en BDD...", donneesReservation);

    try {
        const response = await axios.post(`${apiBaseURL}/PostReservationActivite`, donneesReservation);
        
        if (response.status === 200 || response.status === 201) {
            alert("Paiement validé et activités ajoutées avec succès !");
            closeModal();
            window.location.reload();
        }
    } catch (error) {
        console.error("Erreur API Sauvegarde Activités :", error);
        alert("Le paiement est passé mais l'enregistrement a échoué. Contactez le support.");
    }
};

const ActiviteSupplémentaire = computed(() => {
    if(!selectedReservation.value) return false;
    const Payant = selectedReservation.value.activites.some(activite => {
        return parseFloat(activite.prixmin) > 0;
    });
    return !Payant
});

const ouvrirModification = () => {
    if (!userInfos.value.adresse) {
        userInfos.value.adresse = { numrue: '', nomrue: '', codepostal: '', ville: '', pays: 'France' };
    }
    modification.value = true;
};

const register = async () => {
    let champSaisie = true; 
    if(!userInfos.value.prenom) { messagePrenom.value = "Requis"; champSaisie = false; } else messagePrenom.value = '';
    if(!userInfos.value.nom) { messageNom.value = "Requis"; champSaisie = false; } else messageNom.value = '';
    if(!userInfos.value.adresse.numrue) { messageNumRue.value = "Requis"; champSaisie = false; } else messageNumRue.value = '';
    if(!userInfos.value.adresse.nomrue) { messageNomRue.value = "Requis"; champSaisie = false; } else messageNomRue.value = '';
    
    if (!champSaisie) return;

    try {
        const response = await fetch(`${apiBaseURL}/modification`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                numclient: userInfos.value.numclient,
                prenom: userInfos.value.prenom,
                nom: userInfos.value.nom,
                email: userInfos.value.email,
                telephone: userInfos.value.telephone,
                genre: userInfos.value.genre,
                datenaissance: userInfos.value.datenaissance,
                numadresse : userInfos.value.numadresse,
                numrue: userInfos.value.adresse.numrue,
                nomrue: userInfos.value.adresse.nomrue,
                codepostal: userInfos.value.adresse.codepostal,
                ville: userInfos.value.adresse.ville,
                pays: userInfos.value.adresse.pays
            })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('user_infos', JSON.stringify(data.user));
            userInfos.value = data.user;
            modification.value = false; 
            alert("Profil mis à jour avec succès !");
        } else {
            alert("Erreur : " + (data.message || "Vérifiez vos informations"));
        }
    } catch (e) {
        console.error(e);
        alert("Erreur serveur.");
    }
};

const chercherAdresse = async () => {
    if (!userInfos.value.adresse.numrue) return;
    clearTimeout(timerRecherche);
    timerRecherche = setTimeout(async () => {
        try {
            const query = encodeURIComponent(`${userInfos.value.adresse.numrue} ${userInfos.value.adresse.nomrue}`);
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`);
            if (response.ok) {
                const data = await response.json();
                suggestions.value = data.features;
                montrerSuggestions.value = true;
            }
        } catch (error) { console.error(error); }
    }, 300);
};

const selectionnerAdresse = (feature) => {
    const props = feature.properties;
    userInfos.value.adresse.nomrue= props.street;
    userInfos.value.adresse.ville = props.city;
    userInfos.value.adresse.codepostal = props.postcode;
    if (props.housenumber) userInfos.value.adresse.numrue = props.housenumber;
    suggestions.value = [];
    montrerSuggestions.value = false;
};

const validerChangementMdp = async () => {
    if (formMdp.value.nouveau_mdp !== formMdp.value.nouveau_mdp_confirmation) {
        alert("Les mots de passe ne correspondent pas"); return;
    }
    try {
        await axios.post(`${apiBaseURL}/compte/reinitialiser-mdp`, formMdp.value);
        messageMdpSucces.value = "Mot de passe modifié !";
        setTimeout(() => { showModalPassword.value = false; }, 1500);
    } catch (error) {
        alert("Erreur lors de la modification");
    }
};

const logout = async () => {
    const token = localStorage.getItem('user_token');
    try {
        await fetch(`${apiBaseURL}/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });
    } catch (e) {} 
    finally {
        localStorage.removeItem('user_infos');
        localStorage.removeItem('logged_in');
        localStorage.removeItem('reservation');
        document.cookie.split(';').forEach(c => {
            const name = c.split('=')[0].trim();
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
        });
        router.push('/connexion');
    }
};

const DemandeAnnulation = async (numReservation) => {
    try {
        await fetch(`${apiBaseURL}/compte/annulation`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ numreservation: numReservation, veut_annuler : true })
        });
        alert("Demande d'annulation envoyée.");
        window.location.reload();
    } catch (e) { console.error(e); }
}

const EnvoiSurVente = () =>{ router.push("/membre-vente") }
const EnvoiSurAnalyse = () =>{ router.push("/directeur-vente") }

onBeforeRouteLeave((to, from, next) => {
    if (to.path === '/connexion') { next(); return; }
    const u = userInfos.value;
    const adr = u.adresse || {}; 
    const infosManquantes = !u.prenom || !u.telephone || !adr.numrue || !adr.nomrue || !adr.codepostal || !adr.ville;
    if (infosManquantes) {
        alert("Profil incomplet ! Veuillez renseigner vos informations.");
        ouvrirModification();
        next(false);
    } else {
        next();
    }
});

const ouvrirModalA2F = (action) => {
    if (!userInfos.value.telephone) {
        alert("Veuillez d'abord renseigner un numéro de téléphone.");
        return;
    }
    actionA2F.value = action;
    stepA2F.value = 1;
    codeSaisiA2F.value = '';
    messageModal.value = '';
    showModalA2F.value = true;
};

const envoyerSMS_A2F = async () => {
    messageModal.value = "Envoi du SMS en cours...";
    
    try {
        const response = await fetch(`${apiBaseURL}/send-2fa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idclient: userInfos.value.numclient })
        });

        if (response.ok) {
            stepA2F.value = 2; 
            messageModal.value = ''; 
        } else {
            messageModal.value = "Erreur lors de l'envoi du SMS.";
        }
    } catch (e) {
        console.error(e);
        messageModal.value = "Erreur serveur.";
    }
};

const validerCode_A2F = async () => {
    if (codeSaisiA2F.value.length < 4) {
        messageModal.value = "Le code doit faire 4 chiffres.";
        return;
    }
    
    messageModal.value = "Vérification...";

    try {
        const urlApi = actionA2F.value === 'enable' 
            ? `${apiBaseURL}/verifier-2fa` 
            : `${apiBaseURL}/desactiver-2fa`;

        const response = await fetch(urlApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idclient: userInfos.value.numclient,
                code: codeSaisiA2F.value 
            })
        });

        const data = await response.json();

        if (response.ok) {
            showModalA2F.value = false;
            alert(data.message);
            
            userInfos.value.a2f_active = (actionA2F.value === 'enable');
            
        } else {
            messageModal.value = data.message || "Code incorrect.";
        }

    } catch (e) {
        console.error(e);
        messageModal.value = "Erreur serveur.";
    }
};
</script>

<template>
    <NavBar />
    <div v-if="userInfos">
        <div class="client-container">
            <h1 class="main-title">Mon Espace Client</h1>
            
            <p v-if="message" :class="{'success-message': !message.includes('Erreur'), 'error-message': message.includes('Erreur')}">{{ message }}</p>

            <div class="profile-card">
                <div v-if="userInfos" class="profile-content">
                    
                    <div v-if="!modification" class="view-mode">
                        <h2 class="section-title">Informations Personnelles</h2>
                        
                        <div class="info-group">
                            <p class="info-label">Nom Complet :</p>
                            <p class="info-value">{{genre}} {{ userInfos.prenom }} {{userInfos.nom}}</p>
                        </div>
                        <div class="info-group">
                            <p class="info-label">Email :</p>
                            <p class="info-value">{{ userInfos.email }}</p>
                        </div>
                        <div v-if="userInfos.telephone" class="info-group">
                            <p class="info-label">Téléphone :</p>
                            <p class="info-value">{{userInfos.telephone}}</p>
                        </div>
                        
                        <div v-if="userInfos.adresse" class="address-details">
                            <h3 class="subsection-title">Adresse</h3>
                            <p class="info-value">{{userInfos.adresse.numrue}} {{userInfos.adresse.nomrue}} </p>
                            <p class="info-value">{{userInfos.adresse.codepostal}} {{userInfos.adresse.ville}}</p>
                            <p class="info-value">{{userInfos.adresse.pays}}</p>
                        </div>
                        <div v-else class="address-details" style="color: #666; font-style: italic; margin-top: 20px;">
                            <p>Aucune adresse renseignée.</p>
                        </div>
                        
                        <div class="action-buttons" style="display: flex; flex-direction: row; gap: 15px;">                     
                            <p v-if="!userInfos.adresse" style="color: red; font-weight: bold; margin-bottom: 10px; background-color: #ffebee; padding: 10px; border-radius: 5px;">
                                Veuillez compléter les informations de votre compte avant de continuer.
                            </p>
                        
                            <button @click="ouvrirModification" class="btn btn-primary">Modifier mes informations</button>
                            <button v-if="userInfos.a2f_active" @click="ouvrirModalA2F('disable')" class="btn" style="background-color: #d32f2f; color: white;">Désactiver l'A2F</button>
                            <button v-else @click="ouvrirModalA2F('enable')" class="btn btn-primary">Activer l'A2F</button>
                        </div>
                        <div v-if="showModalA2F" class="modal-overlay" @click.self="showModalA2F = false">
                            <div class="modal-content a2f-modal">
                                <span class="close-btn" @click="showModalA2F = false">&times;</span>
                            
                                <div v-if="stepA2F === 1">
                                    <h2 class="section-title" style="margin-top: 0; border: none;">
                                        {{ actionA2F === 'enable' ? 'Activer' : 'Désactiver' }} l'A2F
                                    </h2>
                                    <p style="font-size: 1.1em; color: #555; margin-bottom: 30px;">
                                        Voulez-vous recevoir un code par SMS au <strong>{{ userInfos.telephone }}</strong> pour confirmer cette action ?
                                    </p>

                                    <div class="modal-actions">
                                        <button @click="envoyerSMS_A2F" class="btn btn-primary">Oui, envoyer le SMS</button>
                                        <button @click="showModalA2F = false" class="btn btn-secondary">Annuler</button>
                                    </div>
                                </div>
                            
                                <div v-if="stepA2F === 2">
                                    <h2 class="section-title" style="margin-top: 0; border: none;">Vérification</h2>
                                    <p style="margin-bottom: 20px;">Entrez le code à 4 chiffres reçu par SMS.</p>
                                                        
                                    <input 
                                        type="text" 
                                        v-model="codeSaisiA2F" 
                                        maxlength="4" 
                                        placeholder="0000"
                                        class="input-code-a2f"
                                        @keyup.enter="validerCode_A2F"
                                    >
                                                        
                                    <p v-if="messageModal" style="color: red; margin-top: 10px;">{{ messageModal }}</p>
                                                        
                                    <div class="modal-actions" style="margin-top: 30px;">
                                        <button @click="validerCode_A2F" class="btn btn-primary">Valider</button>
                                        <button @click="stepA2F = 1" class="btn btn-secondary" style="font-size: 0.9em;">Retour</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="modification" class="edit-mode">
                        <h2 class="section-title">Modifier mes informations</h2>
                        <form @submit.prevent="register()">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="genre">Genre</label>
                                    <select id="genre" v-model="userInfos.genre">
                                        <option value="M">Monsieur</option>
                                        <option value="F">Madame</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="prenom">Prénom *</label>
                                    <input id="prenom" v-model="userInfos.prenom" type="text" />
                                    <div v-if="messagePrenom" class="error-message">{{ messagePrenom }}</div>
                                </div>
                                <div class="form-group">
                                    <label for="nom">Nom *</label>
                                    <input id="nom" v-model="userInfos.nom" />
                                    <div v-if="messageNom" class="error-message">{{ messageNom }}</div>
                                </div>
                                <div class="form-group">
                                    <label for="telephone">Téléphone *</label>
                                    <input id="telephone" v-model="userInfos.telephone" />
                                </div>
                                <div class="form-group">
                                    <label for="datenaissance">Date de Naissance</label>
                                    <input id="datenaissance" v-model="userInfos.datenaissance" type="date"/>
                                </div>
                            </div>

                            <h3 class="subsection-title">Adresse</h3>
                            <div class="form-row address-fields">
                                <div class="form-group num-rue">
                                    <label>N° *</label>
                                    <input v-model="userInfos.adresse.numrue" />
                                </div>
                                <div class="form-group nom-rue">
                                    <label>Nom de la rue *</label>
                                    <input v-model="userInfos.adresse.nomrue" @input="chercherAdresse" />
                                    <ul v-if="montrerSuggestions && suggestions.length > 0">
                                        <li v-for="item in suggestions" :key="item.properties.id" @mousedown.prevent="selectionnerAdresse(item)">
                                            <strong>{{ item.properties.label }}</strong>
                                        </li>
                                    </ul>
                                </div>
                                <div class="form-group codepostal">
                                    <label>Code Postal *</label>
                                    <input v-model="userInfos.adresse.codepostal" />
                                </div>
                                <div class="form-group ville">
                                    <label>Ville *</label>
                                    <input v-model="userInfos.adresse.ville" />
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-avis" @click="showModalPassword = true">Réinitialiser mot de passe</button>                        
                                <button type="submit" class="btn btn-primary">Enregistrer</button>
                                <button type="button" @click="modification = false" class="btn btn-secondary">Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div v-else class="loading-message">
                    <p>Chargement des informations client...</p>
                </div>
            </div>
            
            </div>

        <div v-if = "userInfos.role == 'CLIENT'">
            <h2 class="main-title section-separator">
                Mes Réservations                     
                <InfoBulle text="Rajoutez vos activités avec le bouton 'Afficher détail/modifier'. Faites une demande d'annulation avec le bouton 'Annulation'" link="/faq"/>
            </h2>
        
            <div v-if="userInfos && userInfos.reservations && userInfos.reservations.length > 0" class="reservations-list">
                <div v-for="reservation in userInfos.reservations" :key="reservation.numreservation" class="reservation-item">
                    
                    <div class="reservation-details">
                        <RouterLink :to="`/club/${reservation.club.idclub}`" class="club-title">
                            {{reservation.club.titre}}
                        </RouterLink>
                        <p class="dates">{{reservation.datedebut}} - {{reservation.datefin}}</p>
                        
                        <div class="reservation-footer">
                            <p :class="['status', `status-${reservation.statut.toLowerCase()}`]">
                                {{reservation.statut}}
                            </p>
                            <p class="price-tag">{{reservation.prix}} €</p>
                        </div>
                        <p v-if="reservation.etat_calcule!='null'">{{reservation.etat_calcule}}</p>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                            
                        <div v-if = "reservation.etat_calcule =='PASSÉ'" >
                            <button style="background-color: #000; color: #fff;" class="btn-avis" @click="donnerAvis(reservation)">Donner un avis</button>
                        </div>
                        <button class="btn-avis" @click="openModal(reservation)">Afficher détail/modifier</button>
                        
                    </div> 
                    <button class="btn-avis" v-if="!reservation.veut_annuler && reservation.statut != 'ANNULEE' &&  reservation.statut != 'REFUSE'  && reservation.etat_calcule != 'PASSÉ'" @click="DemandeAnnulation(reservation.numreservation)">Annulation </button>
                </div>
            </div>
            <div v-else-if="userInfos" class="no-reservations">
                <p>Vous n'avez aucune réservation en cours ou passée.</p>
            </div>
        </div>

        <div v-else-if="userInfos.role =='VENTE'">
            <h1>reservation</h1>
            <div @click="EnvoiSurVente">
                <p style="text-decoration: underline;cursor: pointer;margin-top: 15px;">Voir les reservations</p>
            </div>
        </div>
        <div v-else-if="userInfos.role == 'DIRECTEUR-VENTE'">
            <h1>Analyse Vente</h1>
            <div @click="EnvoiSurAnalyse">
                <p style="text-decoration: underline;cursor: pointer;margin-top: 15px;">Voir les analyses ventes</p>
            </div>
        </div>
        
        <div v-if="!modification" class="logout-container">
            <button @click="logout" class="btn btn-logout">Se déconnecter</button>
        </div>
    </div>

    <div v-if="showModalPassword" class="modal-overlay">
        <div class="modal-content">
            <h3>Réinitialisation sécurisée</h3>
            <p v-if="messageMdpSucces" style="color: green;">{{ messageMdpSucces }}</p>
            <div class="form-group">
                <label>Mot de passe actuel</label>
                <input type="password" v-model="formMdp.ancien_mdp">
            </div>
            <div class="form-group">
                <label>Nouveau mot de passe</label>
                <input type="password" v-model="formMdp.nouveau_mdp">
            </div>
            <div class="form-group">
                <label>Confirmer</label>
                <input type="password" v-model="formMdp.nouveau_mdp_confirmation">
            </div>
            <div class="modal-actions">
                <button @click="validerChangementMdp" class="btn-valider">Enregistrer</button>
                <button @click="showModalPassword = false" class="btn-annuler">Fermer</button>
            </div>
        </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <span class="close-btn" @click="closeModal">&times;</span>
            
            <h2 class="section-title" style="margin-top:0;">
                {{ modalView === 'payment' ? 'Paiement Sécurisé' : 'Détails de la réservation' }}
            </h2>
            
            <div v-if="selectedReservation && modalView === 'details'">
                <h3 class="club-title">{{ selectedReservation.club.titre }}</h3>
                <div class="info-group">
                    <span class="info-label">Prix total :</span>
                    <span class="price-tag" style="font-size: 1.2em;">{{ selectedReservation.prix }} €</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Statut :</span>
                    <span :class="['status', `status-${selectedReservation.statut.toLowerCase()}`]">{{ selectedReservation.statut }}</span>
                </div>

                <section v-if="ActiviteSupplémentaire">
                    <div class="info-group">
                        <span class="info-label">Ajouter activite :</span>
                        <div style="margin-top: 20px; text-align: right;">
                            <button class="btn btn-primary" @click="lesActivitesSel.push({ nbpersonnes: 1 })">Ajouter</button>
                        </div>
                    </div>
                    
                    <div v-for="(activiteSel, index) in lesActivitesSel" :key="index" style="margin-bottom: 10px;">
                        <p style="margin-bottom: 5px; font-weight: bold;">Activité {{ index + 1 }}</p>
                        <select v-model="lesActivitesSel[index].activite">
                            <option value="" disabled>Choisir une activité</option>
                            <option v-for="activite in getOptionsDisponibles(index)" :key="activite.idactivite" :value="activite">
                                {{ activite.titre }} ({{ activite.prixmin }}€)
                            </option>
                        </select>
                        <div class="quantite-container" style="margin-top:5px;">
                            <button class="btn-qty" @click="lesActivitesSel[index].nbpersonnes > 1 && lesActivitesSel[index].nbpersonnes--">-</button>
                            <input type="number" class="input-qty" v-model="lesActivitesSel[index].nbpersonnes" :max="selectedReservation.nbpersonnes" :min="1" @keydown.prevent>
                            <button class="btn-qty" @click="lesActivitesSel[index].nbpersonnes < selectedReservation.nbpersonnes && lesActivitesSel[index].nbpersonnes++">+</button>
                            <button @click="lesActivitesSel.splice(index, 1)" style="margin-left: 10px; color: red; border:none; background:transparent; cursor:pointer;">Supprimer</button>
                        </div>
                    </div>

                    <h1>Total à payer : {{prixTotal}} €</h1>
                    <div style="margin-top: 20px; text-align: right;">
                        <button class="btn btn-primary" @click="passerAuPaiement" v-if="lesActivitesSel.length > 0">Payer</button>
                        <button class="btn btn-secondary" @click="closeModal">Fermer</button>
                    </div>
                </section>
                
                <section v-else >
                    <span class="info-label">Activites déjà réservées</span>
                    <div v-for="(item, index) in selectedReservation.activites" :key="index">
                        <p>- {{item.titre}} ({{item.pivot.nbpersonnes}} pers.)</p>
                    </div>
                </section>
            </div>
            
            <div v-else-if="modalView === 'payment'">
                <p style="margin-bottom: 20px; font-size: 0.9em; color: #666;">
                    Montant à régler : <strong>{{ prixTotal }} €</strong>
                </p>
                
                <StripePayment 
                    :montant="prixTotal" 
                    :reservationId="selectedReservation.numreservation" 
                    @success="onPaiementSuccess" 
                />

                <div style="margin-top: 25px; text-align: center;">
                    <button class="btn btn-secondary" @click="modalView = 'details'">Annuler / Retour</button>
                </div>
            </div>
        </div>
    </div>
    
    <div style="text-align:center;">
        <RouterLink to="/admin/propositions" v-if="userInfos.role == 'VENTE'">
            <button class="btn btn-primary" style="margin: 20px;">GESTION REFUS PROPOSITION</button>
        </RouterLink>
        <RouterLink to="/directeur-marketing" v-if="userInfos.role == 'DIRECTEUR_MARKETING'">
            <button class="btn btn-primary" style="margin: 20px;">GESTION NOUVEAUX CLUBS</button>
        </RouterLink>
        <RouterLink to="/membremarketing" v-if="userInfos.role == 'MARKETING'">
            <button class="btn btn-primary" style="margin: 20px;">GESTION NOUVEAUX CLUBS</button>
        </RouterLink>
        <RouterLink to="/validation-club" v-if="userInfos.role == 'DIRECTEUR-VENTE'">
            <button class="btn btn-primary" style="margin: 20px;">VALIDATION DES CLUBS</button>
        </RouterLink>
    </div>
    
    <Footer />
</template>

<style scoped>
/* Styles conservés */
.quantite-container { display: flex; align-items: center; gap: 10px; }
.btn-qty { width: 38px; height: 38px; border-radius: 10px; border: none; font-size: 20px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #333; }
.btn-qty:hover { background: #e0e0e0; }
.input-qty { width: 55px; text-align: center; font-size: 18px; padding: 5px 0; border-radius: 10px; border: 2px solid #ccc; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background-color: white; padding: 30px; border-radius: 8px; width: 90%; max-width: 600px; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
.close-btn { position: absolute; top: 10px; right: 15px; font-size: 28px; font-weight: bold; cursor: pointer; color: #aaa; }
.close-btn:hover { color: #000; }
.client-container { max-width: 1000px; margin: 0 auto; padding: 20px; }
.main-title { text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 64px; font-weight: 100; font-style: italic; margin: 80px 0 40px; }
.section-separator { margin-top: 80px; margin-bottom: 40px; }
.profile-card { background-color: #ffffff; padding: 40px; border: 1px solid #ccc; }
.section-title { font-size: 32px; font-weight: 600; margin-bottom: 30px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; }
.subsection-title { font-size: 20px; margin-top: 20px; margin-bottom: 15px; }
.info-group { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 1.1em; }
.info-label { font-weight: bold; }
.address-details p { margin: 5px 0; padding-left: 10px; }
.action-buttons { margin-top: 40px; display: flex; gap: 15px; justify-content: flex-start; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
.form-group { position: relative; }
.form-group label { display: block; font-weight: bold; margin-bottom: 5px; color: #555; font-size: 0.9em; }
input, select { outline: none; width: 100%; padding: 10px; border: 1px solid #ccc; box-sizing: border-box; }
input:focus, select:focus { border-color: #000; }
.address-fields { grid-template-columns: 80px 1fr 120px 1fr; }
.form-actions { margin-top: 30px; display: flex; gap: 15px; justify-content: flex-end; }
.btn { padding: 10px 25px; border: none; cursor: pointer; font-weight: bold; transition: 0.2s; }
.btn-primary { border: 1px solid #000; background-color: #000; color: white; }
.btn-primary:hover { background-color: #fff; color: #000; }
.btn-secondary { background: none; border: 1px solid #ccc; color: #000; }
.btn-secondary:hover { color: #fff; background-color: #000; }
.btn-logout { background-color: #f44336; color: white; padding: 10px 30px; }
.btn-logout:hover { background-color: #cc3322; }
.success-message { padding: 15px; background-color: #e8f5e9; color: #4caf50; border: 1px solid #c8e6c9; border-radius: 4px; margin-bottom: 20px; text-align: center; }
.error-message { padding: 10px; background-color: #ffebee; color: #f44336; border: 1px solid #ffcdd2; border-radius: 4px; margin: 5px 0; font-size: 0.9em; display: flex; align-items: center; }
.reservations-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 20px; }
.reservation-item { background-color: #fff; padding: 20px; border: 1px solid #ccc; }
.club-title { font-size: 24px; font-weight: bold; color: #000; text-decoration: none; margin-bottom: 5px; }
.club-title:hover { text-decoration: underline; }
.dates { color: #000; margin-bottom: 15px; font-size: 0.95em; }
.reservation-footer { margin-top: 10px; border-top: 1px solid #f0f0f0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; }
.status { padding: 5px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold; }
.status-confirmee { background-color: #e8f5e9; color: #4caf50; }
.status-annulee { background-color: #ffcdd2; color: #f44336; }
.status-en_attente { background-color: #fff9c4; color: #ccbb1f; }
.price-tag { font-size: 1.5em; font-weight: bold; color: #000; }
.no-reservations { text-align: center; padding: 30px; background-color: #fff; border: 1px solid #ccc; }
.btn-avis { padding: 8px 22px; border: 1px solid #ccc; background: none; font-weight: bold; margin-top: 10px; transition: .2s; cursor: pointer; }
.btn-avis:hover { background-color: #000; color: #fff; }
.logout-container { text-align: right; margin-top: 40px; }
.a2f-modal { text-align: center; max-width: 500px; }
.modal-actions { display: flex; justify-content: center; gap: 15px; margin-top: 20px; }
.input-code-a2f { font-size: 24px; letter-spacing: 8px; text-align: center; width: 150px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; margin: 0 auto; display: block; outline: none; transition: border-color 0.3s; }
.input-code-a2f:focus { border-color: #000; }
</style>