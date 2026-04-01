<script setup>
    import { useRoute, useRouter } from 'vue-router';
    import { ref, onMounted, computed, watch } from 'vue'; 
    import { getClubImageUrl, getStorageUrl } from '../utils/imageUtils';
    import api from '../services/api';
    import NavBar from '../components/NavBar.vue';
    import Footer from '../components/Footer.vue';
    import InfoBulle from '../components/InfoBulle.vue';
    
    const router = useRouter();
    const route = useRoute();
    
    const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;
    
    const dateArrivee = ref('');
    const dateDepart = ref('');
    
    const prixActuel = ref(null); 
    const messageErreur = ref('');
    
    const chargementCheckbox = ref(false);
    const userInfos = ref(null);

    const id = route.params.id; 
    const club = ref(null); 
    const erreur = ref(null);
    const chargement = ref(true);
    const typechambre = ref([]);
    const activeSection = ref('station');
    
    const activitesEnfants = ref([]);
    const activitesAdulte = ref([]);
    const activitesPourTous = ref([]);
    const groupeTranchedAge = ref({});
    const groupeTypeActivite = ref({});
    
    const transport = ref([]);
    const TransportSelect = ref(null);
    
    const modalOuverte = ref(false);
    const activiteSelectionnee = ref(null);
    const modalView = ref('details');
    
    const typeChambreSelect = ref(null);
    const nbPersonne = ref(1); 
    const prixCalcule = ref(null);
    const lieuRestauration = ref([]);
    
    const changerDisponibilite = async (type) => {
    chargementCheckbox.value = true;
    try {
        await api.post(`/updateDisponibiliteTypeChambre/${type.idtypechambre}`, {
            indisponible: type.indisponible
        });

        console.log(`Chambre ${type.idtypechambre} mise à jour : ${type.indisponible}`);

    } catch (e) {
        console.error("Erreur sauvegarde", e);
        type.indisponible = !type.indisponible;
        alert("Erreur : Impossible de modifier la disponibilité.");
    } finally {
        chargementCheckbox.value = false;
    }
};
onMounted(async () => {

    try {
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
            console.log("Données sécurisées reçues :", data.user);

            localStorage.setItem('user_infos', JSON.stringify(data.user));
            userInfos.value = data.user;

        } else {
            console.log("Session expirée ou invalide");
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_infos');
            userInfos.value = null;
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du token", error);
    }
});

    const fetchPrixSejour = async () => {
        if (!dateArrivee.value || !dateDepart.value) return;
    
        try {
            messageErreur.value = ''; 
            
            const response = await api.get(`/clubs/${id}/prix`, {
                params: {
                    date_debut: dateArrivee.value,
                    date_fin: dateDepart.value
                }
            });
            
            prixActuel.value = response.data.prix;
            
        } catch (error) {
            console.error("Erreur lors de la récupération du prix", error);
            prixActuel.value = null;
            
            if (error.response && error.response.status === 404) {
                messageErreur.value = "Dates hors périodes disponibles.";
            }
        }
    };
    
    
    watch([dateArrivee, dateDepart], () => {
        fetchPrixSejour();
    });
    
    const ouvrirModal = (activite) => {
        activiteSelectionnee.value = activite;
        modalView.value = 'details'; 
        modalOuverte.value = true;
    };
    
    const fermerModal = () => {
        modalOuverte.value = false;
        setTimeout(() => {
            activiteSelectionnee.value = null;
            modalView.value = 'details';
        }, 300);
    };
    
    const scrollToSection = (sectionId) => {
        activeSection.value = sectionId; 
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    
    const nettoyerPrix = (valeur) => {
        if (!valeur) return 0;
        const texte = String(valeur);
        const prixPropre = texte.replace(/[^0-9.]/g, '');
        return Number(prixPropre);
    };
    
    const estDateInvalide = computed(() => {
        if (!dateArrivee.value || !dateDepart.value) return false;
        const dateDebut = new Date(dateArrivee.value);
        const dateFin = new Date(dateDepart.value);
        const aujourdhuiMinuit = new Date();
        aujourdhuiMinuit.setHours(0, 0, 0, 0);
        const erreurOrdre = dateDebut > dateFin;
        const erreurPasse = dateDebut < aujourdhuiMinuit; 
        return erreurOrdre || erreurPasse;
    });
    
    const nombreJoursCalculé = computed(() => {
        if ((!dateArrivee.value || !dateDepart.value) || estDateInvalide.value) return 0;
        const debut = new Date(dateArrivee.value);
        const fin = new Date(dateDepart.value);
        const diffTime = fin - debut;
        if (diffTime <= 0) return 0;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));     
    });
    
    const prixTransport = computed(() => {
        return TransportSelect.value?.prix ? nettoyerPrix(TransportSelect.value.prix) : 0;
    });
    
    const prixTotalAvecTransport = computed(() => {      
        const prixBase = prixCalcule.value || 0;
        const prixSejour = nombreJoursCalculé.value * prixBase;
        const prixTransportTotal = prixTransport.value * (nbPersonne.value || 1);
        
        return prixSejour + prixTransportTotal;
    });
    
    watch([nbPersonne, typeChambreSelect, dateArrivee, dateDepart], async () => {
    if (estDateInvalide.value) {
        prixCalcule.value = null;
        return;
    }

    if (nbPersonne.value && typeChambreSelect.value && dateArrivee.value && dateDepart.value) {
        
        if (nbPersonne.value < 1) nbPersonne.value = 1;
        
        try {
           
            const reponse = await api.get(`prixbyidtypechambre/${typeChambreSelect.value.idtypechambre}`, {
                params: {
                    date_debut: dateArrivee.value,
                    date_fin: dateDepart.value
                }
            });
            

            let prixBaseChambre = nettoyerPrix(reponse.data); 
            
            
            if (isNaN(prixBaseChambre)) {
                 console.warn("Prix reçu invalide ou période non trouvée");
                 prixBaseChambre = 0;
            }

            if (nbPersonne.value > typeChambreSelect.value.capacitemax) {
                prixBaseChambre = prixBaseChambre * Math.ceil(nbPersonne.value / typeChambreSelect.value.capacitemax);
            }
            
            prixCalcule.value = prixBaseChambre;

        } catch (e) {
            console.error("Erreur prix:", e);
            prixCalcule.value = 0;
        }
    } else {
        prixCalcule.value = null;
    }
});
    
    const stationDetails = computed(() => {
        if (club.value && club.value.stationDetails) return club.value.stationDetails;
        if (club.value && club.value.stations && club.value.stations.length > 0) return club.value.stations[0];
        if (club.value && club.value.clubstation && club.value.clubstation.station && club.value.clubstation.station.length > 0) {
            const station = club.value.clubstation.station[0];
            station.altitudeclub = club.value.clubstation.altitudeclub; 
            return station;
        }
        return null;
    });
    
    const chargerClub = async () => {
    try {
        
        typechambre.value = [];
        activitesEnfants.value = [];
        activitesAdulte.value = [];
        activitesPourTous.value = [];
        groupeTranchedAge.value = {};
        groupeTypeActivite.value = {}; 
        
        const reponse = await api.get(`/club/${id}`);
        club.value = reponse.data;
        console.log("b",club.value)
        
        if (!club.value.chambres) club.value.chambres = [];
        if (!club.value.activites) club.value.activites = [];
        club.value.chambres.forEach(chambre => {
    if (chambre.type_chambre && !typechambre.value.some(t => t.idtypechambre == chambre.type_chambre.idtypechambre)){ 
        const typeObj = { ...chambre.type_chambre };
        typechambre.value.push(typeObj);
    }
});

        for (const type of typechambre.value) {
            try {
                const prixReponse = await api.get(`prixbyidtypechambre/${type.idtypechambre}`);
                type.prix = nettoyerPrix(prixReponse.data);
            } catch (err) {
                type.prix = 0; 
            }
        }

        activitesEnfants.value = club.value.activites.filter(act => act && act.enfant);
        activitesAdulte.value = club.value.activites.filter(act => act && act.adulte);
        activitesPourTous.value = club.value.activites.filter(act => act && !act.adulte && !act.enfant);
        console.log("enfant",activitesEnfants.value)
        console.log("adulte",activitesAdulte.value)
        console.log("tous",activitesPourTous.value)

        if (activitesEnfants.value && activitesEnfants.value.length > 0) {
            activitesEnfants.value.forEach(act => {
                if (!act.enfant || !act.enfant.trancheage) return;

                let titre = "De " + act.enfant.trancheage.agemin + " à " + act.enfant.trancheage.agemax;
                if(!groupeTranchedAge.value[titre]){
                    groupeTranchedAge.value[titre]  = {
                        activite: [],
                        nombreInclus: 0,
                        nombreAlaCarte: 0
                    };
                }
                if(act.prixmin == 0){
                    groupeTranchedAge.value[titre].nombreInclus++;
                } else {
                    groupeTranchedAge.value[titre].nombreAlaCarte++;
                }
                groupeTranchedAge.value[titre].activite.push(act);
            });
        }

        if (activitesAdulte.value && activitesAdulte.value.length > 0) {
            activitesAdulte.value.forEach(act => {
                if (!act.adulte || !act.adulte.typeactivite) return;

                let titreType = act.adulte.typeactivite.titre;

                if(!groupeTypeActivite.value[titreType]){
                    groupeTypeActivite.value[titreType] = {
                        activite: [],
                        description: '',
                        nombreInclus: 0,
                        nombreAlaCarte: 0,
                        photoUrl: null 
                    };
                }

                if(act.prixmin <= 0 ){
                    groupeTypeActivite.value[titreType].nombreInclus++;
                } else {
                    groupeTypeActivite.value[titreType].nombreAlaCarte++;
                }

                groupeTypeActivite.value[titreType].activite.push(act);
                groupeTypeActivite.value[titreType].description = act.adulte.typeactivite.description;
                
                if (act.adulte.typeactivite.photo) {
                    groupeTypeActivite.value[titreType].photoUrl = act.adulte.typeactivite.photo.url;
                }
            });
        }

        if (club.value.lieurestauration) {
            lieuRestauration.value = club.value.lieurestauration;
        }

    } catch (e) {
        erreur.value = "Impossible de charger le club.";
        console.error("ERREUR CHARGEMENT CLUB:", e);
    } 
};
    
    const chargerTransports = async () => {
        try {
            const response = await api.get('/transports');
            if (response.data.success) {
                transport.value = response.data.data;
            } else {
                transport.value = response.data;
            }
        } catch (err) {
            console.error('Erreur chargement transports:', err);
        }
    };
    
    const allerAuPaiement = () => {
        const nouvelleReservation = {
            id_unique: Date.now(),
            club: club.value, 
            dateDebut: dateArrivee.value,
            dateFin: dateDepart.value,   
            nbPersonnes: nbPersonne.value,
            typeChambre: typeChambreSelect.value,
            prixTotal: prixTotalAvecTransport.value,
            dureeSejour: nombreJoursCalculé.value,
            transport: TransportSelect.value
        };
        let panier = JSON.parse(localStorage.getItem('reservationClubMed'));
        if (!Array.isArray(panier)) {
            panier = [];
        }
        panier.push(nouvelleReservation);
        localStorage.setItem('reservationClubMed', JSON.stringify(panier));
        router.push('/reservation');
    };
    
    const chargerPrix = async () => {
        if (club.value && club.value.idclub) {
            try {
                const url = `/clubs/prix/${club.value.idclub}`;
                const response = await api.get(url);
                club.value.prix = response.data; 
            } catch (err) {
                console.error(`Impossible de charger le prix`, err);
                club.value.prix = "N/A"; 
            }
        }
    };
    
    const getDynamicImageUrl = (url) => {
        if (!url) return '';
        if (url.includes('avis_photos/')) {
            return getStorageUrl(url);
        }
        return getClubImageUrl(url);
    };
    
    onMounted(async () => {
        try {
            await chargerClub(); 
            await chargerPrix();
            await chargerTransports(); 
        } catch (e) {
            erreur.value = erreur.value || "Une erreur inconnue est survenue.";
            console.error("Erreur fatale dans onMounted", e);
        } finally {
            chargement.value = false;
        }
    });
    </script>

