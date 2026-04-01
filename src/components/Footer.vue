<script setup>
import { ref, onMounted } from 'vue';

const resetCookies = () => {
    if (window.tarteaucitron) {
        window.tarteaucitron.userInterface.openPanel();
    }
};

</script>

<template>

<footer>

    <div class="infos">
        <ul>
            <li><a href="instagram.com" target="_blanc">Instagram</a></li>
            <li><a href="facebook.com" target="_blanc">Facebook</a></li>
            <li><a href="x.com" target="_blanc">X</a></li>
            <li><a href="youtube.com" target="_blanc">Youtube</a></li>
            <li><a href="pinterest.com" target="_blanc">Pinterest</a></li>
        </ul>
        <ul>
            <li><router-link to="/informations-legales">Informations Légales</router-link></li>
            <li><router-link to="/charte-cookie">Charte Cookies</router-link></li>
            <li><router-link to="/charte-donnees">Charte de Protection des données</router-link></li>
            <li><a href="#" @click.prevent="resetCookies">Consentement des Cookies</a></li>
            <li><router-link to="/politique-de-confidentialite">Politique de Confidentialité</router-link></li>
        </ul>
        <ul>
            <li>
                <RouterLink to="/faq">
                    FAQ
                </RouterLink>
            </li>
        </ul>
    </div>

    <img src="../assets/logo.svg" alt="logo-clubmed-white">

</footer>

</template>

<style scoped>
footer {
    min-height: 200px;
    width: 100%;
    background-color: #000;
    color: #fff;

    display: flex;
    justify-content: space-between;
    padding: 130px 200px;
}

.infos {
    display: flex;
    gap: 80px;
}

.infos ul {
    list-style: none;
}

.infos ul li {
    margin: 8px 0;
}

.infos ul a {
    color: #fff;
}

.infos ul a:hover {
    text-decoration: none;
}

footer img {
    width: 180px;
    filter: brightness(0) invert(1);
}
</style>