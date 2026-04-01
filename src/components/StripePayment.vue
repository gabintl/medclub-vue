<script setup>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const props = defineProps(['montant']);
const emit = defineEmits(['success']);

const stripe = ref(null);
const cardElement = ref(null);
const clientSecret = ref(null);
const loading = ref(false);
const cardError = ref(null);
const paymentDone = ref(false);

const STRIPE_KEY = 'pk_test_51SohlB4K8G9wtWIlNgnizUZ42QXtKrNHntvsAr0QGrXJZq6UcQtKBI5Tn3VOXlUseG48Rv0J7NYtGN755fJegKd200ahFyN2Zz'; 

const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

onMounted(async () => {
    try {
        const stripeObj = await loadStripe(STRIPE_KEY);
        stripe.value = stripeObj;

        const elements = stripeObj.elements();
        cardElement.value = elements.create('card');
        cardElement.value.mount('#card-element');

        // Créer un PaymentIntent avec le montant en centimes
        const amountInCents = Math.round(props.montant * 100);
        const response = await api.get('/stripe/intent', { params: { amount: amountInCents } });
        clientSecret.value = response.data.client_secret;

    } catch (error) {
        console.error("Erreur Init Stripe:", error);
        cardError.value = "Impossible d'initialiser le paiement. Vérifiez votre connexion.";
    }
});

const validerPaiement = async () => {
    if (paymentDone.value || loading.value) return;

    loading.value = true;
    cardError.value = null;

    if (!stripe.value || !clientSecret.value) {
        cardError.value = "Le paiement n'est pas encore prêt. Veuillez patienter.";
        loading.value = false;
        return;
    }

    try {
        const { paymentIntent, error } = await stripe.value.confirmCardPayment(
            clientSecret.value,
            {
                payment_method: {
                    card: cardElement.value,
                }
            }
        );

        if (error) {
            cardError.value = error.message;
            loading.value = false;
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            paymentDone.value = true;
            emit('success');
        } else {
            cardError.value = `Paiement non finalisé (statut: ${paymentIntent.status})`;
        }
    } catch (err) {
        console.error(err);
        cardError.value = "Erreur : " + (err.message || "Erreur inconnue");
    } finally {
        loading.value = false;
    }
};
</script>

<template>
  <div class="payment-box">
    <h3>Paiement Sécurisé</h3>
    
    <div id="card-element"></div>
    <div v-if="cardError" class="error">{{ cardError }}</div>

    <button type="button" @click="validerPaiement" :disabled="loading || !clientSecret || paymentDone" class="btn-payer">
      {{ loading ? 'Traitement...' : paymentDone ? 'Paiement réussi !' : 'Payer ' + montant + '€' }}
    </button>
  </div>
</template>

<style scoped>
.payment-box {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
#card-element {
  background: white;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
}
.error { color: red; margin-bottom: 10px; font-weight: bold; }
.btn-payer {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
}
.btn-payer:disabled { background-color: #ccc; cursor: not-allowed; }
</style>