<template>
    <NavBar />

    <div class="club-detail-container">
        
        <div v-if="chargement" class="loading-message">Chargement en cours...</div>
        
        <div v-else-if="club" class="club-content">
            
            <section class="header-section">
                <p class="localisation-text">{{ club.pays.nompays }}</p>
                <h1 class="main-title">{{ club.titre }}</h1>
                <p class="description-text">{{ club.description }}</p>
                <header>
                        <!-- ici -->
                    <img
                        :src="getDynamicImageUrl(club.photo.url)" 
                        :alt="'Photo principale de ' + club.titre"
                        class="main-image"
                    />

                    <div class="price-note">
                        <p class="price-wrapped">
                            <span>A partir de </span><br>
                            <span class="price-value">{{ club.prix }}</span>
                        </p>
                        <p class="note-wrapped">
                            <span>Note moyenne </span> 
                            <span class="note-value">{{ Number(club.notemoyenne).toFixed(1) }}/5 ⭐</span>
                        </p>
                    </div>

                </header>

            </section>
            <p class="section-para-inf" style="font-size: 16px; text-align: center; margin: 75px auto 0 auto; font-style: italic; color: #777;justify-content: center;">
                Commencez votre reservation dès maintenant (chambre, dates, participants)
                <InfoBulle text="Le prix du séjour s'ajustera automatiquement en fonction des dates. Le prix varie selon le niveau de confort de la chambre choisie. Le transport inclut le vol aller-retour et le transfert jusqu'au Resort." link="/faq"/>

            </p>
            <div class="debreservation"> 
                <select v-model="typeChambreSelect">
                    <option :value="null" selected disabled>Chambre</option>
                    <option v-for="type in typechambre" :key="type.idtypechambre" :value="type" :disabled="type.indisponible">
                        {{ type.nomtype }} {{ type.indisponible ? '(Non disponible)' : '' }} 
                    </option>
                </select>
                
                <div class="reservation-form" style="display:flex;">
                    <label style="display: flex;align-items:center"> <span style="font-size: 12px;font-weight: bold;color:#111;padding-left: 8px;">Départ</span><input type="date" style="width: 140px;" v-model="dateArrivee"></label>
                    <label style="display: flex;align-items:center"> <span style="font-size: 12px;font-weight: bold;color:#111;padding-left: 8px;">Arrivée</span><input type="date" style="width: 140px;" v-model="dateDepart"></label>

                    <div class="price-display mt-4">
                        <p v-if="prixActuel">
                            Prix pour la période : <strong>{{ prixActuel }} €</strong>
                        </p>
                        <p v-else-if="messageErreur" class="text-red-500">
                            {{ messageErreur }}
                        </p>
                        <p v-else>
                            Sélectionnez vos dates pour voir le tarif.
                        </p>
                    </div>
                </div>
                <input type="number" placeholder="Participants" v-model="nbPersonne" :min="1"></input>
                
                <select v-model="TransportSelect">
                    <option :value="null" disabled>Transport</option>
                        <option v-for="tr in transport" :key="tr.idtransport" :value="tr">
                            {{ tr.lieudepart }}
                        </option>
                    </select>
                    <button 
                        @click="allerAuPaiement"
                        :disabled="!TransportSelect || estDateInvalide || !prixCalcule"
                        :style="{ opacity: (estDateInvalide || nombreJoursCalculé === 0) ? 0.5 : 1, cursor: (estDateInvalide || nombreJoursCalculé === 0) ? 'not-allowed' : 'pointer' }"
                    >
                        Continuer ({{ (prixTotalAvecTransport ) || 0 }} €)
                    </button>
                
                                        
            </div>
                
            <main>

                <ul class="menu-sticky">
                    <li v-if="stationDetails" :class="{ active: activeSection === 'station' }">
                        <a href="#station" @click.prevent="scrollToSection('station')">Station</a>
                    </li>
                    <li :class="{ active: activeSection === 'hebergement' }">
                        <a href="#hebergement" @click.prevent="scrollToSection('hebergement')">Hébergement</a>
                    </li>
                    <li :class="{ active: activeSection === 'lieuRestauration' }">
                        <a href="#lieuRestauration" @click.prevent="scrollToSection('lieuRestauration')">Restauration & Bar</a>
                    </li>
                    <li :class="{ active: activeSection === 'activite' }">
                        <a href="#activite" @click.prevent="scrollToSection('activite')">Activités</a>
                    </li>
                    <li :class="{ active: activeSection === 'avis' }">
                        <a href="#avis" @click.prevent="scrollToSection('avis')">Avis</a>
                    </li>
                </ul>

                <section class="main-wrapped">

                    <section class="content-section" id="station" v-if="stationDetails">
                        <h2>Domaine Skiable</h2>
                        <div class="room-types-grid">            
                            <div class="room-type-item station-card">                
                                <div class="room-wrapped">
                                    
                                    <h3 class="room-title">{{ stationDetails.nomstation }}</h3>                                
                                    <div class="room-specs station-specs-grid">
                                        <span class="spec-tag">Altitude de la Station : {{ stationDetails.altitudestation }}m</span>
                                        <span class="spec-tag">Longueur totale des pistes : {{ stationDetails.longueurpistes }}km</span>
                                        <span class="spec-tag">Nombre de Pistes : {{ stationDetails.nbpistes }}</span>
                                    </div>                                
                                    <p class="station-info-ski">{{ stationDetails.infoski }}</p>
                                </div>       
                                <div class="room-image"></div> 
                            </div>
                        </div>
                    </section>

                    <section class="content-section" id="hebergement">
                        <h2 class="section-title-heber">
                            Hébergement 
                            <InfoBulle text="Prix indicatif par personne pour chaque type de chambre. Le tarif final sera calculé en haut de page selon vos dates et le nombre de participants." link="/faq"/>

                        </h2>
                        <div class="room-types-grid">
                            <div v-for="type in typechambre" :key="type.idtypechambre" class="room-type-item">
                                <div class="room-wrapped">
                                    <h3 class="room-title">{{ type.nomtype }}</h3>
                                    <p class="room-description">{{ type.textepresentation }}</p>
                                    
                                    <div class="room-specs">
                                        <span class="spec-tag">Capacité max : {{ type.capacitemax }} pers.</span>
                                    </div>
                                    <div class="room-prix" style="font-size: 24px; font-weight: bold; margin-top: auto;">
                                        {{ type.prix }}€
                                    </div>
                                    <div v-if="userInfos && userInfos.role == 'MARKETING'" style="margin: 20px; display: flex; align-items: center;">
                                        <input 
                                            type="checkbox" 
                                            :id="'check-indisponible-' + type.idtypechambre" 
                                            v-model="type.indisponible"
                                            @change="changerDisponibilite(type)"
                                            :disabled="chargementCheckbox"
                                            style="transform: scale(1.2); cursor: pointer;"
                                        >
                                        <label 
                                            :for="'check-indisponible-' + type.idtypechambre" 
                                            style="margin-left: 10px; font-size: 0.9em; font-weight: bold; cursor: pointer;"
                                            :style="{ opacity: chargementCheckbox ? 0.5 : 1 }"
                                        >
                                            <span v-if="type.indisponible" style="color: red;">Indisponible (Fermé à la vente)</span>
                                            <span v-else style="color: green;">Disponible</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="room-image">
                                    <!-- ICIII -->
                                    <img
                                        v-if="type.photo" 
                                        :src="getDynamicImageUrl(type.photo.url)" 
                                        :alt="type.nomtype"
                                        
                                    />

                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="content-section" id="lieuRestauration">
                        <h2 class="section-title-resto">
                            Nos Restaurants & Bars 
                            <InfoBulle text="Les restaurants & Bars se trouveront directement sur place. Place pour handicapés et fauteuil roulant avec boost disponible gratuitement sur place pour les fan de Rocket League" link="/faq"/>

                        </h2>
                        <div v-if="lieuRestauration.length > 0" class="restauration-section">
                            <div v-for="lieu in lieuRestauration" :key="lieu.numrestauration" class="restauration-item">
                                <div class="restauration-image"></div>
                                <div class="restauration-content">
                                    <h3>{{ lieu.nom }}</h3>
                                    <span class="badge presentation"><em>{{ lieu.estbar ? 'Bar' : 'Restaurant' }} {{ lieu.presentation }}</em></span>
                                    <p class="description">{{ lieu.description }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            Aucun lieu de restauration a été attribué ici
                        </div>
                            
                    </section>

                    <section class="content-section" id="activite">
                        
                        <h2 class="section-title">
                            Nos Activités 
                            <InfoBulle text="Vous sélectionnerez les activités à la suite de votre réservation (ex: Ski Alpin, Club Enfants)." link="/faq"/>

                        </h2>
                        <div v-if="club.activites && club.activites.length > 0">
                            
                            <!-- ADULTES -->
                            <div v-if="activitesAdulte.length > 0" class="adults-section">
                                <h3 class="section-title-age">
                                    Adultes
                                    <InfoBulle text="Inclus : compris dans votre forfait. À la carte : supplément à régler lors de la réservation." link="/faq"/>

                                </h3>
                                
                                <div v-for="(valeur, cle) in groupeTypeActivite" :key="cle" class="group-block">
                                    
                                    <!-- En-tête Catégorie -->
                                    <div class="group-header">
                                        <!-- Image -->
                                        <div v-if="valeur.photoUrl" class="hero-image-wrapper">
                                            <!-- ICCIIIIIII -->
                                            <img  :src="getDynamicImageUrl(valeur.photoUrl)" :alt="cle" class="hero-image"/>
                                            
                                            <h3 class="hero-title">{{ cle }}</h3>
                                        </div>

                                        <!-- Description & Badges -->
                                        <div class="group-description">
                                            <!-- Titre si pas d'image -->
                                            <h3 v-if="!valeur.photoUrl" class="category-header-title" >{{ cle }}</h3>
                                            
                                            <p>{{ valeur.description }}</p>
                                            
                                            <div class="stats-badges">
                                                <span v-if="valeur.nombreInclus > 0" class="badge-activite badge-success">
                                                    {{ valeur.nombreInclus }} Inclus
                                                </span>
                                                <span v-if="valeur.nombreAlaCarte > 0" class="badge-activite badge-warning">
                                                    {{ valeur.nombreAlaCarte }} À la carte
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Grille Cartes Activités -->
                                    <div class="cards-grid">
                                        <div v-for="act in valeur.activite" :key="act.idactivite" class="activity-card" @click="ouvrirModal(act)">
                                            <div class="card-header">
                                                <h5 class="card-title">{{ act.titre }}</h5>
                                                <span v-if="act.prixmin > 0">{{ act.prixmin }} €</span>
                                                <span v-else >Inclus</span>
                                            </div>
                                            
                                            <p class="card-desc">{{ act.description }}</p>

                                            <div class="card-footer">
                                                <span>En savoir plus</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ENFANTS -->
                            <div v-if="activitesEnfants.length > 0" class="kids-section">
                            
                                <h3 class="section-title-age">
                                    Adultes
                                    <InfoBulle text="Inclus : compris dans votre forfait. À la carte : supplément à régler lors de la réservation." link="/faq"/>

                                </h3>

                                <div v-for="(valeur, cle) in groupeTranchedAge" :key="cle" class="kids-block">
                                    <div class="kids-header">
                                        <h3 class="kids-title">
                                            {{ cle }} ans
                                        </h3>
                                        <div class="stats-badges">
                                            <span v-if="valeur.nombreInclus > 0" class="badge-activite">{{ valeur.nombreInclus }} Inclus</span>
                                            <span v-if="valeur.nombreAlaCarte > 0" class="badge-activite">{{ valeur.nombreAlaCarte }} À la carte</span>
                                        </div>
                                    </div>

                                    <div class="kids-grid">
                                        <div v-for="act in valeur.activite" :key="act.idactivite" class="kids-card" @click="ouvrirModal(act)">
                                            <div class="kids-card-top">
                                                <h5 class="kids-card-title">{{ act.titre }}</h5>
                                                <div v-if="act.prixmin > 0" class="kids-price">{{ act.prixmin }}€</div>
                                                <div v-else class="kids-price">Inclus</div>
                                            </div>
                                            <p class="kids-card-desc">{{ act.description }}</p>
                                            <span class="kids-link">Détails</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Empty State -->
                        <div v-else class="empty-state">
                            <p>Aucune activité disponible pour le moment.</p>
                        </div>
                    </section>

                    <section class="content-section" id="avis">
                        <h2>
                            Avis Clients 
                            <InfoBulle text="Publiez un avis à la fin de votre séjour." link="/faq"/>
                        </h2>
                        
                        <div class="section-card">
                            <div v-if="club.avis && club.avis.length > 0" class="reviews-list">
                                <div v-for="avi in club.avis" :key="avi.numavis" class="review-item"> 
                                    <span class="review-client">Client : {{avi.numclient}}</span><br>
                                    <span class="review-note">{{ avi.note }}/5 ⭐</span>
                                    <p style="font-weight: bold; font-size: 18px; margin-top: 10px;"> {{avi.titre}} </p>
                                    <p class="review-comment">" {{ avi.commentaire }} "</p>

                                    <div v-if="avi.photos && avi.photos.length > 0" class="review-photos-large">
                                        <img
                                            v-for="photo in avi.photos" 
                                            :key="photo.numphoto" 
                                            :src="getDynamicImageUrl(photo.url)" 
                                            alt="Photo de l'avis" 
                                            class="review-image-big"
                                        >
                                    </div>
                                
                                    <p v-if="avi.reponse" class="review-response">Reponse : {{ avi.reponse }}</p>
                                </div> 
                            </div>
                            <div v-else class="no-reviews">
                                <p>Aucun avis n'a été publié pour ce club.</p>
                            </div>
                        </div>
                    </section>                    
                    
                    
                </section>
            </main>
        </div>
        <div v-else>
            Erreur : Club introuvable
        </div>
        
        <div v-if="modalOuverte && activiteSelectionnee" @click="fermerModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;">
            <div @click.stop style="background: white; border: 1px solid #ccc; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">

                <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 30px; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; background: white; z-index: 10;">
                    <div style="flex: 1;">
                        <h3 style="font-size: 28px; font-weight: 600; margin-bottom: 8px; color: #000;">
                            {{ modalView === 'login' ? 'Connexion requise' : activiteSelectionnee.titre }}
                        </h3>
                        <p v-if="modalView !== 'login'" style="color: #666; font-size: 16px;">
                            {{ activiteSelectionnee.description }}
                        </p>
                        <p v-else style="color: #666; font-size: 16px;">
                                Veuillez vous connecter pour réserver cette activité.
                        </p>
                    </div>
                    <button @click="fermerModal" style="background: none; border: none; font-size: 28px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-left: 20px; flex-shrink: 0;">
                        ✕
                    </button>
                </div>
            
                <div v-if="modalView === 'details'" style="padding: 30px;">

                    <div style="font-weight: bold; margin-bottom: 10px;">
                        <span v-if="activiteSelectionnee.prixmin > 0">
                            À partir de {{ activiteSelectionnee.prixmin }}€
                        </span>
                        <span v-else style="color: #16a34a;">
                            Inclus dans votre séjour
                        </span>
                    </div>
                
                    <div v-if="activiteSelectionnee.adulte" style="margin-bottom: 30px; padding: 20px; background: #eff6ff; border: 1px solid #3b82f6;">
                        <h4 style="font-size: 20px; margin-bottom: 20px; color: #000;">Informations pratiques</h4>

                        <div style="display: grid; gap: 15px;">
                            <div v-if="activiteSelectionnee.adulte.typeactivite" style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Type d'activité</span>
                                <span style="font-size: 16px; color: #000; font-weight: 600;">{{ activiteSelectionnee.adulte.typeactivite.nomtype }}</span>
                            </div>
                        
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Durée</span>
                                <span style="font-size: 16px; color: #000; font-weight: 600;">{{ activiteSelectionnee.adulte.duree }}h</span>
                            </div>
                        
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Fréquence</span>
                                <span style="font-size: 16px; color: #000; font-weight: 600;">{{ activiteSelectionnee.adulte.frequence }}</span>
                            </div>
                        
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Âge minimum</span>
                                <span style="font-size: 16px; color: #000; font-weight: 600;">{{ activiteSelectionnee.adulte.ageminimum }} ans</span>
                            </div>
                        </div>
                    </div>
                

                    <div v-if="activiteSelectionnee.enfant" style="margin-bottom: 30px; padding: 20px; background: #faf5ff; border: 1px solid #9333ea;">
                        <h4 style="font-size: 20px; margin-bottom: 20px; color: #000;">Informations pratiques</h4>

                        <div style="display: grid; gap: 15px;">
                            <div v-if="activiteSelectionnee.enfant.trancheage" style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Tranche d'âge</span>
                                <span style="font-size: 16px; color: #000; font-weight: 600;">
                                    De {{ activiteSelectionnee.enfant.trancheage.agemin }} à {{ activiteSelectionnee.enfant.trancheage.agemax }} ans
                                </span>
                            </div>
                        
                            <div v-if="activiteSelectionnee.enfant.detail" style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Détails</span>
                                <span style="font-size: 16px; color: #000; font-weight: 400; line-height: 1.6;">{{ activiteSelectionnee.enfant.detail }}</span>
                            </div>
                        </div>
                    </div>
                
                    
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button @click="fermerModal" style="padding: 15px 30px; border: 1px solid #ccc; background: white; font-weight: bold; cursor: pointer;">
                            Fermer
                        </button>
                    </div>
                </div>
                
                <div v-else-if="modalView === 'login'" style="padding: 30px; display: flex; flex-direction: column; gap: 20px; align-items: center;">
                        <div style="width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 15px;">
                            
                            <label style="font-weight: bold; font-size: 14px;">Email</label>
                            <input type="email" placeholder="votre@email.com" style="padding: 12px; border: 1px solid #ccc; width: 100%; font-size: 16px;" />
                            
                            <label style="font-weight: bold; font-size: 14px;">Mot de passe</label>
                            <input type="password" placeholder="Mot de passe" style="padding: 12px; border: 1px solid #ccc; width: 100%; font-size: 16px;" />
                            
                            <button style="background: #000; color: #fff; border: none; padding: 15px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                                Se connecter
                            </button>
    
                            <button @click="modalView = 'details'" style="background: transparent; border: none; text-decoration: underline; cursor: pointer; margin-top: 10px; color: #666;">
                                ← Retour aux détails
                            </button>
                        </div>
                    </div>

            </div>
        </div>
    </div>
    <Footer />
</template>

<style scoped>
.club-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #000;
}

