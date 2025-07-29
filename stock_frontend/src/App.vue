<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <h1>Stock Management System</h1>
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
}
.app-header h1 {
  font-family: inherit;
  color: var(--primary);
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin: 0;
  text-shadow: none;
}
</style>
