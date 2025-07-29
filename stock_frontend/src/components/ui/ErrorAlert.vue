<script setup lang="ts">
// PUBLIC_INTERFACE
/**
 * ErrorAlert: Renders styled error message for forms or views (uses role="alert").
 */
import { defineProps } from 'vue';

defineProps<{
  message: string;
}>();
</script>

<template>
  <div v-if="message" class="error-alert" role="alert">
    <strong>Oops:</strong>
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.error-alert {
  margin-top: 1.1em;
  color: var(--danger, #ef5350);
  background: #fff3f4;
  border: 1.7px solid var(--danger, #ef5350);
  border-radius: 10px;
  padding: 0.77em 1.13em;
  text-align: center;
  font-weight: 700;
  font-size: 1.037em;
  letter-spacing: 0.03em;
  min-width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.55em;
}
</style>
