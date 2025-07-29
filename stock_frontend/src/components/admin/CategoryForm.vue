<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '@/services/adminApi'
import FormGroup from '../ui/FormGroup.vue'
import ErrorAlert from '../ui/ErrorAlert.vue'

// PUBLIC_INTERFACE
/**
 * Category edit/create form component
 */
const props = defineProps<{
  category?: Category
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: { name: string }): void
  (e: 'cancel'): void
}>()

const name = ref(props.category?.name || '')
const error = ref('')

function handleSubmit() {
  if (!name.value.trim()) {
    error.value = 'Category name is required'
    return
  }
  emit('submit', { name: name.value.trim() })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="category-form">
    <FormGroup label="Category Name" for-id="categoryName">
      <input
        id="categoryName"
        v-model="name"
        type="text"
        required
        :disabled="submitting"
        placeholder="Enter category name"
      />
    </FormGroup>

    <ErrorAlert v-if="error" :message="error" />

    <div class="form-actions">
      <button type="button" @click="emit('cancel')" :disabled="submitting">
        Cancel
      </button>
      <button type="submit" class="primary" :disabled="submitting">
        {{ submitting ? 'Saving...' : (category ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.category-form {
  padding: 1rem 0;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
button {
  padding: 0.5rem 1rem;
}
button.primary {
  background: var(--primary);
  color: white;
}
</style>
