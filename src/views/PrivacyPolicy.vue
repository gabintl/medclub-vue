<template>
  <div class="privacy-policy-container">
    <header class="policy-header">
      <h1>Charte de Protection des Données Personnelles</h1>
      <p class="subtitle">Dernière mise à jour : 03 décembre 2025</p>
    </header>

    <div class="policy-content">
      <section>
        <p>
          Dans le cadre du projet Club Med, nous accordons une importance majeure à la confidentialité de vos données.
          Cette charte détaille comment nous collectons, utilisons et protégeons vos informations.
        </p>
        <div class="info-box">
          <strong>Responsable de traitement :</strong> Société Club Med, située 9 rue de l'arc en ciel, Annecy.<br>
          <strong>Représentant :</strong> Tom Maniglier.<br>
          <strong>Délégué à la protection des données (DPO) :</strong> Gabin Truffart (<a href="mailto:gabin.truffart@etu.univ-smb.fr">gabin.truffart@etu.univ-smb.fr</a>).
        </div>
      </section>

      <section>
        <h2>1. Quelles sont les données collectées ?</h2>
        <h3>1.1 Informations transmises directement</h3>
        <p>Lors de la création de compte ou de la réservation, nous collectons :</p>
        <ul>
          <li><strong>Identité :</strong> Civilité, Nom, Prénom (conformes au passeport), Date de naissance.</li>
          <li><strong>Contact :</strong> Adresse e-mail, Adresse postale complète.</li>
          <li><strong>Participants :</strong> Données des autres participants au séjour (Civilité, Nom, Prénom, Date de naissance).</li>
          <li><strong>Paiement :</strong> Numéro de carte bancaire et date d'expiration (collectés via notre prestataire sécurisé Stripe).</li>
          <li><strong>Support :</strong> Échanges via le Chatbot ou formulaire d'aide.</li>
        </ul>

        <h3>1.2 Données collectées automatiquement</h3>
        <p>
          Lors de votre navigation, des cookies et traceurs collectent des données techniques (performances, temps de chargement) 
          et des données de navigation pour améliorer votre expérience.
        </p>
      </section>

      <section>
        <h2>2. Pourquoi utilisons-nous vos données ?</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Finalité</th>
              <th>Base Juridique</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gestion des réservations et hébergements</td>
              <td>Exécution du contrat (CGV)</td>
            </tr>
            <tr>
              <td>Facturation et obligations comptables</td>
              <td>Obligation légale</td>
            </tr>
            <tr>
              <td>Sécurité et analyse d'audience</td>
              <td>Intérêt légitime</td>
            </tr>
            <tr>
              <td>Cookies marketing et Newsletter</td>
              <td>Consentement</td>
            </tr>
          </tbody>
        </table>
        <p>
          Nous utilisons également vos données pour des analyses statistiques (Business Intelligence) afin d'étudier 
          le chiffre d'affaires par club et par activité.
        </p>
      </section>

      <section>
        <h2>3. Gestion des Cookies</h2>
        <p>
          Conformément aux recommandations de la CNIL et au RGPD, un bandeau vous permet de gérer vos préférences dès votre arrivée. 
          Nous utilisons les catégories suivantes :
        </p>
        <ul>
          <li><strong>Strictement nécessaires :</strong> Indispensables au fonctionnement (panier, authentification).</li>
          <li><strong>Mesure d'audience :</strong> Analyse de la fréquentation (statistiques anonymes).</li>
          <li><strong>Services tiers :</strong> Google Maps (localisation), Stripe (paiement), Réseaux sociaux.</li>
          <li><strong>Marketing :</strong> Publicités personnalisées.</li>
        </ul>
      </section>

      <section>
        <h2>4. Durée de conservation des données</h2>
        <ul>
          <li><strong>Données bancaires :</strong> Supprimées après la transaction (sauf consentement explicite pour faciliter les futurs achats). Le cryptogramme n'est jamais conservé.</li>
          <li><strong>Données de facturation :</strong> 10 ans (Preuve comptable - Art. L.123-22 du Code de commerce).</li>
          <li><strong>Compte client :</strong> Tant que le compte est actif (+ 3 ans après la fin de la relation commerciale).</li>
          <li><strong>Délais opérationnels :</strong> Les données temporaires de demande de disponibilité sont purgées après 10 jours.</li>
        </ul>
      </section>

      <section>
        <h2>5. Qui a accès à vos données ?</h2>
        <p>Vos données sont transmises uniquement aux destinataires suivants pour les besoins du service :</p>
        <ul>
          <li><strong>Services internes :</strong> Service Marketing, Service Vente, Service Comptabilité.</li>
          <li><strong>Partenaires d'activités :</strong> ESF, Spa (pour l'organisation des activités).</li>
          <li><strong>Prestataires techniques (Sous-traitants) :</strong>
            <ul>
              <li><strong>OVH :</strong> Hébergement sur serveur dédié.</li>
              <li><strong>Stripe :</strong> Services de paiement sécurisé.</li>
              <li><strong>Google Maps :</strong> Services de cartographie.</li>
              <li><strong>Chatbot :</strong> Fournisseur d'API de support.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Sécurité et Protection</h2>
        <p>Conformément aux exigences de l'ANSSI, nous mettons en œuvre des mesures robustes :</p>
        <ul>
          <li><strong>Chiffrement :</strong> Mots de passe et données sensibles chiffrés dans la base de données PostgreSQL.</li>
          <li><strong>Protocole :</strong> Utilisation de HTTPS/TLS pour tous les échanges de données.</li>
          <li><strong>Protection serveur :</strong> Hébergement chez OVH avec dispositif de Mitigation (Anti-DDoS) pour assurer la continuité de service.</li>
          <li><strong>Engagement SLA :</strong> Garantie de disponibilité du serveur pour assurer l'accès aux réservations.</li>
        </ul>
      </section>

      <section>
        <h2>7. Vos droits et recours</h2>
        <p>
          Pour toute question relative à vos données, contactez notre DPO : <strong>gabin.truffart@etu.univ-smb.fr</strong>.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la 
          <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  // Si vous avez besoin de métadonnées spécifiques pour le SEO, ajoutez-les ici
}
</script>

<style scoped>
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
  border-bottom: 2px solid #002D5C; /* Bleu Club Med approximatif */
  padding-bottom: 20px;
}

h1 {
  color: #002D5C;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-style: italic;
}

section {
  margin-bottom: 40px;
}

h2 {
  color: #002D5C;
  font-size: 1.8rem;
  margin-bottom: 20px;
  border-left: 5px solid #ffcc00; /* Touche de jaune/trident */
  padding-left: 15px;
}

h3 {
  color: #444;
  font-size: 1.3rem;
  margin-top: 25px;
  margin-bottom: 15px;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
  margin-bottom: 20px;
}

li {
  margin-bottom: 10px;
}

.info-box {
  background-color: #f4f8fb;
  border: 1px solid #d1d9e6;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.data-table th {
  background-color: #002D5C;
  color: white;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

a {
  color: #002D5C;
  text-decoration: underline;
}

a:hover {
  text-decoration: none;
}
</style>