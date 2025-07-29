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

.header-left,
.header-right {
  display: flex;
  align-items: center;
  min-width: 0;
}

.header-left {
  flex: 0 0 auto;
  justify-content: flex-start;
  padding-left: 2vw;
  /* Give only as much space as needed */
}

.header-right {
  flex: 0 0 auto;
  justify-content: flex-end;
  padding-right: 2vw;
  gap: 1em;
  /* Only takes enough width for its content */
}

.header-title {
  flex: 1 1 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

.header-title h1 {
  font-family: inherit;
  color: var(--primary);
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin: 0;
  text-shadow: none;
  /* CENTERED, fully visible, no ellipsis/truncation */
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  max-width: none;
  width: auto;
  text-align: center;
  transition: font-size 0.2s;
  line-height: 1.1;
  /* allow wrapping on mobile if needed but prioritize centering/visibility */
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
  background: var(--primary);
  box-shadow: 0 2px 12px #3498db13;
  transition: background 0.17s, border 0.17s, color 0.15s;
  cursor: pointer;
  min-width: 118px;
  /* Decrease min-width so buttons only reserve space they need, prevents squeezing of title */
}

.manage-stock-btn {
  border-color: var(--primary);
  background: var(--primary);
  color: #fff;
  min-width: 125px;
  margin-left: 0;
}
.manage-stock-btn:hover,
.manage-stock-btn:focus {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
  outline: 0;
}

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

.admin-btn:hover,
.admin-btn:focus {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
}

@media (max-width: 700px) {
  .header-flex {
    padding: 0 6px;
    min-width: 0;
  }
  .header-title h1 {
    font-size: 1.12rem;
    /* Allow wrapping if space is too tight, prefer 2 lines than truncation */
    white-space: normal;
    max-width: 98vw;
    min-width: 0;
    overflow: visible;
    text-overflow: unset;
    word-break: break-word;
    line-height: 1.13;
    padding: 0 6vw;
  }
  .header-left,
  .header-right {
    min-width: 54px;
    max-width: 33vw;
    padding: 0 0.16em;
    flex: 0 0 auto;
  }
  .admin-btn {
    font-size: 0.87em;
    min-width: 78px;
    padding: 0.33em 0.67em;
    margin-left: .23em;
  }
  .manage-stock-btn {
    min-width: 87px;
  }
}

</style>
