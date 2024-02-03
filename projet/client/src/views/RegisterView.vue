<template>
  <div>
    <header-view></header-view>
    <main>
      <section id="create-account-form">
        <h2>Créer un Compte</h2>
        <form @submit.prevent="createAccount" method="POST">
          <label for="username">Nom d'utilisateur :</label>
          <input v-model="username" type="text" id="username" name="username" required>

          <label for="email">Adresse e-mail :</label>
          <input v-model="email" type="email" id="email" name="email" required>

          <label for="password">Mot de passe :</label>
          <input v-model="password" type="password" id="password" name="password" required>

          <label for="confirm-password">Confirmez le mot de passe :</label>
          <input v-model="confirmPassword" type="password" id="confirm-password" name="confirm-password" required>

          <button type="submit" id="create-account-button">Créer un Compte</button>
        </form>

        <p>Déjà un compte ? <router-link to="/login">Connexion</router-link></p>
      </section>
    </main>
    <footer-view></footer-view>
  </div>
</template>

<script>
import axios from '../axios-conf.js'; // Update the import path
import HeaderView from "../components/HeaderView.vue";
import FooterView from "../components/FooterView.vue";

export default {
  components: {
    FooterView,
    HeaderView
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    createAccount() {
      axios.post('/register', {
        username: this.username,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      })
          .then((response) => {
            // Assuming the server returns a token upon successful account creation
            const token = response.data.token;

            // Store the token in localStorage or wherever you handle authentication
            localStorage.setItem('token', token);

            // Redirect to home or another route
            this.$router.push('/login');
          })
          .catch((error) => {
            console.error('Error creating account:', error);
            // Handle error response and display error message
          });
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #8D86C9;
  color: #333;
}

main {
  max-width: 400px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  background-color: #b6bbc4;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  color: black;
}

h2 {
  font-size: 24px;
  color: #333;
}

form {
  margin-top: 10px;
}

label {
  display: block;
  margin-bottom: 10px;
  text-align: left;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  color: black;
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
```