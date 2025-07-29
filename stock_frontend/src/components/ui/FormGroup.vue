<script setup lang="ts">
// PUBLIC_INTERFACE
/**
 * FormGroup: Layouts a label/input group for reusability, accessibility, and style.
 * Props:
 *   - label: string - label shown for the field
 *   - forId: string - id of the input it labels
 */
import { defineProps } from 'vue';

defineProps<{
  label: string;
  forId: string;
}>();
</script>

<template>
  <div class="form-group">
    <label :for="forId">{{ label }}</label>
    <slot />
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  margin-bottom: 1em;
}
label {
  font-family: inherit;
  font-weight: 600;
  color: var(--text-muted, #646e7a);
  margin-bottom: 0.39em;
  font-size: 1.08em;
  letter-spacing: 0.02em;
}
</style>
