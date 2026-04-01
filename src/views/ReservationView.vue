<script setup>
    import { ref, onMounted, onUnmounted, computed } from 'vue';
    import api from '../services/api';
    import { useRouter } from 'vue-router';
    import NavBar from '../components/NavBar.vue';
    import Footer from '../components/Footer.vue';
    import InfoBulle from '../components/InfoBulle.vue';
    import StripePayment from '@/components/StripePayment.vue';

    api.defaults.withCredentials = true;
    
    const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;

    const router = useRouter();
    
    const wrapperRef = ref(null);
    const gererClicDehors = (event) => {
    };
    
    const panier = ref([]);
    const erreur = ref(null);
    const chargement = ref(true);
    const voyageurs = ref([]);
    const connecter = ref(false);
    const voyageurPrincipal = ref(null);
    const passeReglement = ref(false);
    const erreursAutresPersonnes = ref([]);
    const aEssayeDeValider = ref(false);

    const dateAujourdhui = new Date();
    dateAujourdhui.setHours(0, 0, 0, 0);
    
    const prixTotalGlobal = computed(() => {
        return panier.value.reduce((total, item) => total + (item.prixTotal || 0), 0);
    });

    const nombreTotalVoyageursSupplementaires = computed(() => {
        let totalSupplementaires = 0;
        panier.value.forEach(item => {
            const nbAccompagnants = Math.max(0, (item.nbPersonnes || 1) - 1);
            totalSupplementaires += nbAccompagnants;
        });
        return totalSupplementaires;
    });
    
    const continuerAchats = () => {
        router.push('/');
    };
    
    const supprimerDuPanier = (index) => {
        panier.value.splice(index, 1);
        localStorage.setItem('reservationClubMed', JSON.stringify(panier.value));
        if (panier.value.length === 0) {
            router.push('/');
        } else {
            initialiserVoyageurs();
        }
    };
    
    const initialiserVoyageurs = () => {
        voyageurs.value = [];
        erreursAutresPersonnes.value = [];

        const nbAutres = nombreTotalVoyageursSupplementaires.value;
    
        for (let i = 0; i < nbAutres; i++) {
            voyageurs.value.push({
                genre: '', prenom: '', nom: '', dateNaissance: ''
            });
            erreursAutresPersonnes.value.push({
                prenom: '', nom: '', dateNaissance: ''
            });
        }
    };
    
    onMounted(async() => {
        const data = localStorage.getItem('reservationClubMed');
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
                const resData = await response.json();
                if (resData.user) {
                    connecter.value = true;
                    voyageurPrincipal.value = resData.user;
                    localStorage.setItem('user_infos', JSON.stringify(resData.user));
                }
            }
        } catch (e) {
            console.log("Utilisateur non connecté (Cookie)");
        }
    
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                panier.value = parsed;
            } else {
                panier.value = [parsed];
            }
            
            initialiserVoyageurs();
            chargement.value = false;
        } else {
            chargement.value = false;
        }
        
        window.addEventListener('click', gererClicDehors);
    });
    
    onUnmounted(() => {
        window.removeEventListener('click', gererClicDehors);
    });
    
    const passageReglement = () => {
        let ilYaUneErreur = false; 
        const regexLettres = /^[a-zA-ZÀ-ÿ\s-]+$/;
        
        voyageurs.value.forEach((voyageur, index) => {
            if (!erreursAutresPersonnes.value[index]) erreursAutresPersonnes.value[index] = {};
            
            erreursAutresPersonnes.value[index] = { prenom: '', nom: '', dateNaissance: '' , genre:'' };
    
            if (!voyageur.genre) {
                erreursAutresPersonnes.value[index].genre = "Obligatoire.";
                ilYaUneErreur = true;
            }
            if (!voyageur.prenom) {
                erreursAutresPersonnes.value[index].prenom = "Obligatoire.";
                ilYaUneErreur = true;
            } else if (!regexLettres.test(voyageur.prenom)) {
                erreursAutresPersonnes.value[index].prenom = "Lettres uniquement.";
                ilYaUneErreur = true;
            }
    
            if (!voyageur.nom) {
                erreursAutresPersonnes.value[index].nom = "Obligatoire.";
                ilYaUneErreur = true;
            } else if (!regexLettres.test(voyageur.nom)) {
                erreursAutresPersonnes.value[index].nom = "Lettres uniquement.";
                ilYaUneErreur = true;
            }
            
            if (!voyageur.dateNaissance) {
                erreursAutresPersonnes.value[index].dateNaissance = "Obligatoire.";
                ilYaUneErreur = true;
            } else if (estInvalide(voyageur.dateNaissance)) { 
                erreursAutresPersonnes.value[index].dateNaissance = "Date non valide.";
                ilYaUneErreur = true;
            }
        });
    
        if(connecter.value) {
            aEssayeDeValider.value = true; 
            let VerifVoyageurPrincipal = true;
            if (!voyageurPrincipal.value.genre || !voyageurPrincipal.value.prenom || !voyageurPrincipal.value.nom) {
                 VerifVoyageurPrincipal = false;
            }
    
            if (!ilYaUneErreur && VerifVoyageurPrincipal) {
                passeReglement.value = true;
            } 
        } else {
            alert("Veuillez vous connecter.");
        }
    }
    
    const onPaiementReussi = async () => {
        try {
            let indexVoyageurGlobal = 0; 
            
            const promessesReservation = panier.value.map(item => {
                const nbAccompagnantsRequis = Math.max(0, (item.nbPersonnes || 1) - 1);
                const voyageursPourCetteResa = voyageurs.value.slice(
                    indexVoyageurGlobal, 
                    indexVoyageurGlobal + nbAccompagnantsRequis
                );
                indexVoyageurGlobal += nbAccompagnantsRequis;

                const donneesReservation = {
                    idclub: item.club.idclub,
                    idtransport: item.transport ? item.transport.idtransport : 1,
                    numclient: voyageurPrincipal.value.numclient,
                    datedebut: item.dateDebut,
                    datefin: item.dateFin,
                    nbpersonnes: item.nbPersonnes,
                    lieudepart: item.transport ? item.transport.lieudepart : null,
                    prix: item.prixTotal,
                    statut: "EN_ATTENTE", 
                    etat_calcule: null,
                    autrevoyageurs: voyageursPourCetteResa 
                };
                return api.post('/postReservation', donneesReservation);
            });

            await Promise.all(promessesReservation);
            
            console.log('Réservations enregistrées !');
            alert("Paiement réussi et séjour réservé !");
            
            localStorage.removeItem('reservationClubMed');
            router.push('/'); 

        } catch (error) {
            console.error('Erreur sauvegarde réservation:', error);
            erreur.value = "Le paiement est passé, mais erreur lors de l'enregistrement. Contactez le support.";
        }
    };

    const Envoieconnexion = () => {
        localStorage.setItem('reservation', true);
        router.push('/connexion');
    }
    const EnvoieCréation = () => {
        localStorage.setItem('reservation', true);
        router.push('/inscription');
    }
    
    const estInvalide = (dateSaisie) => {
        if (!dateSaisie) return false;
        const dateNaissance = new Date(dateSaisie);
        const aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0);
        return dateNaissance > aujourdhui;
    };
