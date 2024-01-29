<template>
  <div>
    <HeaderView></HeaderView>
    <section id="submit-story">
      <h2>{{ headingText }}</h2>
      <form @submit.prevent="submitStory" id="submit-story-form">
        <label for="story">Partagez votre histoire :</label>
        <textarea v-model="story" id="story" name="story" rows="4" required></textarea>
        <button type="submit" id="submit-button">Partager</button>
      </form>
    </section>
    <section id="stories-container">
      <StoryView v-for="story in stories" :key="story.id" :story="story" :comments="getRepliesByCommentId(story.id)"></StoryView>
    </section>
    <footer-view></footer-view>
  </div>
</template>

<script>
import axios from '@/axios-conf';
import HeaderView from "@/components/HeaderView.vue";
import FooterView from "@/components/FooterView.vue";
import StoryView from "@/components/StoryView.vue";
import CommentView from "@/components/CommentView.vue";


export default {
  components: { StoryView, FooterView, HeaderView, CommentView},
  data() {
    return {
      headingText: "Ici, vous pourrez évacuer la frustration que vous ressentez en ce début de semaine et/ou partager votre week-end.",
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
.comments .comment {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #725AC1;
  border-radius: 10px;
  background-color: #f7ece1;
  margin-left: 20px; /* Adjust the left margin for nested comments */
}
</style>

<style scoped>
  main {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #CAC4CE;
    border: 1px solid #ddd;
    border-radius: 10px; /* Rounded corners for the main content */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  main h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  #submit-story-form label {
    display: block;
    font-weight: bold;
    margin-top: 10px;
  }

  #story {
    max-width: 97%; /* Ensure the text area doesn't exceed the container width */
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  #submit-story-form input[type="text"],
  #submit-story-form textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
  }

  #submit-button {
    background-color: #242038; /* Red button background */
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  #submit-button:hover {
    background-color: #242038; /* Darker red on hover */
  }

  /* Style the story display section */
  #stories-container .story {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 10px; /* Rounded corners for story sections */
    background-color: #8D86C9; /* Light gray background */
    color: #000;
  }

  .author-name {
    font-weight: bold;
  }

  /* Style for all comment sections */
  .comment {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #725AC1;
    border-radius: 10px;
    background-color: #f7ece1;
  }

  </style>
