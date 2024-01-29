<template>
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
// main.js or main.ts
import axios from '@/axios-conf'; // Update the import path
import HeaderView from '@/components/HeaderView.vue'
import FooterView from "@/components/FooterView.vue";
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
    // Example login method in your LoginView component
    login() {
      axios.post('/login', {
        username: this.username,
        password: this.password
      })
          .then((response) => {
            // Assuming the server returns a token upon successful login
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
        this.$router.push({ name: 'sign-in' }); // Use the correct route name
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

#login-form {
  text-align: center;
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

.label {
  display: block;
  margin-bottom: 10px;
  text-align: left;
}

.input-group {
  display: flex;
  flex-direction: column;
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
  background-color: #333;
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