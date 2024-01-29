<template>
  <div class="story">
    <div class="story-content">
      <span class="author-name">{{ story.author }}</span>
      <p>{{ story.content }}</p>
      <CommentSection :comments="comments"></CommentSection>
    </div>
  </div>
</template>

<script>
import CommentSection from "@/components/CommentView.vue";

export default {
  props: {
    story: Object,
    comments: {
      type: Array,
      default: () => [] // Set a default empty array if comments are not provided
    },
  },
  components: {
    CommentSection,
  },
  mounted() {
  },
};
</script>

<style scoped>
.story {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