.main-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px;
    font-weight: 100;
    font-style: italic;
    margin-bottom: 10px;
    color: #000;
    text-align: center;
}
.description-text {
    font-size: 1.15em;
    margin-bottom: 30px;
    text-align: center;
    color: #777;
    font-style: italic;
}
.localisation-text {
    margin-top: 40px;
    margin-bottom: 10px;
    font-size: 1em;
    text-align: center;
}
.page-section {
    padding: 30px 0;
    border-top: 1px solid #ccc;
    margin-top: 20px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding-bottom: 30px;
    gap: 30px;
}

.main-image {
    display: block;
    max-width: 800px;
    height: 500px;
    object-fit: cover; 
    flex-grow: 1;
    border-radius: 8px;
}

.price-note {
    align-self: flex-end;
}

.price-wrapped {
    font-size: 18px;
}

.price-value {
    font-weight: 700;
    font-size: 40px;
}

.debreservation {
    background-color: #ffffff;
    border-radius: 50px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    height: 50px;
    width: 90%;
    margin: 20px auto;
    border: 1px solid #e0e0e0;
    position: relative; 
    padding-left: 20px; 
}

.debreservation input,
.debreservation select {
    border: none;
    background: transparent;
    height: 100%;
    padding: 0 15px;
    font-size: 1rem;
    color: #333;
    outline: none;
    border-right: 1px solid #e0e0e0; 
}

