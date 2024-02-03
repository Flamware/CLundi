<template>
  <div class="home">
    <HeaderView></HeaderView>
    <div class="home_content">
      <div class="home_content_stories">
        <div class="home_content_stories_title">
          <h1>Stories</h1>
        </div>
        <div class="home_content_stories_list">
          <div v-for="story in stories" :key="story.story_id" class="story">
            <span class="story-author">{{ story.author }}</span>
            <p class="story-content">{{ story.content }}</p>
            <delete-button @delete="deleteStory(story.story_id)" />
          </div>
        </div>
      </div>
      <div class="home_content_comments">
        <div class="home_content_comments_title">
          <h1>Comments</h1>
        </div>
        <div class="home_content_comments_list">
          <div v-for="comment in comments" :key="comment.comment_id" class="comment">
            <span class="comment-author">{{ comment.author }}</span>
            <p class="comment-content">{{ comment.content }}</p>
            <delete-button @delete="deleteCom(comment.comment_id)" />
          </div>
        </div>
      </div>
      <FooterView></FooterView>
    </div>
  </div>
</template>

<script>
import axios from '../axios-conf.js';
import HeaderView from "../components/HeaderView.vue";
import FooterView from "../components/FooterView.vue";
import DeleteButton from "../components/DeleteButton.vue";

export default {
  components: { DeleteButton, FooterView, HeaderView },
  data() {
    return {
      stories: [],
      comments: [],
    };
  },
  mounted() {
    this.loadStories();
    this.loadComments();
  },
  methods: {
    loadStories() {
      axios.get('http://localhost:8080/load-stories')
          .then((response) => {
            this.stories = response.data.stories;
          })
          .catch((error) => {
            console.error('Error fetching stories:', error);
          });
    },
    loadComments() {
      axios.get('/load-comments')
          .then((response) => {
            this.comments = response.data.comments;
          })
          .catch((error) => {
            console.error('Error fetching comments:', error);
          });
    },
    deleteStory(storyId) {
      const authToken = localStorage.getItem('token');
      axios.delete(`/delete-story/${storyId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
          .then(response => {
            console.log('Story deletion response:', response.data);
            // Handle any further actions or UI updates after successful deletion
            this.loadStories(); // Refresh the list after deletion
          })
          .catch(error => {
            console.error('Error deleting story:', error);
            // Handle errors or display error messages
          });
    },
    deleteCom(commentId) {
      const authToken = localStorage.getItem('token');
      axios.delete(`/delete-comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
          .then(response => {
            console.log('Comment deletion response:', response.data);
            // Handle any further actions or UI updates after successful deletion
            this.loadComments(); // Refresh the list after deletion
          })
          .catch(error => {
            console.error('Error deleting comment:', error);
            // Handle errors or display error messages
          });
    },
  }
};
</script>
