<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

/**
 * AdminNavButton
 * - Floats fixed on the left (middle, small devices: top)
 * - Visible only to logged-in admins
 * - Navigates to /admin-dashboard (to be created) if not on it
 * - If already on /admin-dashboard, shows "Back to Public View" that routes to /
 *
 * Accessibility: focusable, aria-label, keyboard
 */

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const showButton = computed(() => auth.isAdmin)
const onAdminPage = computed(() =>
  route.name === 'admin-dashboard'
  // Update/add route detection as needed if multiple admin pages
)

const handleClick = () => {
  if (onAdminPage.value) {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'admin-dashboard' })
  }
}
</script>

<template>
  <button
    v-if="showButton"
    class="admin-nav-fab"
    @click="handleClick"
    :aria-label="onAdminPage ? 'Back to Public View' : 'Manage Stock'"
    tabindex="0"
  >
    <span v-if="!onAdminPage">⚙️ Manage Stock</span>
    <span v-else>← Back to Public View</span>
  </button>
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
  /* Flat look, but visible */
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
</style>