.debreservation input:hover,
.debreservation select:hover {
    background-color: #f9f9f9;
}

.debreservation input[type="date"] {
    min-width: 130px;
    cursor: pointer;
    color: #555;
}

.debreservation input[type="number"] {
    width: 150px;
    text-align: center;
}

.debreservation select {
    flex-grow: 1;
    cursor: pointer;
    min-width: 150px;
}

.lien-continents {
    height: 100%;
    display: flex;
    text-decoration: none;
}

.debreservation button {
    background-color: #FFBF00; 
    color: #333;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    height: 100%;
    padding: 0 30px;
    border-radius: 0 50px 50px 0; 
    cursor: pointer;
    transition: .2s;
    white-space: nowrap; 
}

.debreservation button:hover:not(:disabled) {
    background-color: #e6ac00;
}

.debreservation button:disabled {
    background-color: #e0e0e0;
    color: #999;
    cursor: not-allowed;
}

.input-error {
    color: #d32f2f;
    background-color: #ffebee;
}

.debreservation p {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    color: #d32f2f; 
    font-size: 0.8rem;
    
}

main {
    display: flex;
    gap: 50px;
    justify-content: space-between;
    margin-top: 120px;
    border-top: 1px solid #ccc;
    padding-bottom: 30px;
    padding-top: 50px;
}

