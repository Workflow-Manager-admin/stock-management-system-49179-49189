<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { computed } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const isAdmin = computed(() => auth.isAdmin)

function handleLogout() {
  auth.logout()
  router.push({ name: 'home' })
}

function goToLogin() {
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <header class="app-header">
    <h1>Stock Management System</h1>
    <nav class="app-nav">
      <button v-if="isAdmin" @click="handleLogout" class="admin-btn logout-btn">
        Logout (Admin)
      </button>
      <button v-else @click="goToLogin" class="admin-btn login-btn">
        Admin Login
      </button>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
.app-header {
  padding: 2.2rem 0 1.2rem 0;
  text-align: center;
  background: none;
  border-bottom: 2px solid var(--primary);
  margin-bottom: 2.2rem;
  position: relative;
}
.app-header h1 {
  font-family: inherit;
  color: var(--primary);
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin: 0;
  text-shadow: none;
  display: inline-block;
}
.app-nav {
  position: absolute;
  top: 1.6rem;
  right: 3vw;
  display: flex;
  gap: 1.1em;
}

.admin-btn {
  border-radius: 8px;
  font-size: 1em;
  font-family: inherit;
  color: #fff;
  font-weight: 700;
  padding: 0.42em 1.4em;
  margin-left: 1em;
  border: 2px solid var(--primary);
  background: linear-gradient(to right, var(--primary) 77%, var(--accent) 120%);
  box-shadow: 0 2px 16px #3498db12;
  transition: background 0.17s, border 0.17s;
  cursor: pointer;
}
.login-btn {
  background: linear-gradient(90deg, var(--primary), #1d5da5 90%);
  color: #fff;
  border-color: var(--primary);
}
.logout-btn {
  background: var(--danger);
  color: #fff;
  border-color: var(--danger);
}
.admin-btn:hover,
.admin-btn:focus {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
}
</style>
