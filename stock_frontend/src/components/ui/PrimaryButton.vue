<script setup lang="ts">
// PUBLIC_INTERFACE
/**
 * PrimaryButton: Consistent, modern, accessible button. Accepts normal button attributes via $attrs.
 */
import { defineProps, useAttrs } from 'vue';

defineProps<{
  disabled?: boolean;
}>();
const attrs = useAttrs() as Record<string, unknown>;
</script>

<template>
  <button
    class="primary-btn"
    v-bind="attrs"
    type="button"
  >
    <slot />
  </button>
</template>

<style scoped>
.primary-btn {
  width: 100%;
  margin-top: 0.21em;
  padding: 0.82em 0.5em;
  font-size: 1.08em;
  font-family: inherit;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  background: var(--primary, #3498db);
  color: #fff;
  box-shadow: 0 2px 11px #3699e019;
  transition: background 0.13s, box-shadow 0.13s, color 0.13s;
  letter-spacing: 0.01em;
  cursor: pointer;
  outline: none;
}
.primary-btn:hover:not(:disabled),
.primary-btn:focus-visible:not(:disabled) {
  background: var(--accent, #f1c40f);
  color: var(--primary, #3498db);
  outline: 2px solid var(--primary, #3498db);
}
.primary-btn:disabled {
  opacity: 0.67;
  cursor: not-allowed;
  background: #b5c5d888;
  color: #ffffffb0;
}
</style>