ul.menu-sticky {
    position: sticky;
    top: 100px; 
    align-self: flex-start; 
    list-style: none;
    padding: 0;
    margin: 0;
    flex-shrink: 0; 
}

ul.menu-sticky li {
    width: 230px;
    padding: 12px 24px;
    border: 1px solid #ccc;
    border-bottom: none;
    list-style: none;
}

ul.menu-sticky li:last-child {
    border-bottom: 1px solid #ccc;
}

ul.menu-sticky li a {
    height: 45px;
    width: 200px;
    text-decoration: none;
    color: #000;
}

ul.menu-sticky li.active {
    background-color: #000;
}

ul.menu-sticky li.active a {
    color: #fff;
}

section.main-wrapped {
    flex-grow: 1;
    max-width: 800px;
}

section.content-section {
    margin-bottom: 80px;
}

h2 {
    font-size: 30px;
}

.room-types-grid {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-top: 30px;
    flex-wrap: wrap;
}
.room-type-item {
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    gap: 80px;
}
.room-wrapped {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.room-title {
    font-size: 24px;
    color: #000;
    margin-bottom: 5px;
}
.room-description {
    font-size: 16px;
    color: #777;
    margin-bottom: 10px;
}
.room-specs {
    margin-top: 10px;
    font-weight: bold;
}
.spec-tag {
    padding: 3px;
    color: #000;
}

.room-image {
    width: 500px;
    position: relative;
    background-color: #eee;
}

.room-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.restauration-section,
.activite-section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
}

