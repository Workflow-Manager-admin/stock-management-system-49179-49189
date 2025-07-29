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
  <header class="app-header" role="banner">
    <div class="header-flex">
      <!-- Left: Manage Stock (admin only) -->
      <div class="header-left">
        <button
          v-if="isAdmin"
          @click="()=>router.push({name:'admin-dashboard'})"
          class="admin-btn manage-stock-btn"
        >
          ⚙️ Manage Stock
        </button>
      </div>
      <!-- Center: Title -->
      <div class="header-title">
        <h1>Stock Management System</h1>
      </div>
      <!-- Right: Login/Logout -->
      <div class="header-right">
        <button v-if="isAdmin" @click="handleLogout" class="admin-btn logout-btn">
          Logout (Admin)
        </button>
        <button v-else @click="goToLogin" class="admin-btn login-btn">
          Admin Login
        </button>
      </div>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
.app-header {
  padding: 2.2rem 0 1.2rem 0;
  background: none;
  border-bottom: 2px solid var(--primary);
  margin-bottom: 2.2rem;
}

.header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
}

/* Header zone layouts */
.header-left, .header-right {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  min-width: 155px; /* matches button minimum */
}
.header-left {
  justify-content: flex-start;
  /* visually aligns with padding on title area */
  padding-left: 2vw;
}
.header-right {
  justify-content: flex-end;
  padding-right: 2vw;
  gap: 1em;
}
.header-title {
  flex: 0 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

/* Heading: always center, never overlapped */
.header-title h1 {
  font-family: inherit;
  color: var(--primary);
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin: 0;
  text-shadow: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 430px;
  width: 100%;
  text-align: center;
  transition: font-size 0.2s;
}

/* Responsive for header */
@media (max-width: 700px) {
  .header-title h1 {
    font-size: 1.19rem;
    max-width: 162px;
  }
  .header-left,
  .header-right {
    min-width: 86px;
    padding: 0 0.16em;
  }
  .header-flex {
    padding: 0 6px;
    min-width: 0;
  }
}

/* Old .app-nav (removed) */

/* General flat admin button style */
.admin-btn {
  border-radius: 8px;
  font-size: 1em;
  font-family: inherit;
  color: #fff;
  font-weight: 700;
  padding: 0.42em 1.4em;
  margin-left: 1em;
  border: 2px solid var(--primary);
  background: var(--primary); /* flat */
  box-shadow: 0 2px 12px #3498db13;
  transition: background 0.17s, border 0.17s, color 0.15s;
  cursor: pointer;
  min-width: 138px;
}

/* Flat blue for Manage, blue-to-accent on hover */
.manage-stock-btn {
  border-color: var(--primary);
  background: var(--primary);
  color: #fff;
  min-width: 146px;
  margin-left: 0; /* leftmost */
}
.manage-stock-btn:hover,
.manage-stock-btn:focus {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
  outline: 0;
}

/* Login = blue, Logout = red, same sizing/shape */
.login-btn {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.logout-btn {
  background: var(--danger);
  color: #fff;
  border-color: var(--danger);
}
.logout-btn:hover,
.logout-btn:focus {
  background: #fff;
  color: var(--danger);
  border-color: var(--danger);
}

/* Consistent hover/focus for all header admin buttons */
.admin-btn:hover,
.admin-btn:focus {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
}

@media (max-width: 700px) {
  .admin-btn {
    font-size: 0.92em;
    min-width: 98px;
    padding: 0.36em 0.7em;
    margin-left: .33em;
  }
  .manage-stock-btn {
    min-width: 106px;
  }
}
/* General flat admin button style */
.admin-btn {
  border-radius: 8px;
  font-size: 1em;
  font-family: inherit;
  color: #fff;
  font-weight: 700;
  padding: 0.42em 1.4em;
  margin-left: 1em;
  border: 2px solid var(--primary);
  background: var(--primary); /* flat */
  box-shadow: 0 2px 12px #3498db13;
  transition: background 0.17s, border 0.17s, color 0.15s;
  cursor: pointer;
  min-width: 138px;
}

/* Flat blue for Manage, blue-to-accent on hover */
.manage-stock-btn {
  border-color: var(--primary);
  background: var(--primary);
  color: #fff;
  min-width: 146px;
}
.manage-stock-btn:hover,
.manage-stock-btn:focus {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
  outline: 0;
}

/* Login = blue, Logout = red, same sizing/shape */
.login-btn {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.logout-btn {
  background: var(--danger);
  color: #fff;
  border-color: var(--danger);
}
.logout-btn:hover,
.logout-btn:focus {
  background: #fff;
  color: var(--danger);
  border-color: var(--danger);
}

/* Consistent hover/focus for all header admin buttons */
.admin-btn:hover,
.admin-btn:focus {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
}

@media (max-width: 700px) {
  .app-header h1 {
    font-size: 1.19rem;
  }
  .app-nav {
    right: 1vw;
    gap: .62em;
    top: 1.1rem;
  }
}
</style>
