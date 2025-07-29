<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// PUBLIC_INTERFACE
/**
 * BaseModal component for forms and dialogs
 */
defineProps<{
  show: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop" @click="emit('close')" />
    <div v-if="show" class="modal" role="dialog" aria-modal="true">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="emit('close')" aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  background: #fff;
  border-radius: var(--card-radius);
  min-width: 300px;
  max-width: 90vw;
  width: 500px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
}

.modal-content {
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--primary);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0.5rem;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
