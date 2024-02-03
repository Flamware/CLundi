<template>
  <div class="story">
    <div class="story-content">
      <span class="author">{{ story.author }}</span>
      <p class="content">{{ story.content }}</p>

      <button @click="toggleCommentsVisibility" class="toggle-comments">
        {{ areCommentsVisible ? 'Hide Discussion' : 'Show Discussion' }}
      </button>
      <div class="button-container">
      <ReplyForm v-if="isAuthenticated" :story_id="story.story_id" />
        <DeleteButton v-if="isOwner" @delete="handleStoryDelete" />
      </div>
      <CommentSection
          v-if="areCommentsVisible"
          :story_id="story.story_id"
          :comments="comments"
      />
    </div>
  </div>
</template>

<script>
import CommentSection from "./CommentSection.vue";
import ReplyForm from '../components/ReplyForm.vue';
import DeleteButton from "../components/DeleteButton.vue";
import { isAuthenticated, getUserName } from '../auth.js';
import axios from "../axios-conf.js";

export default {
  props: {
    story: {
      type: Object,
      required: true,
    },
    comments: Object,
  },

  components: {
    CommentSection,
    ReplyForm,
    DeleteButton,
  },
  data() {
    return {
      areCommentsVisible: false,
    };
  },
  methods: {
    toggleCommentsVisibility() {
      this.areCommentsVisible = !this.areCommentsVisible;
    },

    handleStoryDelete() {
      const authToken = localStorage.getItem('token');
      axios.delete(`/delete-story/${this.story.story_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
          .then(response => {
            console.log('Story deletion response:', response.data);
            window.location.reload();
          })
          .catch(error => {
            console.error('Error deleting story:', error);
          });
    },
  },
  computed: {
    isAuthenticated() {
      return isAuthenticated();
    },
    isOwner() {
      const authenticatedUsername = getUserName();
      const isKaraOwner = authenticatedUsername === 'KaraÃ¯'.normalize();
      return isKaraOwner || this.story.author === authenticatedUsername;
    },
  },
};
</script>

<style scoped>
/* Style the story display section */
.story {
  padding: 10px;
  border: 2px solid ;
  border-radius: 10px;
  background-color: #b6bbc4;
  color: #000;
  margin-bottom: 5px;
}

/* Style the button */
.toggle-comments {
  background-color: #0c2d57;
  color: #ffffff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

.toggle-comments:hover {
  background-color: #1b1730;
}

/* Style the author and content */
.author {
  font-weight: bold;
}

.content {
  margin-bottom: 10px;
}

.button-container{
  display: flex;
  align-items: center;
  margin-top: 5px;
  justify-content: space-between;
}
</style>
