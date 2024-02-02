<template>
  <div>
    <HeaderView></HeaderView>

    <section id="stories-container">
      <StoryView
          v-for="story in stories"
          :key="story.story_id"
          :story="story"
          :comments="getCommentsByStoryId(story.story_id)"
      />
      <section id="submit-story">
        <form @submit.prevent="submitStory" id="submit-story-form">
          <label for="story">Votre post :</label>
          <textarea v-model="story" id="story" name="story" rows="4" required></textarea>
          <button type="submit" id="submit-button">Partager</button>
        </form>
      </section>
    </section>

    <footer-view></footer-view>
  </div>
</template>

<script>
import axios from '../axios-conf.js'
import HeaderView from "../components/HeaderView.vue";
import FooterView from "../components/FooterView.vue";
import StoryView from "../components/StoryView.vue";
import CommentView from "../components/CommentSection.vue";


export default {
  components: { StoryView, FooterView, HeaderView, CommentView},
  data() {
    return {
      story: "",
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
      axios.get('/load-stories')
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
            console.log(this.comments);
          })
          .catch((error) => {
            console.error('Error fetching comments:', error);
          });
    },
    getCommentsByStoryId(storyId) {

      const filteredComments = this.comments.filter(comment => comment.story_id === storyId);
      return filteredComments.map(comment => ({ ...comment })); // Clone the comments to avoid mutation
      },

    submitStory() {
      const authToken = localStorage.getItem('token');
      axios.post('/submit-story', {
        story: this.story,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
          .then(response => {
            console.log('Story submission response:', response.data);
            // Handle any further actions or UI updates after successful submission
            this.loadStories();
          })
          .catch(error => {
            console.error('Error submitting story:', error);
            // Handle errors or display error messages
          });
    },
  }
};
</script>



<style scoped>
main {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

main h2 {
  font-size: 24px;
}

#stories-container {
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin: 20px auto 80px; /* Add bottom margin to avoid overlapping with the footer */
}

/* Fixed position for submit story section */
#submit-story {
  position: sticky;
  bottom: 46px; /* Stick to the bottom of #stories-container */
  background-color: #cac4ce;
  color: black;
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#submit-story h2 {
  font-size: 20px;
}

#submit-story-form label {
  display: block;
}

#submit-story-form textarea {
  width: 90%;
  border: 1px solid #ddd;
  border-radius: 5px;
}

#submit-button {
  background-color: #0c2d57;
  position: absolute;

  color: #fff;
  margin-top: 12px;
  margin-left: 3px;
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#submit-button:hover {
  background-color: #242038;
}
</style>