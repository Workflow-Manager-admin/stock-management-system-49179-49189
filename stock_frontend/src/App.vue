<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { computed } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const isAdmin = computed(() => auth.isAdmin)

/**
 * Determine if we are currently showing the admin dashboard route.
 */
const isOnAdminDashboard = computed(() => route.name === 'admin-dashboard')

/**
 * Button label and navigation for admin, depending on route.
 * - On main/public view: show "Manage Stock", nav to dashboard.
 * - On admin dashboard: show "Back to Public View", nav to home.
 */
interface HeaderButton {
  label: string;
  action: (event: Event) => void;
}

const adminHeaderButton = computed<HeaderButton | null>(() => {
  if (!isAdmin.value) return null;
  return isOnAdminDashboard.value
    ? { label: 'Back to Public View', action: goToPublic }
    : { label: 'Manage Stock', action: goToDashboard };
});

function handleLogout() {
  auth.logout()
  router.push({ name: 'home' })
}
function goToLogin() {
  router.push({ name: 'admin-login' })
}
function goToDashboard(event: Event) {
  if (!isOnAdminDashboard.value) {
    // Blur the button to remove focus state
    (event.target as HTMLElement)?.blur?.();
    router.push({ name: 'admin-dashboard' });
  }
}
function goToPublic(event: Event) {
  if (isOnAdminDashboard.value) {
    (event.target as HTMLElement)?.blur?.();
    router.push({ name: 'home' });
  }
}
</script>

<template>
  <header class="app-header" role="banner">
    <div class="header-flex">
      <!-- Left: Admin Nav Button (admin only) -->
      <div class="header-left">
        <button
          v-if="adminHeaderButton"
          class="admin-btn manage-stock-btn back-public-btn"
          @click="(e) => adminHeaderButton?.action?.(e)"
          type="button"
        >
          <span class="button-text">{{ adminHeaderButton.label }}</span>
        </button>
        <!-- Always render (even if invisible) a "placeholder" of same width to keep title perfectly centered. -->
        <span
          v-else
          class="header-left-placeholder"
          aria-hidden="true"
        ></span>
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
  flex: 0 0 135px;
  /* Enough width for the largest button or the placeholder.
     Prevents the title from moving horizontally if button is hidden! */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 2vw;
  min-width: 125px;
  max-width: 160px;
  /* Space only for button, keeps title position stable */
}
.header-left-placeholder {
  display: inline-block;
  width: 125px;
  min-width: 125px;
  max-width: 140px;
  height: 1px;
  /* visually hidden but maintains the left header area width */
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
  /* Ensure header title does not move due to button visibility */
  padding: 0;
  margin: 0;
  width: 100%;
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
  font-size: 0.95em;
  font-family: inherit;
  color: #fff;
  font-weight: 700;
  padding: 0.6em 1em;
  margin-left: 1em;
  border: 2px solid var(--primary);
  background: var(--primary);
  box-shadow: 0 2px 12px #3498db13;
  transition: all 0.17s ease;
  cursor: pointer;
  min-width: 135px;
  max-width: 180px;
  min-height: 2.6em;
  height: auto;
  line-height: 1.15;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: normal;
  text-align: center;
  word-break: normal;
  overflow-wrap: break-word;
  hyphens: auto;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  /* Improved text handling for header buttons */
}

.manage-stock-btn {
  border-color: var(--primary);
  background: var(--primary);
  color: #fff;
  margin-left: 0;
  text-align: center;
  font-family: inherit;
  font-weight: 700;
  /* Remove nowrap for multi-line support */
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  min-width: 0;
  max-width: 260px;
  width: auto;
  box-sizing: border-box;
  padding-left: 1.1em;
  padding-right: 1.1em;
}
/* Button for Back to Public View specifically: tweaks for long label support */
.back-public-btn .button-text {
  display: inline-block;
  width: 100%;
  padding: 0;
  font-size: 1em;
  font-family: inherit;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.011em;
  overflow: visible;
  text-align: center;
}
.back-public-btn {
  min-width: 137px;
  max-width: 250px;
  width: auto;
  padding-left: 1.13em;
  padding-right: 1.13em;
  white-space: normal;
  word-break: normal;
}
@media (max-width: 700px) {
  .admin-btn,
  .manage-stock-btn,
  .back-public-btn {
    font-size: 0.90em !important;
    min-width: 88px !important;
    max-width: 135px !important;
    padding-left: 0.6em !important;
    padding-right: 0.6em !important;
    line-height: 1.18;
  }
  .back-public-btn .button-text {
    font-size: 0.98em;
  }
}

.manage-stock-btn:hover,
.manage-stock-btn:focus {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
  outline: 2px solid var(--primary);
  box-shadow: 0 2px 12px #f1c40f33;
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
  .header-left-placeholder {
    width: 87px;
    min-width: 78px;
    max-width: 100px;
    height: 1px;
  }
  .admin-btn {
    font-size: 0.85em;
    min-width: 100px;
    max-width: 140px;
    padding: 0.4em 0.8em;
    margin-left: .23em;
    height: auto;
    min-height: 2.4em;
    line-height: 1.2;
    white-space: normal;
  }
}

</style>