.restauration-item,
.activite-item {
    width: 300px;
    text-align: center;
    border: 1px solid #ccc;
}

.restauration-image,
.activite-image {
    height: 200px;
    width: 100%;
    background: #000;
}

.restauration-content,
.activite-content {
    padding: 30px;
}

.restauration-content p {
    margin-top: 15px;
}

.reviews-list {
    margin-top: 30px;
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
}
.review-item {
    flex: 1 1 300px;
    border: 1px solid #ccc;
    padding: 15px;
}

.review-item p {
    margin-top: 20px;
}

.station-specs-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; 
    margin: 15px 0;
}

.station-specs-grid .spec-tag {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    color: #000;
    margin: 0; 
    font-size: 0.85em;
    padding: 6px 12px;
    transition: .2s;
    display: flex;
    align-items: center;
    gap: 6px;
}

.station-specs-grid .spec-tag i {
    color: #FFBF00; 
    font-size: 0.9em;
}

.station-specs-grid .spec-tag:hover {
    border-color: #ccc;
}

.station-info-ski {
    color: #666;
    line-height: 1.6;
    font-size: 0.95em;
}

.room-image {
    height: 100%;
    background-color: #000;
}

.group-header {
    margin-top: 30px;
    display: flex;
    gap: 20px;
    align-items: center;
}

