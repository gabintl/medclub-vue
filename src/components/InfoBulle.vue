<script setup>
defineProps({
    text: {
    type: String,
    required: true
    },
    link: {
    type: String,
    default: null
    }
});
</script>

<template>
    <span class="tooltip-wrapper">
        <span class="tooltip-icon">
            <img src="../assets/icon/info.svg"  height="25" width="25" alt="info" style="cursor:pointer;">
        </span>

        <div class="tooltip-content">
            <p>{{ text }}</p>
            <router-link v-if="link" :to="link" class="tooltip-link">
                En savoir plus
            </router-link>
        </div>
    </span>
</template>

<style scoped>

.tooltip-wrapper {
    position: relative;
    display: inline-block;
    margin-left: 8px;
    vertical-align: middle;
}

.tooltip-content {
    visibility: hidden;
    opacity: 0;
    width: 220px;
    background-color: #fff;
    text-align: left;
    padding: 12px;
    position: absolute;
    bottom: 140%; 
    left: 50%;
    transform: translateX(-50%) translateY(10px); 
    background: #000;
    z-index: 99999;

    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
}

.tooltip-wrapper:hover .tooltip-content {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.tooltip-content p {
    margin: 0 0 8px 0;
    font-size: 13px;
    line-height: 1.5;
    font-style: normal;
    font-weight: 400;
    color: #fff;
}

.tooltip-link {
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    text-decoration: underline;
    font-style: normal;
}

.tooltip-link:hover {
    text-decoration: none;
}
</style>