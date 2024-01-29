<template>
  <div class="comment-section">
    <div v-for="comment in comments" :key="comment.comment_id" class="comment">
      <span class="comment-author">{{ comment.author }}</span>
      <p class="comment-content">{{ comment.content }}</p>

      <!-- Ajouter la condition pour afficher le bouton delete -->
      <DeleteCom v-if="isCurrentUser(comment.author)" @delete="handleDelete" />

      <ReplyForm @reply="handleReply" />
      <CommentSection :comments="getRepliesByCommentId(comment.comment_id)"></CommentSection>
    </div>
  </div>
</template>

<script>
import ReplyForm from './ReplyForm.vue';
import DeleteCom from '../components/DeleteButton.vue';

export default {
  name: 'CommentSection',
  components: {
    ReplyForm,
    DeleteCom,
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
    currentUser: {
      type: String, // ou tout autre type d'identifiant d'utilisateur
      required: true,
    },
  },
  methods: {
    getRepliesByCommentId(parentCommentId) {
      return this.comments.filter(comment => comment.parent_comment_id === parentCommentId);
    },
    handleReply(replyContent) {
      console.log('Replying to comment with content:', replyContent);
    },
    handleDelete() {
      // Implémentez la logique de suppression ici
      console.log('Deleting comment...');
    },
    isCurrentUser(commentAuthor) {
      return commentAuthor === this.currentUser;
    },
  },
};
</script>

<style scoped>
.comment {
  background-color: #f0ece5;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
