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
  <div class="admin-login-outer">
    <main class="admin-login-center">
      <section class="admin-login-card">
        <h2>Admin Login</h2>
        <form @submit.prevent="handleLogin" autocomplete="on">
          <div class="login-field-row">
            <label for="username">Admin Username</label>
            <input type="text" id="username" v-model="username" required autocomplete="username" />
          </div>
          <div class="login-field-row">
            <label for="password">Admin Password</label>
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
  </div>
</template>

<style scoped>
/* Outer flex for full-page centering */
.admin-login-outer {
  height: 100vh;
  min-height: 100vh;
  width: 100vw;
  min-width: 100vw;
  background: var(--background, #f7fafd);
  display: flex;
  align-items: center;
  justify-content: center;
}
.admin-login-center {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* The card itself */
.admin-login-card {
  background: var(--surface, #fff);
  border-radius: 20px;
  box-shadow: 0 6px 36px 0 #2871b324, 0 1.5px 12px #223d5865;
  max-width: 410px;
  width: 95vw;
  min-width: 295px;
  min-height: 350px;
  padding: 2.4em 2.7em 2em 2.7em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  text-align: center;
  color: var(--primary, #3498db);
  font-size: 2.01rem;
  font-weight: 900;
  margin: 0 0 1.23em 0;
  font-family: "Segoe UI", "Nunito Sans", Arial, sans-serif;
  letter-spacing: 0.04em;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1em;
}

.login-field-row {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  margin-bottom: 0.7em;
}

label {
  font-family: inherit;
  font-weight: 600;
  color: var(--text-muted, #646e7a);
  margin-bottom: 0.39em;
  font-size: 1.08em;
  letter-spacing: 0.02em;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  font-size: 1.14em;
  font-family: inherit;
  font-weight: 500;
  color: var(--text-main, #25304a);
  background: #f7fafd;
  border: 1.7px solid #dde7f2;
  border-radius: 9px;
  padding: 0.60em 1.1em;
  outline: none;
  transition: border 0.18s, box-shadow 0.17s;
  letter-spacing: 0.01em;
  box-sizing: border-box;
}
input[type="text"]:focus,
input[type="password"]:focus {
  border-color: var(--primary, #3498db);
  box-shadow: 0 2.5px 14px #3a98cd1d;
}

button[type="submit"] {
  width: 100%;
  margin-top: 0.21em;
  padding: 0.82em 0.5em;
  font-size: 1.12em;
  font-family: inherit;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, var(--primary, #3498db) 85%, var(--accent, #f1c40f) 100%);
  color: #fff;
  box-shadow: 0 2px 11px #3699e019;
  transition: background 0.13s, box-shadow 0.13s;
  letter-spacing: 0.01em;
  cursor: pointer;
}
button[type="submit"]:hover:not(:disabled) {
  background: var(--secondary, #296ed9);
  color: #fff;
}

/* Disabled state */
button[type="submit"]:disabled {
  opacity: 0.67;
  cursor: not-allowed;
  background: #b5c5d888;
  color: #ffffffb0;
}
/* Error message styling */
.login-error {
  margin-top: 1.1em;
  color: var(--danger, #ef5350);
  background: #fff3f4;
  border: 1.7px solid var(--danger, #ef5350);
  border-radius: 10px;
  padding: 0.77em 1.13em;
  text-align: center;
  font-weight: 700;
  font-size: 1.037em;
  letter-spacing: 0.03em;
  min-width: 70%;
}
@media (max-width: 600px) {
  .admin-login-card {
    padding: 1.5em 0.5em 1.5em 0.5em;
    max-width: 99vw;
    min-width: unset;
  }
  h2 { font-size: 1.38rem; }
  form { gap: 0.92em; }
}
</style>
