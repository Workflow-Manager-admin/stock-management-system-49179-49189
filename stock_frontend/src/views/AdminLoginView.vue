<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import FormGroup from '../components/ui/FormGroup.vue';
import PrimaryButton from '../components/ui/PrimaryButton.vue';
import ErrorAlert from '../components/ui/ErrorAlert.vue';

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
          <FormGroup label="Admin Username" for-id="username">
            <input
              type="text"
              id="username"
              v-model="username"
              required
              autocomplete="username"
            />
          </FormGroup>
          <FormGroup label="Admin Password" for-id="password">
            <input
              type="password"
              id="password"
              v-model="password"
              required
              autocomplete="current-password"
            />
          </FormGroup>
          <PrimaryButton type="submit" :disabled="submitting">
            <span v-if="submitting">Logging In...</span>
            <span v-else>Login</span>
          </PrimaryButton>
          <ErrorAlert v-if="auth.loginError" :message="auth.loginError" />
        </form>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Outer flex for vertical shift above center */
.admin-login-outer {
  height: 100vh;
  min-height: 100vh;
  width: 100vw;
  min-width: 100vw;
  background: var(--background, #f7fafd);
  display: flex;
  align-items: flex-start; /* Align items to top, then use margin-top to push down */
  justify-content: center;
}

.admin-login-center {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  /* Move login box down to just above center: top 40% visually balanced */
  margin-top: 7vh; /* ~40% down in viewport, adjusted for box height */
  /* Provide responsive margin for small screens later */
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
  font-size: 2.02rem;
  font-weight: 900;
  margin: 0 0 1.23em 0;
  font-family: "Segoe UI", "Nunito Sans", Arial, sans-serif;
  letter-spacing: 0.04em;
  line-height: 1.12;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1em;
}

/* (removed .login-field-row, .login-error, and button[type="submit"] styles as replaced by reusable components) */
@media (max-width: 600px) {
  .admin-login-center {
    margin-top: 3vh; /* Less margin on small screens */
  }
  .admin-login-card {
    padding: 1.5em 0.5em 1.5em 0.5em;
    max-width: 99vw;
    min-width: unset;
  }
  h2 { font-size: 1.38rem; }
  form { gap: 0.92em; }
}
</style>
