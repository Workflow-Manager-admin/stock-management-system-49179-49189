<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

// PUBLIC_INTERFACE
/**
 * AdminDashboardView:
 * Main page for managing stock and categories.
 * (UI/logic will be implemented in a later task.)
 * Shows "Back to Public View" button left-floated just as on general views.
 */

const auth = useAuthStore()
const router = useRouter()

function handleBack() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div>
    <button
      v-if="auth.isAdmin"
      class="admin-nav-fab"
      @click="handleBack"
      aria-label="Back to Public View"
      tabindex="0"
    >← Back to Public View</button>
    <div class="admin-dashboard-center">
      <h2>Stock Management Dashboard</h2>
      <p>Admin-only stock and category controls go here.</p>
      <!-- Additional controls/forms will be added here in further work -->
    </div>
  </div>
</template>

<style scoped>
.admin-nav-fab {
  position: fixed;
  left: 0.9rem;
  top: 44vh;
  z-index: 1300;
  background: linear-gradient(90deg, var(--primary), var(--secondary) 60%);
  border: none;
  color: #fff;
  font-size: 1.13rem;
  padding: 0.84em 1.48em 0.84em 1.6em;
  border-radius: 17px 27px 27px 17px;
  box-shadow: 0 4px 24px #3498db38, 0 2px 4px #1d5da566;
  font-weight: 900;
  cursor: pointer;
  outline: 0;
  transition: background 0.16s, color 0.17s, box-shadow 0.13s, left 0.15s, top 0.13s;
  letter-spacing: 0.02em;
}
.admin-nav-fab:focus, .admin-nav-fab:hover {
  background: var(--accent);
  color: var(--primary);
  box-shadow: 0 6px 30px #f1c40f41, 0 3px 7px #fabd007c;
}
@media (max-width: 800px) {
  .admin-nav-fab {
    top: 1.7rem;
    left: 1.2rem;
    font-size: 1.03rem;
    padding: 0.7em 1em 0.7em 1.3em;
    border-radius: 14px 21px 21px 14px;
  }
}
.admin-dashboard-center {
  min-height: 32vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4.2rem;
}
</style>
