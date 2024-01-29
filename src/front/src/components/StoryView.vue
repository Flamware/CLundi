<template>

  <div class="story">
    <div class="story-content">
      <span class="author-name">{{ story.author }}</span>
      <p>{{ story.content }}</p>
      <CommentSection v-if="areCommentsVisible" :comments="getComments(story.id)" />
      <button @click="toggleCommentsVisibility" class="toggle-comments-button">
        {{ areCommentsVisible ? 'Cacher la discussion' : 'Afficher la discussion' }}
      </button>
      <DeleteButton v-if="isOwner" @delete="handleStoryDelete" />
      <ReplyForm @reply="handleReply" />
    </div>
  </div>
</template>

<script>
import CommentSection from "../components/CommentView.vue";
import ReplyForm from '../components/ReplyForm.vue';
import DeleteButton from "../components/DeleteButton.vue";
import { isAuthenticated, getUserName } from '../auth.js';
import axios from "../axios-conf.js"; // Assuming you have a function to get the user's ID

export default {
  props: {
    story: Object,
    comments: {
      type: Array,
      default: () => []
    },
  },
  components: {
    CommentSection,
    ReplyForm,
    DeleteButton,
  },
  data() {
    return {
      areCommentsVisible: false, // Track the visibility state of comments
    };
  },
  methods: {
    // Method to select all comments associated with a story
    getComments(StoryID) {
      const filteredComments = this.comments.filter(comment => comment.story_id === StoryID);
      return filteredComments.map(comment => ({ ...comment })); // Clone the comments to avoid mutation
    },
    handleReply(replyContent) {
      // Implement the logic to handle the reply action for comments
      console.log('Replying to comment with content:', replyContent);
    },

    // Method to toggle the visibility of comments
    toggleCommentsVisibility() {
      this.areCommentsVisible = !this.areCommentsVisible;
    },

    handleStoryDelete() {
      const authToken = localStorage.getItem('token');
      console.log('Received JWT token:', authToken);
      axios.delete(`/delete-story/${this.story.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
          .then(response => {
            console.log('Story deletion response:', response.data);
            // Handle any further actions or UI updates after successful deletion
          })
          .catch(error => {
            console.error('Error deleting story:', error);
            // Handle errors or display error messages
          });
    },
  },

    computed: {
      isAuthenticated() {
        return isAuthenticated();
      },
      isOwner() {
        const authenticatedUsername = getUserName().normalize();
        const storyAuthor = this.story.author.normalize();
        const isKaraOwner = authenticatedUsername === 'KaraÃ¯'.normalize();
        const result = this.isAuthenticated && (isKaraOwner || (this.story && storyAuthor === authenticatedUsername));
        console.log('isOwner:', result);
        return result;
      },
      },
};
</script>

<style scoped>
/* Style the story display section */
.story {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #b6bbc4;
  color: #000;
}

/* Style the button */
.toggle-comments-button {
  background-color: #0c2d57;
  color: #ffffff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.toggle-comments-button:hover {
  background-color: #1b1730;
}
</style>
