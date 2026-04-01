<template>
  <div class="privacy-policy-container">
    <header class="policy-header">
      <h1>Charte de Protection des données</h1>
    </header>

    <div class="policy-content">
      <section>
        <p>
          Au sein du projet Club Med, la sécurité de vos informations personnelles est une priorité absolue. 
          Cette charte décrit la manière dont nous gérons l'ensemble des données que vous nous confiez lors de l'utilisation de nos services.
        </p>
        <div class="info-box">
          <strong>Responsable du traitement :</strong> Club Med (sous la supervision de Tom Maniglier).<br>
          <strong>Localisation :</strong> 9 rue de l'arc en ciel, Annecy.<br>
          <strong>Référent Protection des Données :</strong> Gabin Truffart (<a href="mailto:gabin.truffart@etu.univ-smb.fr">gabin.truffart@etu.univ-smb.fr</a>).
        </div>
      </section>

      <section>
        <h2>1. Catégories d'informations traitées</h2>
        <h3>1.1 Renseignements fournis volontairement</h3>
        <p>Pour assurer le suivi de vos dossiers et réservations, nous recueillons :</p>
        <ul>
          <li><strong>Identifiants personnels :</strong> Civilité, nom d'usage, prénom et date de naissance de chaque participant.</li>
          <li><strong>Points de contact :</strong> Email personnel et adresse de résidence principale.</li>
          <li><strong>Transactions :</strong> Données relatives à la carte bancaire (numéro et expiration) via notre tunnel sécurisé.</li>
          <li><strong>Historique d'assistance :</strong> Contenu de vos échanges avec notre service de support (Chatbot).</li>
        </ul>

        <h3>1.2 Informations techniques</h3>
        <p>
          Nous suivons automatiquement certains paramètres comme la performance du réseau et les temps de réponse du serveur 
          afin de garantir la fluidité de votre navigation.
        </p>
      </section>

      <section>
        <h2>2. Finalités et fondements du traitement</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Usage des données</th>
              <th>Justification Légale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Organisation et validation de vos séjours</td>
              <td>Nécessité contractuelle</td>
            </tr>
            <tr>
              <td>Gestion comptable et conformité fiscale</td>
              <td>Obligation légale</td>
            </tr>
            <tr>
              <td>Sécurisation du site et statistiques internes</td>
              <td>Intérêt légitime</td>
            </tr>
            <tr>
              <td>Communications promotionnelles</td>
              <td>Consentement libre</td>
            </tr>
          </tbody>
        </table>
        <p>
          Nos services de Business Intelligence utilisent également ces données de manière agrégée pour analyser 
          la provenance géographique de nos clients et optimiser l'offre de nos villages.
        </p>
      </section>

      <section>
        <h2>3. Durée de vie des informations</h2>
        <ul>
          <li><strong>Données de paiement :</strong> Effacées immédiatement après le règlement, sauf demande de mémorisation pour vos futurs achats.</li>
          <li><strong>Archives financières :</strong> Gardées 10 ans selon les normes du Code de commerce.</li>
          <li><strong>Profil utilisateur :</strong> Conservé pendant la durée de l'abonnement, puis archivé 3 ans après le dernier contact.</li>
          <li><strong>Consultations éphémères :</strong> Les recherches de disponibilité sans suite sont purgées sous 10 jours.</li>
        </ul>
      </section>

      <section>
        <h2>4. Transmission des données</h2>
        <p>L'accès à vos informations est strictement limité aux acteurs suivants :</p>
        <ul>
          <li><strong>Équipes internes :</strong> Départements Ventes, Marketing et Comptabilité.</li>
          <li><strong>Sous-traitants techniques :</strong> Notre hébergeur (OVH), notre prestataire de paiement (Stripe) et nos services de cartographie (Google).</li>
          <li><strong>Partenaires opérationnels :</strong> Écoles de sport ou centres de bien-être pour la planification de vos activités réservées.</li>
        </ul>
      </section>

      <section>
        <h2>5. Mesures de protection et résilience</h2>
        <p>Pour prévenir tout risque de fuite ou de piratage, nous appliquons les standards de l'ANSSI :</p>
        <ul>
          <li><strong>Cryptographie :</strong> Chiffrement des mots de passe et données bancaires dans nos bases de données.</li>
          <li><strong>Transmissions :</strong> Utilisation généralisée du protocole sécurisé HTTPS.</li>
          <li><strong>Continuité :</strong> Système de protection Anti-DDoS via OVH pour parer aux attaques informatiques.</li>
          <li><strong>Garantie SLA :</strong> Disponibilité de l'infrastructure assurée à 99,9%.</li>
        </ul>
      </section>

      <section>
        <h2>6. Vos libertés individuelles</h2>
        <p>
          Vous disposez d'un droit d'accès, de rectification et d'opposition. Pour l'exercer, contactez notre DPO : 
          <strong>gabin.truffart@etu.univ-smb.fr</strong>.
        </p>
        <p>
          En dernier recours, vous avez le droit de porter plainte auprès de la 
          <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataProtectionPolicy'
}
</script>

<style scoped>
/* Les styles restent identiques pour la cohérence visuelle */
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