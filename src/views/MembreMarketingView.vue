<script setup>
    import { ref, reactive, onMounted, computed } from 'vue'; // <--- MODIFICATION : Ajout de computed
    import api from '../services/api';
    import NavBar from '../components/NavBar.vue';
    import Footer from '../components/Footer.vue';
    
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;
    
    const clubs = ref([]);
    const clubSelectionne = ref(null);
    const ongletActif = ref('activites');
    
    const listePartenaires = ref([]);
    
    const showEditModal = ref(false);
    const formEdit = reactive({
        titre: '',
        description: ''
    });
    
    const listeActivitesAEnvoyer = ref([]);
    const listeChambresAEnvoyer = ref([]);
    const listeBarsAEnvoyer = ref([]);
    
    const typesActivites = ref([]); 
    const tranchesAge = ref([]);
    
    const typesActivitesTries = computed(() => {
        if (!typesActivites.value) return [];
        return [...typesActivites.value].sort((a, b) => {
            return a.titre.localeCompare(b.titre, 'fr', { sensitivity: 'base' });
        });
    });
    
    const form = reactive({
        estAdulte: true, 
        titre: '',
        description: '',
        prixmin: 0,
        numtypeactivite: '',
        duree: '',
        ageminimum: 18,
        frequence: '',
        numtranche: '',
        detail: ''
    });
    
    const formChambre = reactive({
        nomtype: '',
        textepresentation: '', 
        capacitemax: 2,
        metrescarres: 20
    });
    
    const formBar = reactive({
        nom: '',
        presentation: '', 
        description_contexte: ''
    });
    
    const regexLettresSeules = /^[a-zA-Z\s\u00C0-\u00FF]+$/;
    const regexAlphaNumerique = /^[a-zA-Z0-9\s\u00C0-\u00FF]+$/;
    const regexChiffres = /^\d+$/;
    
    const chargerDonnees = async () => {
        try {
            const token = localStorage.getItem('user_token');
            const response = await fetch(`${apiBaseURL}/clubs/creationMembreMarketing`, {
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

            const resClubs = await response.json();
            console.log("a : " ,resClubs)
            clubs.value = resClubs || [];
    
            const resType = await api.get('/gettypeactivite');
            typesActivites.value = resType.data;
    
            const resAge = await api.get('/gettrancheage');
            tranchesAge.value = resAge.data;
        } catch (e) {
            console.error("Erreur chargement", e);
        }
    };
    
    const selectionnerClub = (club) => {
        clubSelectionne.value = club;
        listeActivitesAEnvoyer.value = [];
        listeChambresAEnvoyer.value = [];
        listeBarsAEnvoyer.value = [];
    };
    
    const ajouterAuPanier = () => {
        if (!form.titre || !form.titre.trim()) return alert("Le titre est obligatoire.");
        if (!regexLettresSeules.test(form.titre)) return alert("Le titre ne doit contenir que des lettres.");
        if (!form.description || !form.description.trim()) return alert("La description est obligatoire.");
        if (form.prixmin <= 0) return alert("Le prix minimum doit être strictement supérieur à 0.");
    
        if (form.estAdulte) {
            if (!form.numtypeactivite) return alert("Veuillez sélectionner un type d'activité.");
            if (!form.duree || !regexChiffres.test(form.duree) || parseInt(form.duree) <= 0) return alert("La durée doit être un nombre positif (ex: 120).");
            if (form.ageminimum < 18) return alert("L'âge minimum adulte est 18 ans.");
            if (!form.frequence || !form.frequence.trim()) return alert("La fréquence est obligatoire.");
        } else {
            if (!form.numtranche) return alert("Veuillez sélectionner une tranche d'âge.");
            if (!form.detail || !form.detail.trim()) return alert("Le détail est obligatoire.");
        }
    
        const activiteAJson = { ...form };
        if (form.estAdulte) {
            delete activiteAJson.numtranche; delete activiteAJson.detail;
        } else {
            delete activiteAJson.numtypeactivite; delete activiteAJson.duree;
            delete activiteAJson.ageminimum; delete activiteAJson.frequence;
        }
    
        listeActivitesAEnvoyer.value.push(activiteAJson);
        
        form.titre = ''; form.description = ''; form.prixmin = 0; form.duree = '';
        form.frequence = ''; form.detail = '';
        alert("Activité ajoutée !");
    };
    
    const ajouterChambreAuPanier = () => {
        if (!formChambre.nomtype || !formChambre.nomtype.trim()) return alert("Le nom est obligatoire.");
        if (!regexAlphaNumerique.test(formChambre.nomtype)) return alert("Lettres et chiffres uniquement pour le nom.");
        if (!formChambre.textepresentation || !formChambre.textepresentation.trim()) return alert("Description obligatoire.");
        if (formChambre.capacitemax < 1) return alert("Capacité min: 1.");
        if (formChambre.metrescarres < 9) return alert("Surface min: 9m².");
    
        listeChambresAEnvoyer.value.push({ ...formChambre });
        
        formChambre.nomtype = ''; formChambre.textepresentation = '';
        alert("Chambre ajoutée !");
    };
    
    const ajouterBarAuPanier = () => {
        if (!formBar.nom || !formBar.nom.trim()) return alert("Le nom du bar est obligatoire.");
        if (!regexAlphaNumerique.test(formBar.nom)) return alert("Le nom du bar ne doit contenir que des lettres et chiffres.");
        if (!formBar.presentation || !formBar.presentation.trim()) return alert("La présentation générale est obligatoire.");
        if (!formBar.description_contexte || !formBar.description_contexte.trim()) return alert("La description (contexte club) est obligatoire.");
    
        listeBarsAEnvoyer.value.push({ ...formBar });
    
        formBar.nom = '';
        formBar.presentation = '';
        formBar.description_contexte = '';
        alert("Bar ajouté à la liste !");
    };
    
    const toutEnvoyer = async () => {
        if (listeActivitesAEnvoyer.value.length === 0) return alert("Rien à envoyer.");
        try {
            const response = await fetch(`${apiBaseURL}/club/${clubSelectionne.value.idclub}/ajouter-activites`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ activites: listeActivitesAEnvoyer.value })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            alert("Activités enregistrées !");
            listeActivitesAEnvoyer.value = [];
        } catch (e) { console.error(e); alert("Erreur sauvegarde."); }
    };
    
    const toutEnvoyerChambres = async () => {
        if (listeChambresAEnvoyer.value.length === 0) return alert("Rien à envoyer.");
        try {
            const response = await fetch(`${apiBaseURL}/club/${clubSelectionne.value.idclub}/ajouter-chambres`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ chambres: listeChambresAEnvoyer.value })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const result = await response.json();
            alert("Chambres enregistrées !");
            listeChambresAEnvoyer.value = [];
        } catch (e) { console.error(e); alert("Erreur sauvegarde."); }
    };
    
    const toutEnvoyerBars = async () => {
        if (listeBarsAEnvoyer.value.length === 0) return alert("Aucun bar à envoyer.");
        try {
            const response = await fetch(`${apiBaseURL}/club/${clubSelectionne.value.idclub}/ajouter-bars`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ bars: listeBarsAEnvoyer.value })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const result = await response.json();
            alert("Bars enregistrés avec succès !");
            listeBarsAEnvoyer.value = [];
        } catch (e) { console.error(e); alert("Erreur lors de l'enregistrement des bars."); }
    };
    
    const ValiderPourTarifier = async () => {
        if(!clubSelectionne.value) return alert("Aucun club sélectionné.");
    
        try {
            const response = await fetch(`${apiBaseURL}/clubs/verifTypeChambreActivité/${clubSelectionne.value.idclub}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const json = await response.json();
            console.log("b",json)
            let resVerif = json;// A VERIFIER 
            
            if (resVerif.status === 'success') {
                formEdit.titre = clubSelectionne.value.titre;
                formEdit.description = clubSelectionne.value.description; // ou textepresentation selon ta BDD
                
                showEditModal.value = true; // Ceci affiche la modale définie dans le template
                console.log('Ouverture popup confirmation');
            } else {
                alert(resVerif.data.message || "Il manque des éléments.");
            }
        } catch (e) {
            console.error(e);
            if (e.response && e.response.status === 422) {
                 const msg = e.response.data.message || "Vous devez avoir un bar, une chambre et une activité au minimum.";
                 alert(msg);
            } else {
                 alert("Erreur technique lors de la vérification.");
            }
        }
    };
    
    const confirmerEnvoiVente = async () => {
        if (!clubSelectionne.value) return;
    
        try {
            const response = await fetch(`${apiBaseURL}/club/${clubSelectionne.value.idclub}/update-infos`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    titre: formEdit.titre,
                    description: formEdit.description
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const result = await response.json();
    
            const response2 = await fetch(`${apiBaseURL}/club/${clubSelectionne.value.idclub}/proposer-vente`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (!response2.ok) {
                throw new Error(`Erreur HTTP : ${response2.status}`);
            }

            const result2 = await response2.json();
    
            alert("✅ Dossier mis à jour et envoyé au Directeur Vente et partenaires notifiés (0 mails envoyes)! !");
            showEditModal.value = false;
            clubSelectionne.value = null;
            chargerDonnees(); // Rafraichir la liste
    
        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'envoi final.");
        }
    };
    
    onMounted(async () => {
        try {
            const response = await fetch(`${apiBaseURL}/check-token`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.user.role !== 'MARKETING') {
                    router.push('/connexion');
                } else {
                    chargerDonnees();
                }
            } else {
                router.push('/connexion');
            }
        } catch (e) {
            console.error("Erreur auth", e);
            router.push('/connexion');
        }
    });
    </script>
    
    <template>
        <NavBar />
        <div class="page-container">
            <h1>Configuration du Séjour (Marketing)</h1>
    
            <div class="layout">
                <div class="sidebar">
                    <h3>1. Choisir un Séjour</h3>
                    <div v-if="clubs && clubs.length === 0" class="empty-msg">Aucun club en création.</div>
                    <div v-for="c in clubs" :key="c.idclub" class="club-item" :class="{ active: clubSelectionne?.idclub === c.idclub }" @click="selectionnerClub(c)">
                        <strong>{{ c.titre }}</strong><br><small>{{ c.ville }}</small>
                    </div>
                </div>
    
                <div class="main-content" v-if="clubSelectionne">
                    
                    <div class="tabs-nav">
                        <button :class="{ active: ongletActif === 'activites' }" @click="ongletActif = 'activites'">Activités</button>
                        <button :class="{ active: ongletActif === 'chambres' }" @click="ongletActif = 'chambres'">Chambres</button>
                        <button :class="{ active: ongletActif === 'bars' }" @click="ongletActif = 'bars'">Bars & Restauration</button>
                    </div>
    
                    <div v-show="ongletActif === 'activites'" class="tab-pane">
                        <div class="form-card">
                            <h3>Ajouter une activité</h3>
                            <div class="switch-type">
                                <label :class="{ selected: form.estAdulte }"><input type="radio" v-model="form.estAdulte" :value="true"> Adulte</label>
                                <label :class="{ selected: !form.estAdulte }"><input type="radio" v-model="form.estAdulte" :value="false"> Enfant</label>
                            </div>
                            <div class="grid-form">
                                <div class="full-width"><label>Titre</label><input v-model="form.titre" type="text" class="input-field"></div>
                                <div class="full-width"><label>Description</label><textarea v-model="form.description" class="input-field"></textarea></div>
                                <div><label>Prix Min (€)</label><input v-model="form.prixmin" type="number" class="input-field"></div>
                                
                                <template v-if="form.estAdulte">
                                    <div>
                                        <label>Type</label>
                                        <select v-model="form.numtypeactivite" class="input-field">
                                            <option v-for="t in typesActivitesTries" :key="t.numtypeactivite" :value="t.numtypeactivite">{{ t.titre }}</option>
                                        </select>
                                    </div>
                                    <div><label>Durée (min)</label><input v-model="form.duree" type="text" class="input-field"></div>
                                    <div><label>Age Min</label><input v-model="form.ageminimum" type="number" class="input-field"></div>
                                    <div><label>Fréquence</label><input v-model="form.frequence" type="text" class="input-field"></div>
                                </template>
                                <template v-else>
                                    <div>
                                        <label>Tranche d'âge</label>
                                        <select v-model="form.numtranche" class="input-field">
                                            <option v-for="t in tranchesAge" :key="t.numtranche" :value="t.numtranche">{{ t.agemin }} - {{ t.agemax }} ans</option>
                                        </select>
                                    </div>
                                    <div class="full-width"><label>Détail</label><textarea v-model="form.detail" class="input-field"></textarea></div>
                                </template>
                            </div>
                            <button class="btn-add" @click="ajouterAuPanier">⬇ Ajouter Activité</button>
                        </div>
                        <div class="buffer-list" v-if="listeActivitesAEnvoyer.length > 0">
                            <h4>Activités prêtes ({{ listeActivitesAEnvoyer.length }})</h4>
                            <ul>
                                <li v-for="(act, idx) in listeActivitesAEnvoyer" :key="idx">
                                    <strong>{{ act.titre }}</strong> <button @click="listeActivitesAEnvoyer.splice(idx, 1)" class="btn-del">×</button>
                                </li>
                            </ul>
                            <button class="btn-save" @click="toutEnvoyer">ENREGISTRER ACTIVITÉS</button>
                        </div>
                    </div>
    
                    <div v-show="ongletActif === 'chambres'" class="tab-pane">
                        <div class="form-card">
                            <h3>Définir les Chambres</h3>
                            <div class="grid-form">
                                <div class="full-width"><label>Nom du type</label><input v-model="formChambre.nomtype" type="text" class="input-field"></div>
                                <div class="full-width"><label>Description</label><textarea v-model="formChambre.textepresentation" class="input-field"></textarea></div>
                                <div><label>Capacité Max</label><input v-model="formChambre.capacitemax" type="number" class="input-field"></div>
                                <div><label>Surface (m²)</label><input v-model="formChambre.metrescarres" type="number" class="input-field"></div>
                            </div>
                            <button class="btn-add-secondary" @click="ajouterChambreAuPanier">⬇ Préparer Chambre</button>
                        </div>
                        <div class="buffer-list" v-if="listeChambresAEnvoyer.length > 0">
                            <h4>Chambres prêtes ({{ listeChambresAEnvoyer.length }})</h4>
                            <ul>
                                <li v-for="(ch, idx) in listeChambresAEnvoyer" :key="idx">
                                    <strong>{{ ch.nomtype }}</strong> <button @click="listeChambresAEnvoyer.splice(idx, 1)" class="btn-del">×</button>
                                </li>
                            </ul>
                            <button class="btn-save" @click="toutEnvoyerChambres">ENREGISTRER CHAMBRES</button>
                        </div>
                    </div>
    
                    <div v-show="ongletActif === 'bars'" class="tab-pane">
                        <div class="form-card">
                            <h3>Ajouter un Bar</h3>
                            <div class="grid-form">
                                <div class="full-width">
                                    <label>Nom du Bar *</label>
                                    <input v-model="formBar.nom" type="text" placeholder="Ex: Le Blue Lagoon" class="input-field">
                                </div>
                                <div class="full-width">
                                    <label>Présentation Générale *</label>
                                    <textarea v-model="formBar.presentation" rows="2" placeholder="Ambiance, style de musique..." class="input-field"></textarea>
                                </div>
                                <div class="full-width">
                                    <label>Contexte dans ce Club (Description) *</label>
                                    <textarea v-model="formBar.description_contexte" rows="2" placeholder="Situé près de la piscine principale..." class="input-field"></textarea>
                                </div>
                            </div>
                            <button class="btn-add" style="background-color: #e67e22;" @click="ajouterBarAuPanier">⬇ Ajouter le Bar</button>
                        </div>
    
                        <div class="buffer-list" v-if="listeBarsAEnvoyer.length > 0">
                            <h4>Bars prêts à l'envoi ({{ listeBarsAEnvoyer.length }})</h4>
                            <ul>
                                <li v-for="(bar, idx) in listeBarsAEnvoyer" :key="idx">
                                    <div>
                                        <strong>{{ bar.nom }}</strong>
                                        <br><small style="color:#666">Desc: {{ bar.description_contexte.substring(0, 30) }}...</small>
                                    </div>
                                    <button @click="listeBarsAEnvoyer.splice(idx, 1)" class="btn-del">×</button>
                                </li>
                            </ul>
                            <button class="btn-save" @click="toutEnvoyerBars">ENREGISTRER LES BARS</button>
                        </div>
                    </div>
    
                    <div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px;">
                        <button class="btn-save" style="background-color: #333;" @click="ValiderPourTarifier">
                            ✅ Envoyer tout à la tarification
                        </button>
                    </div>
    
                </div>
                <div v-else class="placeholder"><p>Sélectionnez un club à gauche.</p></div>
            </div>
        </div>
    
        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
                <h2 style="color:#333; margin-top:0;">Dernière étape !</h2>
                <p>Voulez-vous modifier les informations générales avant d'envoyer au Directeur Vente ?</p>
                
                <div class="modal-form">
                    <label>Titre du Séjour</label>
                    <input v-model="formEdit.titre" type="text" class="input-field">
                    
                    <label style="margin-top:10px; display:block;">Description Marketing</label>
                    <textarea v-model="formEdit.description" rows="4" class="input-field"></textarea>
                </div>
    
                <div class="modal-actions" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="btn-cancel" @click="showEditModal = false">Annuler</button>
                    <button class="btn-save" style="width:auto; margin:0;" @click="confirmerEnvoiVente">
                        ✅ Confirmer et Envoyer
                    </button>
                </div>
            </div>
        </div>
    
        <Footer />
    </template>
    
    <style scoped>
    /* TES STYLES D'ORIGINE */
    .tabs-nav { display: flex; margin-bottom: 20px; border-bottom: 2px solid #ddd; }
    .tabs-nav button { padding: 10px 20px; border: none; background: none; font-size: 1.1rem; cursor: pointer; font-weight: bold; color: #666; }
    .tabs-nav button.active { color: #0069d9; border-bottom: 3px solid #0069d9; margin-bottom: -2px; }
    .tab-pane { animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .page-container { max-width: 1200px; margin: 0 auto; padding: 20px; min-height: 80vh; }
    .layout { display: flex; gap: 20px; margin-top: 20px; }
    .sidebar { width: 250px; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 10px; }
    .club-item { padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; }
    .club-item:hover { background: #f0f8ff; }
    .club-item.active { background: #0069d9; color: white; border-radius: 4px; }
    .main-content { flex: 1; }
    .form-card { background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .switch-type { display: flex; gap: 10px; margin-bottom: 20px; justify-content: center; }
    .switch-type label { padding: 10px 20px; border: 1px solid #ddd; border-radius: 20px; cursor: pointer; background: #f9f9f9; }
    .switch-type label.selected { background: #0069d9; color: white; border-color: #0069d9; }
    .switch-type input { display: none; }
    .grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .full-width { grid-column: 1 / -1; }
    input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 5px; }
    label { font-weight: 600; font-size: 0.9rem; }
    .btn-add { width: 100%; margin-top: 20px; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-add:hover { background: #5a6268; }
    .btn-add-secondary { width: 100%; margin-top: 20px; padding: 12px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } /* Ajouté car utilisé dans ton template */
    .buffer-list { margin-top: 30px; background: #e9ecef; padding: 20px; border-radius: 8px; }
    .buffer-list ul { list-style: none; padding: 0; margin-bottom: 20px; }
    .buffer-list li { background: white; padding: 10px; margin-bottom: 5px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; }
    .tag { padding: 2px 6px; border-radius: 3px; font-size: 0.8rem; margin-right: 10px; color: white; }
    .tag-adult { background: #2c3e50; }
    .tag-child { background: #e83e8c; }
    .btn-del { background: none; border: none; color: red; font-size: 1.5rem; cursor: pointer; }
    .btn-save { width: 100%; padding: 15px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; font-weight: bold; }
    .btn-save:hover { background: #218838; }
    .placeholder { flex: 1; display: flex; align-items: center; justify-content: center; color: #aaa; font-style: italic; }
    
    /* STYLES POUR LA POPUP (AJOUTÉS) */
    .modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
    }
    .modal-content {
        background: white; padding: 30px; border-radius: 8px; width: 500px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .btn-cancel { background: #ccc; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; font-weight: bold; color: #333;}
    .btn-cancel:hover { background: #bbb; }
    </style>