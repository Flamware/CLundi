<template>
  <div class="reply-form">
    <button v-if="!showTextArea" @click="toggleTextArea" class="show-button">
      Répondre
    </button>
    <div v-if="showTextArea" class="text-area-container">
      <textarea v-model="replyContent" placeholder="Tapez votre réponse" class="reply-textarea"></textarea>
      <div class="button-container">
        <button @click="replyAction" class="reply-button">Répondre</button>
        <button @click="hideTextArea" class="hide-button">Masquer la réponse</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTextArea: false,
      replyContent: ''
    };
  },
  methods: {
    toggleTextArea() {
      this.showTextArea = true;
    },
    hideTextArea() {
      this.showTextArea = false;
    },
    replyAction() {
      this.$emit('reply', this.replyContent);
      this.replyContent = '';
    }
  }
};
</script>

<style scoped>
.reply-form {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Aligner à droite */
}

.show-button {
  background-color: #fc6736;
  color: #ffffff;
  padding: 8px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

.text-area-container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.reply-textarea {
  width: 95%;
  resize: vertical;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.reply-button,
.hide-button {
  background-color: #31304d;
  color: #fff;
  padding: 8px;
  margin-left: 5px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}
</style>
