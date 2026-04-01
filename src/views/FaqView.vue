<script setup>
import { ref } from 'vue';
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue'

const openItems = ref({});

const toggle = (id) => {
    openItems.value[id] = !openItems.value[id];
};

const isOpen = (id) => !!openItems.value[id];
</script>

<template>
    <NavBar />
    <h1>FAQ</h1>
    <p class="sous-titre">Répondez à toutes vos questions ici.</p>

    <div class="sommaire">
        <ol>
            <li><a href="#cat1">Recherche et Choix du Séjour</a></li>
            <li><a href="#cat2">Hébergement et Confort</a></li>
            <li><a href="#cat3">Activités et Services</a></li>
            <li><a href="#cat4">Réservation et Paiement</a></li>
            <li><a href="#cat5">Gestion de compte et Avis</a></li>
            <li><a href="#cat6">Support Technique</a></li>
        </ol>
    </div>

    <section class="container">
        
        <div class="content" id="cat1">
            <h2>1. Recherche et Choix du Séjour</h2>
            <div class="faq-items">
                <div class="faq-item" :class="{ 'is-open': isOpen(1) }">
                    <div class="question-header" @click="toggle(1)">
                        Comment puis-je rechercher un séjour sur le site ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Vous disposez de plusieurs modes : recherche libre (dates, participants), par localisation (zones géographiques), par thématique (Ski, Soleil, Famille) ou via nos offres spéciales (Dernières minutes).</p>
                        </div>
                    </div>
                </div>

                <div class="faq-item" :class="{ 'is-open': isOpen(2) }">
                    <div class="question-header" @click="toggle(2)">
                        Que signifie le message "Fermé à la vente" ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Cela signifie qu'aucune chambre n'est disponible pour vos critères. Nous vous invitons à modifier vos dates ou à consulter nos suggestions de clubs similaires.</p>
                        </div>
                    </div>
                </div>

                <div class="faq-item" :class="{ 'is-open': isOpen(3) }">
                    <div class="question-header" @click="toggle(3)">
                        Puis-je voir les détails d'un club avant de réserver ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Absolument. Chaque fiche Resort comprend des photos, la liste des restaurants et bars, ainsi que le détail complet des activités et hébergements disponibles.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content" id="cat2">
            <h2>2. Hébergement et Confort</h2>
            <div class="faq-items">

                <div class="faq-item" :class="{ 'is-open': isOpen(5) }">
                    <div class="question-header" @click="toggle(5)">
                        Quels types de chambres proposez-vous ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Selon le Resort : Chambre Standard/Supérieure (confort de base), Chambre Deluxe (plus spacieuse) et Suites (haut de gamme avec services dédiés).</p>
                        </div>
                    </div>
                </div>

                <div class="faq-item" :class="{ 'is-open': isOpen(6) }">
                    <div class="question-header" @click="toggle(6)">
                        Où trouver le détail des équipements de ma chambre ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Sur la page de réservation, sélectionnez une catégorie de chambre pour voir sa superficie, sa vue et ses équipements (Wifi, Coffre-fort, TV, Sèche-cheveux, etc.).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content" id="cat3">
            <h2>3. Activités et Services</h2>
            <div class="faq-items">
                <div class="faq-item" :class="{ 'is-open': isOpen(7) }">
                    <div class="question-header" @click="toggle(7)">
                        Toutes les activités sont-elles gratuites ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Non. Les activités "Incluses" sont comprises dans le forfait (piscines, certains cours). Les activités "À la carte" sont en supplément (Spa, cours privés, plongée, Petit Club Med®).</p>
                        </div>
                    </div>
                </div>

                <div class="faq-item" :class="{ 'is-open': isOpen(8) }">
                    <div class="question-header" @click="toggle(8)">
                        Comment fonctionnent les clubs enfants ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Ils sont regroupés par tranches d'âge. Attention : le "Petit Club Med®" (2-3 ans) est un service à la carte payant et nécessite une inscription, contrairement aux clubs pour enfants plus âgés souvent inclus.</p>
                        </div>
                    </div>
                </div>

                <div class="faq-item" :class="{ 'is-open': isOpen(9) }">
                    <div class="question-header" @click="toggle(9)">
                        Dois-je réserver mes activités à l'avance ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Oui, pour les activités à la carte payantes, il est recommandé de les ajouter à votre panier après votre réservation pour garantir la disponibilité auprès de nos partenaires.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content" id="cat4">
            <h2>4. Réservation et Paiement</h2>
            <div class="faq-items">
                <div class="faq-item" :class="{ 'is-open': isOpen(10) }">
                    <div class="question-header" @click="toggle(10)">
                        Dois-je créer un compte pour réserver ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Oui, la création d'un compte est nécessaire. Vous devrez fournir les informations d'identité exactes de chaque participant (identiques à celles figurant sur les pièces d'identité).</p>
                        </div>
                    </div>
                </div>

                <div class="faq-item" :class="{ 'is-open': isOpen(11) }">
                    <div class="question-header" @click="toggle(11)">
                        Le paiement est-il sécurisé ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Oui, nous utilisons des protocoles de chiffrement pour protéger vos données bancaires. Le règlement s'effectue uniquement par carte bancaire.</p>
                        </div>
                    </div>
                </div>

                <div class="faq-item" :class="{ 'is-open': isOpen(12) }">
                    <div class="question-header" @click="toggle(12)">
                        Que se passe-t-il après mon paiement ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Le service vente vérifie la disponibilité finale. Si le Resort confirme, votre séjour est validé. Si le Resort n'est plus disponible, nous vous proposerons une alternative ou un remboursement intégral.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content" id="cat5">
            <h2>5. Gestion de compte et Avis</h2>
            <div class="faq-items">
                <div class="faq-item" :class="{ 'is-open': isOpen(13) }">
                    <div class="question-header" @click="toggle(13)">
                        Puis-je donner mon avis sur un club ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Oui, si vous avez déjà séjourné dans le club concerné, vous pouvez laisser une note et un commentaire pour partager votre expérience avec les autres clients.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content" id="cat6">
            <h2>6. Support Technique</h2>
            <div class="faq-items">
                <div class="faq-item" :class="{ 'is-open': isOpen(14) }">
                    <div class="question-header" @click="toggle(14)">
                        J'ai un problème sur le site, que faire ?
                        <span class="icon">+</span>
                    </div>
                    <div class="answer-wrapper">
                        <div class="answer-inner">
                            <p>Un Chatbot (IT Helpdesk Bot) est disponible en bas de chaque page pour vous assister. Vous pouvez également utiliser notre formulaire d'aide en ligne.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>

    
  <Footer />
</template>

<style scoped>
h1 {
    text-align: center;
    font-family: 'Cormorant Garamond';
    font-size: 64px;
    font-weight: 100;
    font-style: italic;
    margin-top: 120px;
}

.sous-titre {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 80px;
    color: #555;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
}

.sommaire {
    max-width: 1200px;
    margin: 80px auto;
    padding: 0 20px;
}

.sommaire ol {
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    column-gap: 80px; 
    row-gap: 25px;   
}

.sommaire li {
    padding-left: 15px;
}

.sommaire a {
    color: #000;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.5px;
    transition: .3s;
    display: inline-block;
}

.sommaire a:hover {
    text-decoration: none;
}

section.container {
    max-width: 1200px;
    margin: 100px auto;
}

.content {
    margin-top: 90px;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    letter-spacing: 1px;
}

.faq-items {
    display: flex;
    flex-direction: column;
}


.faq-item {
    position: relative;
    transition: all 0.5s ease;
    margin-bottom: 10px;
}

.faq-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #ccc;
}

.question-header {
    cursor: pointer;
    padding: 20px 0;
    font-weight: 600;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: color 0.3s;
}

.question-header:hover {
    color: #555;
}

.icon {
    font-size: 36px;
    font-weight: 300;
    transition: transform 0.5s ease;
}

.answer-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.5s ease-out; 
    opacity: 0; 
}

.answer-inner {
    overflow: hidden;
}

.answer-inner p {
    margin: 0;
    padding-bottom: 20px;
    color: #666;
    line-height: 1.6;
    font-size: 16px;
}

.faq-item.is-open .answer-wrapper {
    grid-template-rows: 1fr; 
    opacity: 1;
    transition: grid-template-rows 0.5s ease-out, opacity 0.8s ease;
}

.faq-item.is-open .icon {
    transform: rotate(45deg);
}
</style>