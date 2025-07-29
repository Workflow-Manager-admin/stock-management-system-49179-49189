<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// PUBLIC_INTERFACE
/**
 * ConfirmationDialog component for critical actions that need user confirmation.
 * Props:
 * - show: boolean - controls dialog visibility
 * - title: string - dialog title
 * - message: string - confirmation message to display
 * - confirmText: string - text for confirm button (optional)
 * - cancelText: string - text for cancel button (optional)
 * Emits:
 * - confirm: when user confirms the action
 * - cancel: when user cancels
 */
defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop" @click="emit('cancel')" />
    <div v-if="show" class="modal" role="dialog" aria-modal="true">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="emit('cancel')" aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">{{ message }}</p>
          <div class="dialog-actions">
            <button 
              class="cancel-btn" 
              @click="emit('cancel')"
              :aria-label="cancelText || 'Cancel'"
            >
              {{ cancelText || 'Cancel' }}
            </button>
            <button 
              class="confirm-btn" 
              @click="emit('confirm')"
              :aria-label="confirmText || 'Confirm'"
            >
              {{ confirmText || 'Confirm' }}
            </button>
          </div>
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
  width: 400px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
}

.modal-content {
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--primary);
  font-size: 1.4rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0.5rem;
}

.confirm-message {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  line-height: 1.5;
  color: var(--text-main);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn, .confirm-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: var(--text-muted);
  border: 1px solid #dee2e6;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.confirm-btn {
  background: var(--primary);
  color: white;
  border: none;
}

.confirm-btn:hover {
  opacity: 0.9;
}
</style>