.hero-image-wrapper {
    width: 500px;
    height: 270px;
    position: relative;
}

.hero-image-wrapper::after {
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.2);
    z-index: 9;
    border-radius: 8px;
}

.hero-image {
    object-fit: cover;
    width: 500px;
    height: 270px;
    border-radius: 8px;
}

.hero-title {
    position: absolute;
    bottom: 25px;
    left: 25px;
    font-size: 24px;
    color: #fff;
    z-index: 99;
}

.kids-section {
    margin-top: 30px;
}

.kids-section h3 {
    font-size: 24px;
}

.group-header p {
    margin: 8px 0 15px 0;
}

.stats-badges {
    display: flex;
    gap: 20px;
}

.badge-activite{
    font-size: 14px;
    padding: 5px 15px;
    background-color: #000;
    color: #fff;
}

.cards-grid,
.kids-grid {
    padding: 20px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.activity-card,
.kids-card {
    padding: 20px 15px; 
    border: 1px solid #ccc;
    width: 350px;
    height: 180px;

    display: flex;
    flex-direction: column;
    gap: 8px;
}

.activity-card h5,
.kids-card h5 {
    font-size: 20px;
}

.card-desc,
.kids-card-desc
 {
    color: #777;
}

.kids-header {
    border-bottom: 1px solid #ccc;
    padding-bottom: 8px;
}

.kids-header h3 {
    font-size: 18px;
}

.card-header,
.kids-header,
.kids-card-top {
    display: flex;
    justify-content: space-between;
}

.kids-block {
    margin-top: 20px;
}

.card-footer,
.kids-card span {
    margin-top: auto;
    text-align: right;
}

.card-footer span,
.kids-card span {
    text-decoration: underline;
    cursor: pointer;
}

.card-footer span:hover,
.kids-card span:hover {
    text-decoration: none;
}

@media (max-width: 1024px) {
    main {
        flex-direction: column;
        gap: 30px;
        margin-top: 50px;
    }
    ul.menu-sticky {
        position: static;
        flex-direction: row;
        width: 100%;
        border-bottom: 1px solid #ccc;
    }
    ul.menu-sticky li {
        width: auto;
        flex-grow: 1;
        text-align: center;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        border-top: none;
    }
    ul.menu-sticky li:first-child {
        border-left: none;
    }
    ul.menu-sticky li:last-child {
        border-bottom: none;
        border-right: none;
    }
    section.main-wrapped {
        max-width: 100%;
        padding: 0 10px;
    }
    header {
        flex-direction: column;
    }
    .price-note {
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
        gap: 10px;
    }
    .main-image {
        width: 100%;
        height: 350px;
    }
    .room-types-grid {
        flex-direction: column;
    }
    .room-image {
        min-width: 100%;
        height: 250px;
    }
}
@media (max-width: 600px) {
    .main-title {
        font-size: 40px;
    }
    .price-note {
        flex-direction: column;
        gap: 15px;
    }
    .price-wrapped, .note-wrapped {
        width: 100%;
    }
    .room-image {
        height: 200px;
    }
}

.review-photos {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
}

.review-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #eee;
}

.review-photos-large {
    display: flex;
    gap: 15px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.review-image-big {
    width: 100%;           
    max-width: 500px;      
    height: auto;         
    max-height: 400px;  
    
    object-fit: cover;   
    border-radius: 12px;  
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
    border: 1px solid #ddd;
}
</style>