</script>

<template>
    <NavBar />
    <p v-if="chargement" class="loader">Chargement en cours...</p>
    
    <div class="reservation-container" v-else>

        <section class="recap">
            <h1>Votre Panier</h1>
            
            <div v-if="panier.length === 0" class="panier-vide">
                <p>Votre panier est vide.</p>
            </div>

            <div v-else>
                <div v-for="(item, index) in panier" :key="index" class="panier-item">
                    <h3 class="club-title">{{ item.club.titre }}</h3>
                    <div class="recap-grid">
                        <div class="recap-item">
                            <span class="label">Dates</span>
                            <p>{{ item.dateDebut }} au {{ item.dateFin }}</p>
                        </div>
                        <div class="recap-item">
                            <span class="label">Détails</span>
                            <p>{{ item.nbPersonnes }} pers. - {{ item.typeChambre.nomtype }}</p>
                        </div>
                        <div class="recap-item">
                            <span class="label">Transport</span>
                            <p>{{ item.transport ? item.transport.lieudepart : 'Sans transport' }}</p>
                        </div>
                        <div class="recap-item prix-item">
                            <span class="price-small">{{ item.prixTotal }}€</span>
                        </div>
                    </div>
                    <button @click="supprimerDuPanier(index)" class="btn-supprimer">Supprimer</button>
                    <hr style="margin: 20px 0; border:0; border-top:1px solid #ddd;">
                </div>

                <div class="prix-reservation">
                    <span>TOTAL À PAYER</span>
                    <span class="price-big">{{ prixTotalGlobal }}€</span>
                </div>
                
                <button v-if="!passeReglement" @click="passageReglement()" class="btn-primary">
                    Procéder au paiement
                </button>
            </div>

            <button @click="continuerAchats" class="btn-outline" style="width: 100%; margin-top: 15px;">
                Continuer mes achats
            </button>
        </section>

        <div class="main-column">
        
            <section class="section-content" v-if="!passeReglement">
                <div class="step-header">
                    <h2 class="section-title">
                        Voyageur principal
                        <InfoBulle text="Important : Les noms et prénoms doivent être identiques à ceux figurant sur vos pièces d'identité" link="/faq"/>
                    </h2>
                </div>
                
                <div v-if="connecter==false" class="auth-box">
                    <button @click="Envoieconnexion" class="btn-outline">Se connecter</button>
                    <button @click="EnvoieCréation" class="btn-outline">Créer un compte</button>
                </div>
                
                <div v-else class="info-display">
                    <p><strong>Genre :</strong> {{ voyageurPrincipal.genre }}</p>
                    <p><strong>Prénom :</strong> {{ voyageurPrincipal.prenom }}</p>
                    <p><strong>Nom :</strong> {{ voyageurPrincipal.nom }}</p>
                
                    <p><strong>Date de naissance :</strong> {{ voyageurPrincipal.datenaissance }}</p>
                    <p><strong>Email :</strong> {{ voyageurPrincipal.email }}</p>
                    <p><strong>Téléphone :</strong> {{ voyageurPrincipal.telephone }}</p>
                
                    <p class="full-width address-display">
                        <strong>Adresse :</strong> 
                        {{ voyageurPrincipal.adresse.numrue }} {{ voyageurPrincipal.adresse.nomrue }}, 
                        {{ voyageurPrincipal.adresse.codepostal }} {{ voyageurPrincipal.adresse.ville }}
                    </p>
                </div>

                <div v-for="(voyageur, index) in voyageurs" :key="index" class="traveler-block">
                    <div class="step-header">
                        <h2 class="section-title">
                            Autre(s) Participants(s) {{ index + 1 }}
                            <InfoBulle text="Important : Les noms et prénoms doivent être identiques à ceux figurant sur vos pièces d'identité" link="/faq"/>
                        </h2>
                    </div>
                    
                    <div class="form-grid">
                        <div class="genre-container full-width">
                            <span :class="{ 'text-error': aEssayeDeValider && !voyageur.genre }" class="label">Genre*</span>
                            <div class="radio-group">
                                <label><input type="radio" value="Homme" v-model="voyageur.genre"> Homme</label>
                                <label><input type="radio" value="Femme" v-model="voyageur.genre"> Femme</label>
                            </div>
                            <div class="error-msg" v-if="erreursAutresPersonnes[index]?.genre">
                                {{ erreursAutresPersonnes[index]?.genre }}
                            </div>
                        </div>

                        <div>
                            <p class="label">Prénom*</p>
                            <input type="text" v-model="voyageur.prenom" :class="{ 'input-error': aEssayeDeValider && erreursAutresPersonnes[index]?.prenom }">
                            <span v-if="erreursAutresPersonnes[index]?.prenom" class="error-msg">
                                {{ erreursAutresPersonnes[index]?.prenom }}
                            </span>
                        </div>
                        
                        <div>
                            <p class="label">Nom de famille*</p>
                            <input type="text" v-model="voyageur.nom" :class="{ 'input-error': aEssayeDeValider && erreursAutresPersonnes[index]?.nom }">
                            <span v-if="erreursAutresPersonnes[index]?.nom" class="error-msg">
                                {{ erreursAutresPersonnes[index]?.nom }}
                            </span>
                        </div>
                        
                        <div>
                            <p class="label section-para-datenais">Date de naissance*
                                <InfoBulle text="Nécessaire pour calculer les tarifs réduits (enfants) et vérifier l'âge légal pour certaines activités." link="/faq"/>
                            </p>
                            <input type="date" v-model="voyageur.dateNaissance" :class="{ 'input-error': aEssayeDeValider && erreursAutresPersonnes[index]?.dateNaissance }">
                            <span v-if="erreursAutresPersonnes[index]?.dateNaissance" class="error-msg">
                                {{ erreursAutresPersonnes[index]?.dateNaissance }}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section-content" v-if="!chargement && passeReglement">
                <div class="stripe-wrapper">
                    <h2 style="margin-bottom: 20px;">Règlement sécurisé</h2>
                    
                    <StripePayment 
                        :montant="prixTotalGlobal" 
                        :reservationId="0" 
                        @success="onPaiementReussi" 
                    />

                    <div class="action-buttons" style="margin-top: 20px;"> 
                        <button class="btn-paiement" @click="passeReglement=false">Retour aux informations</button>
                    </div>
                </div>
            </section>
            
        </div>
    </div>

    <Footer />
