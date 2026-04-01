<script setup>
import { getClubImageUrl } from '../utils/imageUtils'; 

const props = defineProps({
    titre: String,
    description: String,
    notemoyenne: [Number, String],
    photoUrl: String, 
    prix: [Number, String], 
    idclub: Number,
    nomPays: String, 
})

const getDynamicImageUrl = (url) => {

    if (url) {
        return getClubImageUrl(url); 
    }
    return 'none'; 
};

</script>

<template>
    <router-link 
        :to="{ name: 'club', params: { id: idclub } }"
        class="lien-continents"
    >
        <div class="dest-card-wrapped">
            <img 
                :src="getDynamicImageUrl(photoUrl)" 
                :alt="titre"
                class="card-bg"
                loading="lazy" 
            />

            <h3> {{ titre }} </h3>
            <p> {{ nomPays }} </p> 

            <p>
                <span> {{ Number(notemoyenne).toFixed(1) }} /5 ⭐</span>
            </p>

            <div class="prix">
                <p>A partir de</p>
                <p>{{ prix }}</p>
            </div>

        </div>

    </router-link>

</template>

<style scoped>

a {
    text-decoration: none;
    color: #fff;
}

.dest-card-wrapped {
    position: relative;
    border-radius: 5px;
    padding: 30px;
    border: 1px solid #ccc;
    width: 380px;
    height: 250px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* .dest-card-wrapped::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    
    background-image: var(--bg-image); 
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -2;
} */
.card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Remplace background-size: cover */
    object-position: center;
    z-index: -2; /* Tout au fond */
    transition: transform 0.3s ease; /* Petit bonus : effet zoom fluide */
}

.dest-card-wrapped:hover .card-bg {
    transform: scale(1.05);
}

.dest-card-wrapped::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    
    background-color: rgba(0, 0, 0, .3);
    z-index: -1;
}

.prix {
    margin-top: auto; 
    align-self: flex-end;
}

.prix p:last-child {
    font-weight: bold;
    font-size: 24px;
}

h3 {
    font-size: 32px;
    font-family: 'Cormorant Garamond';
}

</style>