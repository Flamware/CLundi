<template>
  <div class="comment">
    <span class="comment-author">{{ comment.author }}</span>
    <p class="comment-content">{{ comment.content }}</p>
    <div class="button-container">
      <ReplyForm :story_id="story_id" :parent_comment_id="comment.comment_id" />
      <DeleteCom v-if="isOwner()" @delete="handleDelete" />
    </div>
    <div>
      <CommentItem
          v-for="reply in getRepliesByCommentId(comment.comment_id)"
          :key="reply.comment_id"
          :comment="reply"
          :story_id="story_id"
          :isAuthenticated="isAuthenticated"
          :comments="comments"
          @delete="handleDelete"
      />
    </div>
  </div>
</template>
<script>
import ReplyForm from './ReplyForm.vue';
import DeleteCom from '../components/DeleteButton.vue';
import axios from "../axios-conf.js";
import {getUserName} from "../auth.js";
export default {
  name: 'CommentItem',
  components: {
    ReplyForm,
    DeleteCom,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    story_id: {
      type: String,
      required: true,
    },
    isAuthenticated: Boolean,
    comments: Array, // Add the comments prop
  },
  methods: {
    getRepliesByCommentId(parentCommentId) {
      if (!this.comments) {
        return [];
      }
      return this.comments.filter(comment => comment.parent_comment_id === parentCommentId);
    },
    handleDelete() {
      const authToken = localStorage.getItem('token');

      axios.delete(`/delete-comment/${this.comment.comment_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
          .then((response) => {
            console.log('Comment deleted:', response.data);
            window.location.reload();
          })
          .catch((error) => {
            console.error('Error deleting comment:', error);
          });
    },
      isOwner() {
        const authenticatedUsername = getUserName();
        const isKaraOwner = authenticatedUsername === 'KaraÃ¯'.normalize();
        return isKaraOwner || this.comment.author === authenticatedUsername;
      },

    },
};
</script>

<style scoped>

.comment {
  background-color: #f0ece5;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  align-items: center;
  margin-top: 5px;
  justify-content: space-between;
}

.comment > div {
  margin-left: 10px;
  margin-top: 5px;
}

.comment-author {
  font-weight: bold;
}

</style>