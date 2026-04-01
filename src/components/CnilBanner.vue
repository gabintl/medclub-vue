<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    // 1. On vérifie pour ne pas charger le script deux fois
    if (document.getElementById('tarteaucitron-script')) {
        return;
    }

    // 2. Création de la balise script pour charger Tarteaucitron
    const script = document.createElement('script');
    script.id = 'tarteaucitron-script';
    script.src = "https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.17.0/tarteaucitron.min.js";
    script.async = true;

    // 3. Une fois le script chargé, on lance la configuration
    script.onload = () => {
        if (window.tarteaucitron) {
            
            // CONFIGURATION STANDARD (RECOMMANDÉE CNIL)
            window.tarteaucitron.init({
                "privacyUrl": "/politique-de-confidentialite", /* Mettre l'URL de ta page politique confidentialité ici */
                "bodyPosition": "bottom",
                "hashtag": "#tarteaucitron",
                "cookieName": "tarteaucitron",
                "orientation": "middle",
                "groupServices": false,
                "serviceDefaultState": "wait", /* Important : Attendre le consentement */
                "showAlertSmall": false, /* On cache le petit gâteau (on gérera le lien nous-mêmes) */
                "cookieslist": false,
                "closePopup": false,
                "iconPosition": "BottomRight",
                "adblocker": false,
                "DenyAllCta" : true, /* Bouton Refuser tout */
                "AcceptAllCta" : true, /* Bouton Accepter tout */
                "highPrivacy": true, /* Consentement explicite obligatoire */
                "handleBrowserDNTRequest": false,
                "removeCredit": false,
                "moreInfoLink": true,
                "useExternalCss": false,
                "readmoreLink": "",
                "showIcon": false,
            });

            // 4. DÉCLARATION DE GOOGLE ANALYTICS (GA4)
            // Remplace 'G-XXXXXXXX' par ton vrai ID Google Analytics
            window.tarteaucitron.user.gtagUa = 'G-5J2F1295K3'; 
            window.tarteaucitron.user.gtagMore = function () { /* callback optionnel */ };
            
            // On ajoute le service à la liste
            (window.tarteaucitron.job = window.tarteaucitron.job || []).push('gtag');
        }
    };
    document.head.appendChild(script);
});
</script>

<template>
    <div style="display:none;"></div> 
</template>