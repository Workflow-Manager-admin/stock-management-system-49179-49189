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
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background, #f6f8fa);
  /* fallback for bright, clean background */
}

.admin-login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 2.7em 2.7em 2em 2.7em;
  box-shadow: 0 4px 32px #47587733;
  border-radius: 18px;
  background: #fff;
  min-width: 320px;
  min-height: 340px;
  justify-content: center;
}

h2 {
  text-align: center;
  margin-bottom: 1.5em;
  color: var(--primary, #3498db);
  font-weight: 700;
  letter-spacing: 1px;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.form-group {
  margin-bottom: 1.3em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

label {
  font-weight: 600;
  color: var(--text-muted, #636e72);
  margin-bottom: 0.42em;
  font-size: 1.03em;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  font-size: 1.07em;
  border: 1.5px solid #cfd8dc;
  border-radius: 7px;
  padding: 0.57em 1em;
  background: #f5f8fc;
  transition: border-color 0.18s;
  outline: none;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: var(--primary, #3498db);
}

button[type="submit"] {
  width: 100%;
  margin-top: 0.45em;
  padding: 0.70em 0;
  font-size: 1.09em;
  font-weight: 700;
  background: var(--primary, #3498db);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.12s;
  box-shadow: 0 2px 10px #c9d5ee3d;
}

button[type="submit"]:hover:not(:disabled) {
  background: #2167a9;
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-error {
  margin-top: 1.3em;
  color: var(--danger, #ef5350);
  background: #ffebee;
  border: 1.3px solid #ef5350;
  border-radius: 9px;
  padding: 0.72em 1.1em;
  text-align: center;
  font-weight: 600;
  font-size: 1.02em;
  letter-spacing: 0.1px;
}

/* Responsive tweaks */
@media (max-width: 500px) {
  .admin-login-box {
    padding: 2em 0.5em 2em 0.5em;
    min-width: unset;
    max-width: 98vw;
  }
  .admin-login-container {
    padding: 0 1vw;
  }
}
</style>
