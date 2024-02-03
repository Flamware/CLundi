<template>
  <meta charset="UTF-8">
  <div class="login">
    <header-view></header-view>
    <main>
      <section id="login-form">
        <h2>Connexion</h2>
        <form @submit.prevent="login" method="POST">
          <div class="form-group">
            <label for="username">Nom d'utilisateur :</label>
            <input v-model="username" type="text" id="username" name="username" required>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe :</label>
            <input v-model="password" type="password" id="password" name="password" required>
          </div>

          <div class="button-container">
            <button type="submit">Se connecter</button>
            <div id="error-message" style="color: red;">{{ errorMessage }}</div>
            <button type="button" @click="navigateToSignUp">S'inscrire</button>
          </div>
        </form>
      </section>
    </main>
    <FooterView></FooterView>
  </div>
</template>

<script>
import axios from '../axios-conf.js';
import HeaderView from '../components/HeaderView.vue';
import FooterView from "../components/FooterView.vue";

export default {
  name: 'LoginView',
  components: {
    FooterView,
    HeaderView
  },
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    login() {
      axios.post('/login', {
        username: this.username,
        password: this.password
      })
          .then((response) => {
            const token = response.data.token;

            // Store the token in localStorage
            localStorage.setItem('token', token);

            // Redirect to home or another route
            this.$router.push('/');
          })
          .catch((error) => {
            this.errorMessage = error.response.data.error;
          });
    },
    navigateToSignUp() {
      this.$router.push({ name: 'sign-in' });
    }
  }
}
</script>


<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.login {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1; /* Add this line */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#login-form {
  text-align: center;
  background-color: #b6bbc4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin-top: 15px;
  color: black;
}

h2 {
  font-size: 24px;
  color: #333;
}

form {
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

input[type="text"],
input[type="password"] {
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.button-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
}

button {
  background-color: #0c2d57;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #555;
}

#error-message {
  margin-top: 10px;
}
</style>