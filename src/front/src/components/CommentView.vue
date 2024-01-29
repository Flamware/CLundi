<template>
  <div class="comment-section">
    <div v-for="comment in comments" :key="comment.comment_id" class="comment">
      <span class="comment-author">{{ comment.author }}</span>
      <p class="comment-content">{{ comment.content }}</p>
      <CommentSection v-if="comment.replies && comment.replies.length > 0" :comments="comment.replies"></CommentSection>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentSection',
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  mounted() {
    console.log(this.comments);
  },
  methods: {
    // Recursive method to get replies by comment id
    getRepliesByCommentId(parentCommentId) {
      const filteredReplies = [];
      for (let i = 0; i < this.comments.length; i++) {
        const reply = this.comments[i];

        if (reply.parent_comment_id === parentCommentId) {
          const clonedReply = { ...reply };
          clonedReply.replies = this.getRepliesByCommentId(reply.comment_id);
          filteredReplies.push(clonedReply);
        }
      }
      return filteredReplies;
    }
  }
};
</script>

<style scoped>
.comment {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
