<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    if (document.getElementById('tarteaucitron-script')) {
        return;
    }

    const script = document.createElement('script');
    script.id = 'tarteaucitron-script';
    script.src = "https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.17.0/tarteaucitron.min.js";
    script.async = true;

    script.onload = () => {
        if (window.tarteaucitron) {
            
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

            window.tarteaucitron.user.gtagUa = 'G-5J2F1295K3'; 
            window.tarteaucitron.user.gtagMore = function () { /* callback optionnel */ };
            
            (window.tarteaucitron.job = window.tarteaucitron.job || []).push('gtag');
        }
    };
    document.head.appendChild(script);
});
</script>

<template>
    <div style="display:none;"></div> 
</template>