<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router'; 
  import NavBar from '../components/NavBar.vue'
  
  const route = useRoute();
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const message = ref('');
  const messageError = ref('');

  const apiBaseURL = `https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api`;

  const lienServerLaravel = `${apiBaseURL}/login`;

  const reservation = localStorage.getItem('reservation');
  const etapeA2F = ref(false);
  const tempIdClient = ref(null);
  const codeA2F = ref('');
  const telephoneMasque = ref('');
  
  const login = async () => {
    message.value = "Connexion en cours...";
    messageError.value = '';

    try {
        const response = await fetch(lienServerLaravel, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        });

        const data = await response.json();

        if (!response.ok) {
            message.value = '';
            messageError.value = data.message || "Informations d'identification non valides";
        } else {
            if (data.status === '2fa_required') {
                message.value = '';
                etapeA2F.value = true;
                tempIdClient.value = data.idclient;
                
                if (data.status === '2fa_required') {
                    message.value = '';
                    etapeA2F.value = true;
                    tempIdClient.value = data.idclient;
                    telephoneMasque.value = data.telephone_masque;
                }
            } 
            else if (data.status === 'success') {
                handleSuccessLogin(data);
            }
        }
    } catch (error) {
        console.error(error);
        message.value = '';
        messageError.value = "Erreur réseau ou serveur injoignable.";
    }
  };

  const validerCodeA2F = async () => {
      message.value = "Vérification du code...";
      messageError.value = '';

      try {
          const response = await fetch(`${apiBaseURL}/login/verify-2fa`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ 
                  idclient: tempIdClient.value, 
                  code: codeA2F.value 
              })
          });

          const data = await response.json();

          if (response.ok) {
              handleSuccessLogin(data);
          } else {
              message.value = '';
              messageError.value = "Code incorrect. Veuillez réessayer.";
          }
      } catch (error) {
          console.error(error);
          messageError.value = "Erreur lors de la vérification.";
      }
  };

  const handleSuccessLogin = (data) => {
        localStorage.setItem('logged_in', 'true');
        localStorage.setItem('user_infos', JSON.stringify(data.user));
      
      if(reservation){
          localStorage.setItem('reservation', false)
          router.push('/reservation');
      } else {
          router.push('/compte');
      }
  }
  
  const handleGoogleCallback = async (response) => {
    console.log("Token Google reçu...");
    try {
        const res = await fetch(`${apiBaseURL}/auth/google/callback`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({ token: response.credential })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Erreur Google");
        }
        if (data.status === '2fa_required') {
            etapeA2F.value = true;
            tempIdClient.value = data.idclient;
            if (data.status === '2fa_required') {
                etapeA2F.value = true;
                tempIdClient.value = data.idclient;
                telephoneMasque.value = data.telephone_masque; 
            }
        } else {
            handleSuccessLogin(data);
        }
    } catch (error) {
        console.error(error);
        messageError.value = "Erreur de connexion avec Google.";
    }
  };
  
  const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
  
      script.onload = () => {
          window.google.accounts.id.initialize({
              client_id: "592862620807-ufs9tub6ubgmtb2230a283of0topruv9.apps.googleusercontent.com",
              callback: handleGoogleCallback
          });
              window.google.accounts.id.renderButton(
              document.getElementById("googleBtn"),
              { theme: "outline", size: "large", width: "100%", text: "sign_in_with" } 
          );
      };
  };
  
  onMounted(async () => {
      loadGoogleScript();
      
          try {
              if (!localStorage.getItem('logged_in')) return;
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
                  localStorage.setItem('user_infos', JSON.stringify(data.user));
                  if(reservation){
                      localStorage.removeItem('reservation')
                      router.push('/reservation');
                  } else{
                      router.push('/compte');
                  }
              } else {
                  localStorage.removeItem('logged_in');
              }
          } catch (e) {
              console.error("Erreur vérification token", e);
          }
      
  });
  </script>
  
  <template>
    <NavBar />
    <div class="wrapped-connexion">
      <h1>Connexion</h1>
      <div class="login-container">
    
        <div v-if="messageError" class="error">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
            <span>{{ messageError }}</span>
        </div>
      
        <form v-if="!etapeA2F" @submit.prevent="login">
            <div>
                <label>Email</label><br>
                <input type="email" placeholder="Email" v-model="email" required>
            </div>

            <br>
          
            <div>
                <label>Mot de passe</label><br>
                <input type="password" v-model="password" placeholder="Mot de passe" required>
            </div>
          
            <br>
          
            <button type="submit">Se Connecter</button>
        </form>
      
        <div v-else class="a2f-container" style="text-align: center;">
            <h3 style="margin-bottom: 10px;">Vérification SMS</h3>
            <p style="font-size: 0.9em; margin-bottom: 20px; color: #555;">
                Un code de sécurité a été envoyé au <strong>{{ telephoneMasque }}</strong>.<br>
                Veuillez l'entrer ci-dessous.
            </p>
            <input 
                type="text" 
                v-model="codeA2F" 
                placeholder="Code" 
                maxlength="4" 
                required
                style="font-size: 20px; text-align: center; letter-spacing: 5px; width: 120px; padding: 10px; margin-bottom: 20px;"
                @keyup.enter="validerCodeA2F"
            >

            <br>
          
            <button @click="validerCodeA2F" class="btn-primary" style="width: 100%;">
                Valider le code
            </button>
          
            <p @click="etapeA2F = false" style="cursor: pointer; text-decoration: underline; margin-top: 15px; margin-bottom: 30px; font-size: 0.8em; color: #666;">Retour à la connexion</p>
        </div>
      </div>
  
      <div class="google-container">
          <div v-show="!etapeA2F" id="googleBtn"></div> 
      </div>
      <br>
      <RouterLink to="/inscription" class="se-connecter">
          Créer un Compte
      </RouterLink>
      <br>
      
      <div v-if="message">
        {{ message }}
      </div>
    </div>
  </template>
  
  <style scoped>
  .wrapped-connexion {
    width: 350px;
    margin: 80px auto;
  }
  .wrapped-connexion h1 {
    text-align: center;
    font-family: 'Cormorant Garamond';
    font-size: 64px;
    font-weight: 100;
    font-style: italic;
    margin-bottom: 40px;
  }
  .wrapped-connexion label { font-weight: bold; }
  .wrapped-connexion input {
    height: 45px; width: 100%; border: 1px solid #ccc; outline: none; padding: 0 18px;
  }
  .wrapped-connexion input:focus { border-color: #000; }
  .wrapped-connexion button {
    display: block; outline: none; border: 1px solid #000; background-color: #000;
    padding: 12px 24px; color: #fff; font-size: 18px; font-weight: bold;
    margin: 40px auto 20px auto; transition: .2s; cursor: pointer; width: 100%;
  }
  .wrapped-connexion button:hover { background-color: #fff; color: #000; }
  .wrapped-connexion a { display: block; color:#000; margin: 0 auto; text-align: center; }
  .wrapped-connexion a:hover { text-decoration: none; }
  
  .google-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
  }
  </style>