</template>

<style scoped>  
.panier-item {
    margin-bottom: 20px;
}
.club-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 10px;
}
.btn-supprimer {
    background: transparent;
    border: none;
    color: #d32f2f;
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 10px;
}
.price-small {
    font-weight: bold;
    font-size: 1.1rem;
}

/* Styles pour le Stripe Wrapper */
.stripe-wrapper {
    background: #fdfdfd;
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.reservation-container { 
    display: flex; flex-direction: row-reverse; gap: 60px; align-items: flex-start; max-width: 1200px; margin: 0 auto; padding: 80px 20px; color: #000; 
}
.main-column { 
    flex: 1; 
}
.recap { 
    width: 350px; background: #fcfcfc; border: 1px solid #eee; padding: 30px; position: sticky; top: 80px; 
}
.section-content {
margin-bottom: 50px;
}
h1 { 
    font-size: 22px; font-weight: 600; margin: 0 0 20px 0; 
}
.recap-grid { 
    display: flex; flex-direction: column; gap: 10px; 
}
.recap-item { 
    display: flex; justify-content: space-between; font-size: 0.9rem; 
}
.label { 
    font-weight: bold; display: block; margin-bottom: 5px; 
}
.prix-reservation { 
    margin-top: 20px; padding-top: 20px; border-top: 2px solid #000; display: flex; justify-content: space-between; align-items: center; font-weight: 600; 
}
.price-big { 
    font-size: 1.5rem; 
}
.btn-primary { 
    background: #000; color: #fff; width: 100%; padding: 16px; border: 1px solid #000; font-weight: bold; margin-top: 20px; cursor: pointer; transition: .2s; 
}
.btn-primary:hover { 
    background: #fff; color: #000; 
}
.btn-outline { 
    background: transparent; border: 1px solid #ccc; padding: 12px 24px; font-size: 0.9rem; font-weight: bold; cursor: pointer; transition: .2s; text-align: center; 
}
.btn-outline:hover { 
    border-color: #000; background: #000; color: #fff; 
}
.form-grid { 
    display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 15px; 
}
.full-width { 
    grid-column: 1 / -1; 
}
input[type="text"], input[type="date"], input[type="email"], input[type="month"] { height: 45px; width: 100%; border: 1px solid #ccc; outline: none; padding: 0 18px; 
}
input:focus { 
    border: 1px solid #000; 
}
.input-error { 
    border: 1px solid red !important; background-color: #fff0f0; 
}
.text-error { 
    text-decoration: underline; color: #000; 
}
.error-msg { 
    color: red; font-weight: bold; font-size: 0.8rem; 
}
.traveler-block { 
    margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; 
}
.action-buttons { 
    display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; 
}
.btn-paiement { 
    padding: 12px 24px; background: #000; color: #fff; border: 1px solid #000; font-weight: bold; cursor: pointer; 
}
.btn-paiement:first-child { 
    background: #fff; color: #000; border: 1px solid #ccc; 
}
.auth-box {
padding: 40px;
background: #f9f9f9;
text-align: center;
display: flex;
justify-content: center;
gap: 15px;
border: 1px solid #eee;
}
.step-header {
    padding-bottom: 15px;
    margin-bottom: 30px;
}

.info-display {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    background: #fcfcfc;
    border: 1px solid #eee;
}

.address-display {
    margin-top: 10px;
    color: #555;
}
</style>