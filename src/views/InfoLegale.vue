<template>
  <div class="privacy-policy-container">
    <header class="policy-header">
      <h1>Informations légales</h1>
    </header>

    <div class="policy-content">
      <section>
        <p>
          Pour assurer le bon fonctionnement de notre plateforme de réservation, le Club Med veille scrupuleusement au respect de votre vie privée. 
          Ce document vous explique en toute transparence notre manière de traiter vos informations.
        </p>
        <div class="info-box">
          <strong>Entité responsable :</strong> Club Med (sous la direction de Tom Maniglier).<br>
          <strong>Siège social :</strong> 9 rue de l'arc en ciel, Annecy.<br>
          <strong>Contact référent RGPD :</strong> Gabin Truffart (<a href="mailto:gabin.truffart@etu.univ-smb.fr">gabin.truffart@etu.univ-smb.fr</a>).
        </div>
      </section>

      <section>
        <h2>1. Nature des données collectées</h2>
        <h3>1.1 Ce que vous nous communiquez</h3>
        <p>Afin de valider vos séjours, nous avons besoin des renseignements suivants :</p>
        <ul>
          <li><strong>Détails d'identité :</strong> Civilité, nom, prénom et date de naissance (pour chaque voyageur).</li>
          <li><strong>Moyens de contact :</strong> Votre courriel ainsi que votre adresse de résidence complète.</li>
          <li><strong>Informations de paiement :</strong> Coordonnées de votre carte bancaire pour la facturation.</li>
          <li><strong>Assistance :</strong> Les informations partagées lors de vos demandes via notre chatbot.</li>
        </ul>

        <h3>1.2 Collecte automatisée</h3>
        <p>
          Nous analysons également des indicateurs techniques comme la vitesse de chargement et le trafic réseau afin d'optimiser les performances de notre site.
        </p>
      </section>

      <section>
        <h2>2. Utilisation et fondements juridiques</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Objectif</th>
              <th>Justification Légale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Validation et suivi de vos vacances</td>
              <td>Base contractuelle</td>
            </tr>
            <tr>
              <td>Conservation des factures et archivage fiscal</td>
              <td>Contrainte réglementaire</td>
            </tr>
            <tr>
              <td>Amélioration de la navigation et sécurité</td>
              <td>Intérêt légitime</td>
            </tr>
            <tr>
              <td>Envoi d'offres et communications marketing</td>
              <td>Consentement de l'usager</td>
            </tr>
          </tbody>
        </table>
        <p>
          Par ailleurs, nos équipes commerciales réalisent des études statistiques pour mieux comprendre la répartition géographique de notre clientèle et l'attractivité de nos villages.
        </p>
      </section>

      <section>
        <h2>3. Politique relative aux Cookies</h2>
        <p>
          Nous utilisons différents types de traceurs pour lesquels vous pouvez exprimer votre choix via notre bandeau dédié :
        </p>
        <ul>
          <li><strong>Fonctionnels :</strong> Essentiels pour rester connecté et gérer votre panier.</li>
          <li><strong>Analytiques :</strong> Pour comprendre comment vous utilisez le site.</li>
          <li><strong>Extensions tierces :</strong> Dépendants de partenaires comme Google (cartes) ou Stripe (paiement).</li>
          <li><strong>Publicitaires :</strong> Pour vous proposer des services adaptés à vos envies.</li>
        </ul>
      </section>

      <section>
        <h2>4. Délais de conservation</h2>
        <ul>
          <li><strong>Paiement :</strong> Les données de carte sont effacées sitôt l'achat terminé (sauf si vous demandez leur mémorisation).</li>
          <li><strong>Archivage légal :</strong> Les pièces comptables sont gardées 10 ans.</li>
          <li><strong>Profil client :</strong> Conservé tant que vous utilisez nos services, puis supprimé après 3 ans d'inactivité.</li>
          <li><strong>Demandes de devis :</strong> Les recherches restées sans suite sont effacées au bout de 10 jours.</li>
        </ul>
      </section>

      <section>
        <h2>5. Accès aux informations</h2>
        <p>Vos données ne sont accessibles qu'aux personnes habilitées :</p>
        <ul>
          <li><strong>Équipes internes :</strong> Départements marketing, vente et comptabilité.</li>
          <li><strong>Intervenants extérieurs :</strong> Prestataires pour vos activités sur place (écoles de ski, soins bien-être).</li>
          <li><strong>Support technique :</strong> Notre hébergeur (OVH) et nos fournisseurs d'outils (paiement, cartographie, chatbot).</li>
        </ul>
      </section>

      <section>
        <h2>6. Mesures de sécurité</h2>
        <p>Pour garantir l'intégrité de vos échanges, nous appliquons des standards élevés :</p>
        <ul>
          <li><strong>Cryptage :</strong> Les informations sensibles sont rendues illisibles dans notre base PostgreSQL.</li>
          <li><strong>Transferts sécurisés :</strong> Utilisation systématique du protocole HTTPS.</li>
          <li><strong>Résilience :</strong> Protection contre les cyberattaques (DDoS) via les services d'OVH.</li>
          <li><strong>Disponibilité :</strong> Engagement sur un taux de service (SLA) de 99,9%.</li>
        </ul>
      </section>

      <section>
        <h2>7. Exercice de vos droits</h2>
        <p>
          Pour toute demande de modification ou de suppression, contactez notre DPO : <strong>gabin.truffart@etu.univ-smb.fr</strong>.
        </p>
        <p>
          En cas de litige persistant, vous avez la possibilité de saisir directement la 
          <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.
        </p>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PrivacyPolicy'
}
</script>

<style scoped>
/* Le style reste identique à votre template initial */
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
  border-left: 5px solid #ffcc00;
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