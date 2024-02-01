<template>
  <div class="reply-form">
    <button v-if="!showTextArea" @click="toggleTextArea" class="show-button">
      Répondre
    </button>
    <div v-if="showTextArea" class="text-area-container">
      <textarea v-model="replyContent" placeholder="Tapez votre réponse" class="reply-textarea"></textarea>
      <div class="button-container">
        <button @click="hideTextArea" class="hide-button">Masquer la réponse</button>
        <button @click="replyAction" class="reply-button">Répondre</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios-conf.js';
export default {
  data() {
    return {
      showTextArea: false,
      replyContent: ''
    };
  },
  props: {
    parent_comment_id: {
      type: String,
      default: null,
    },
    story_id: {
      type: String,
      default: null,
    },

  },
  methods: {
    toggleTextArea() {
      this.showTextArea = true;
    },
    hideTextArea() {
      this.showTextArea = false;
    },
    replyAction() {
      const authToken = localStorage.getItem('token');
      const payload = {
        storyId: this.story_id,
        content: this.replyContent,
        parentCommentId: this.parent_comment_id,
      };
      axios.post('/submit-comment', payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
          .then((response) => {
            console.log('Comment submitted:', response.data);
            this.replyContent = '';
            window.location.reload();
          })
          .catch((error) => {
            console.error('Error submitting comment:', error);
          });

    }
  }
};
</script>
<style scoped>
.reply-form {
  display: flex;
  align-items: flex-end;
}

.show-button {
  background-color: #fc6736;
  color: #ffffff;
  margin-top: 5px;
  margin-right: 5px; /* Ajout de la marge à droite */
  padding: 10px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

.text-area-container {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

}

.reply-textarea {
  width: 100%;
  resize: vertical;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.reply-button,
.hide-button {
  background-color: #31304d;
  color: #fff;
  padding: 10px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  margin-left: 5px;
}
</style>
