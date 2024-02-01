<template>
  <div class="comment-section">
    <div v-for="comment in getParentComment()" :key="comment.comment_id" class="comment">
      <span class="comment-author">{{ comment.author }}</span>
      <p class="comment-content">{{ comment.content }}</p>
      <div class="button-container">
        <ReplyForm :story_id="story_id" :parent_comment_id="comment.comment_id" />
        <DeleteCom @delete="handleDelete(comment)" />
      </div>
      <div>
        <CommentItem
            v-for="reply in getRepliesByCommentId(comment.comment_id)"
            :key="reply.comment_id"
            :comment="reply"
            :isAuthenticated="isAuthenticated"
            :story_id="story_id"
            :comments="comments"
            @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ReplyForm from './ReplyForm.vue';
import DeleteCom from '../components/DeleteButton.vue';
import CommentItem from "./CommentItem.vue";
import axios from "../axios-conf.js";

export default {
  name: 'CommentSection',
  components: {
    ReplyForm,
    DeleteCom,
    CommentItem,
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
    story_id: {
      type: String,
      required: true,
    },
    isAuthenticated: Boolean,
  },
  methods: {
    getRepliesByCommentId(parentCommentId) {
      return this.comments ? this.comments.filter(comment => comment.parent_comment_id === parentCommentId) : [];
    },
    getParentComment() {
      return this.comments ? this.comments.filter(comment => comment.parent_comment_id === null) : [];
    },
    handleDelete(comment) {
      const authToken = localStorage.getItem('token');
      console.log("comm", comment.comment_id);
      axios.delete(`/delete-comment/${comment.comment_id}`, {
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
  margin-top: 5px;
}

.comment > div {
  margin-top: 5px;
  margin-left: 20px;
}

.comment-author {
  font-weight: bold;
}
.button-container{
  display: flex;
  align-items: center;
  margin-top: 5px;
  justify-content: space-between;
}
</style>
