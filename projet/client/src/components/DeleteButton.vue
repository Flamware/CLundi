<template>
  <button @click="$emit('delete')" class="delete-button">Supprimer post</button>
</template>

<script>
export default {
};
</script>

<style scoped>
/* Style the delete button */
.delete-button {
  background-color: #000000; /* Red background */
  color: #ffffff; /* White text color */
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
}

.delete-button:hover {
  background-color: #d80000; /* Darker red on hover */
}
</style>
