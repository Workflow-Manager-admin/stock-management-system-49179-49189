<script setup lang="ts">
// PUBLIC_INTERFACE
/**
 * AdminDashboardView:
 * Main page for managing stock and categories.
 * (UI/logic will be implemented in a later task.)
 * Shows "Back to Public View" button left-floated just as on general views.
 */
// Nothing needed here currently
</script>

<template>
  <div>
    <div class="admin-dashboard-center">
      <h2>Stock Management Dashboard</h2>
      <p>Admin-only stock and category controls go here.</p>
      <!-- Additional controls/forms will be added here in further work -->
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard-center {
  min-height: 32vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4.2rem;
}
</style>
