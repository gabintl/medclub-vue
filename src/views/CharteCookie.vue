<template>
  <div class="privacy-policy-container">
    <header class="policy-header">
      <h1>Charte de Gestion des Cookies</h1>
    </header>

    <div class="policy-content">
      <section>
        <p>
          Pour améliorer votre navigation sur le site du Club Med, nous utilisons des cookies. 
          Cette charte vous explique l'usage de ces traceurs et comment vous pouvez contrôler vos préférences, 
          conformément aux directives de la CNIL.
        </p>
        <div class="info-box">
          <strong>Qu'est-ce qu'un cookie ?</strong><br>
          Il s'agit d'un petit fichier déposé sur votre terminal (ordinateur, mobile) lors de la consultation de notre site. 
          Il permet de mémoriser vos choix et d'optimiser le fonctionnement technique de la plateforme.
        </div>
      </section>

      <section>
        <h2>1. Typologie des cookies utilisés</h2>
        <p>Nous classons nos cookies en quatre catégories distinctes pour une meilleure clarté :</p>
        
        <h3>1.1 Cookies techniques et indispensables</h3>
        <p>Ces traceurs sont obligatoires pour le bon fonctionnement du site :</p>
        <ul>
          <li><strong>Authentification :</strong> Pour rester connecté à votre compte client.</li>
          <li><strong>Sécurité :</strong> Pour prévenir les fraudes lors de la réservation.</li>
          <li><strong>Panier :</strong> Pour mémoriser vos séjours et activités avant le paiement.</li>
        </ul>

        <h3>1.2 Cookies de performance et mesure d'audience</h3>
        <p>Nous analysons le trafic pour améliorer nos services :</p>
        <ul>
          <li><strong>Indicateurs techniques :</strong> Mesure des temps de chargement et de la charge réseau.</li>
          <li><strong>Statistiques :</strong> Étude du parcours client pour simplifier l'accès aux clubs.</li>
        </ul>
      </section>

      <section>
        <h2>2. Services tiers et partenaires</h2>
        <p>
          Certaines fonctionnalités du site reposent sur des services proposés par des prestataires externes 
          qui déposent également des cookies :
        </p>
        <table class="data-table">
          <thead>
            <tr>
              <th>Partenaire</th>
              <th>Usage du Cookie</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Stripe</strong></td>
              <td>Sécurisation et exécution du paiement bancaire.</td>
            </tr>
            <tr>
              <td><strong>Google Maps</strong></td>
              <td>Affichage des cartes et localisation des villages.</td>
            </tr>
            <tr>
              <td><strong>API Chatbot</strong></td>
              <td>Maintien de la conversation avec le support technique.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>3. Consentement et Paramétrage</h2>
        <p>
          Conformément au RGPD, votre accord préalable est requis avant tout dépôt de cookies non techniques.
        </p>
        <ul>
          <li><strong>Bandeau de consentement :</strong> Un bandeau s'affiche lors de votre première visite pour vous permettre de "Tout accepter", "Tout refuser" ou "Paramétrer" vos choix.</li>
          <li><strong>Modification des choix :</strong> Vous pouvez revenir sur votre décision à tout moment via l'onglet "Gestion des cookies" en bas de page.</li>
          <li><strong>Durée du choix :</strong> Vos préférences sont conservées pour une durée déterminée avant de vous être demandées à nouveau.</li>
        </ul>
      </section>

      <section>
        <h2>4. Durée de vie des traceurs</h2>
        <p>Les cookies ont une durée de vie limitée selon leur utilité :</p>
        <ul>
          <li><strong>Cookies de session :</strong> Supprimés dès la fermeture de votre navigateur.</li>
          <li><strong>Demandes temporaires :</strong> Les données de disponibilité technique sont purgées après 10 jours.</li>
          <li><strong>Cookies persistants :</strong> Restent sur votre appareil pour mémoriser vos préférences (langue, identifiants) lors de vos prochaines visites.</li>
        </ul>
      </section>

      <section>
        <h2>5. Vos droits et contact</h2>
        <p>
          Si vous avez des questions sur la gestion de vos cookies, vous pouvez contacter notre DPO, 
          <strong>Gabin Truffart</strong>, à l'adresse suivante : 
          <a href="mailto:gabin.truffart@etu.univ-smb.fr">gabin.truffart@etu.univ-smb.fr</a>.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookiePolicy'
}
</script>

<style scoped>
/* Le style CSS reste identique pour garder la cohérence visuelle */
.privacy-policy-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
}
.policy-header {
  text-align: center;
  margin-bottom: 50px;
  border-bottom: 2px solid #002D5C;
  padding-bottom: 20px;
}
h1 { color: #002D5C; font-size: 2.5rem; margin-bottom: 10px; }
.subtitle { color: #666; font-style: italic; }
section { margin-bottom: 40px; }
h2 { color: #002D5C; font-size: 1.8rem; margin-bottom: 20px; border-left: 5px solid #ffcc00; padding-left: 15px; }
h3 { color: #444; font-size: 1.3rem; margin-top: 25px; margin-bottom: 15px; }
ul { list-style-type: disc; margin-left: 20px; margin-bottom: 20px; }
li { margin-bottom: 10px; }
.info-box { background-color: #f4f8fb; border: 1px solid #d1d9e6; padding: 20px; border-radius: 8px; margin-top: 20px; }
.data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
.data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
.data-table th { background-color: #002D5C; color: white; }
a { color: #002D5C; text-decoration: underline; }
</style>