<template>
  <div class="background-container">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.background-container {
  background-image: url('./assets/1014.jpg'); /* Adjust the path based on your project structure */
  background-size: cover;
  background-position: center;
  min-height: 100vh;

}



</style>

<script setup>
</script>
