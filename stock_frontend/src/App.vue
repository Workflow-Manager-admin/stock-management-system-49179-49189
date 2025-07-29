<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1 class="brand-title">Stock Management System</h1>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  padding: 2rem 0 1.5rem 0;
  text-align: center;
  background: none;
  border-bottom: 2px solid #f1c40f33;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 8px #c3dce622;
}
.brand-title {
  font-family: 'Comic Sans MS', 'Comic Sans', Arial, cursive, sans-serif;
  color: #3498db;
  font-size: 2.25rem;
  letter-spacing: 0.02em;
  margin: 0;
  font-weight: 800;
  text-shadow: 1px 1px 0 #fff6, 2px 2px 8px #f1c40f88;
}
</style>
