<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// PUBLIC_INTERFACE
/**
 * AdminLoginView: provides a form for admin login (username, password).
 * Calls login action on submit, displays errors, and redirects on success.
 */

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const submitting = ref(false);

async function handleLogin() {
  submitting.value = true;
  const ok = await auth.login(username.value, password.value);
  submitting.value = false;
  if (ok) {
    router.push({ name: 'home' }); // Redirect to home after login
  }
}
</script>

<template>
  <main class="admin-login-container">
    <section class="card admin-login-box">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin" autocomplete="on">
        <div class="form-group">
          <label for="username">Admin Username:</label>
          <input type="text" id="username" v-model="username" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label for="password">Admin Password:</label>
          <input type="password" id="password" v-model="password" required autocomplete="current-password" />
        </div>
        <button type="submit" :disabled="submitting">
          <span v-if="submitting">Logging In...</span>
          <span v-else>Login</span>
        </button>
        <div v-if="auth.loginError" class="login-error">{{ auth.loginError }}</div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.admin-login-container {
  min-height: 65vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.admin-login-box {
  max-width: 390px;
  margin: 0 auto;
  padding: 2.7em 2.7em 2em 2.7em;
  box-shadow: 0 2px 22px #47587721;
  border-radius: var(--card-radius);
  background: #fff;
}
h2 {
  text-align: center;
  margin-bottom: 1em;
  color: var(--primary);
}
.form-group {
  margin-bottom: 1.3em;
}
label {
  font-weight: 600;
  color: var(--text-muted);
  display: block;
  margin-bottom: 0.35em;
  font-size: 1.01em;
}
input[type="text"],
input[type="password"] {
  width: 100%;
  font-size: 1em;
}
button[type="submit"] {
  width: 100%;
  margin-top: 0.45em;
  padding: 0.59em 0;
  font-size: 1.09em;
}
.login-error {
  margin-top: 1.3em;
  color: var(--danger);
  background: #ffebee;
  border: 1.3px solid #ef5350;
  border-radius: 9px;
  padding: 0.72em 1.1em;
  text-align: center;
  font-weight: 600;
  font-size: 1.02em;
}
</style>
