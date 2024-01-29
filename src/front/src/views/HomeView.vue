<template>
  <div>
    <HeaderView></HeaderView>

    <section id="stories-container">
      <StoryView
          v-for="story in stories"
          :key="story.id"
          :story="story"
          :comments="comments"
          :authorId="story.authorId"></StoryView>

      <!-- Fixed position for submit story section -->
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
import CommentView from "../components/CommentView.vue";


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
  }
};
</script>



<style scoped>
main {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #CAC4CE;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

main h2 {
  font-size: 24px;
  margin-bottom: 20px;
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
  bottom: 50px; /* Stick to the bottom of #stories-container */
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#submit-story h2 {
  font-size: 24px;
}

#submit-story-form label {
  display: block;
  font-weight: bold;
}

#submit-story-form textarea {
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

#submit-button {
  background-color: #31304d;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#submit-button:hover {
  background-color: #242038;
}
</style>