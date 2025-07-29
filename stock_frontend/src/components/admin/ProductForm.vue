<script setup lang="ts">
import { ref } from 'vue'
import type { Product, Category } from '@/services/adminApi'
import FormGroup from '../ui/FormGroup.vue'
import ErrorAlert from '../ui/ErrorAlert.vue'

// PUBLIC_INTERFACE
/**
 * Product edit/create form component
 */
const props = defineProps<{
  product?: Product
  categories: Category[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: { name: string; category_id: number; image_url: string; quantity: number }): void
  (e: 'cancel'): void
}>()

// Initialize form values
const name = ref(props.product?.name || '')
const category_id = ref(props.product?.category_id || props.categories[0]?.id || 0)
const image_url = ref(props.product?.image_url || '')
const quantity = ref(props.product?.quantity ?? 0)
const error = ref('')

function handleSubmit() {
  if (!name.value.trim()) {
    error.value = 'Product name is required'
    return
  }
  if (!category_id.value) {
    error.value = 'Category is required'
    return
  }
  if (!image_url.value.trim()) {
    error.value = 'Image URL is required'
    return
  }
  if (quantity.value < 0) {
    error.value = 'Quantity cannot be negative'
    return
  }

  emit('submit', {
    name: name.value.trim(),
    category_id: category_id.value,
    image_url: image_url.value.trim(),
    quantity: quantity.value
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <FormGroup label="Product Name" for-id="productName">
      <input
        id="productName"
        v-model="name"
        type="text"
        required
        :disabled="submitting"
        placeholder="Enter product name"
      />
    </FormGroup>

    <FormGroup label="Category" for-id="productCategory">
      <select
        id="productCategory"
        v-model="category_id"
        required
        :disabled="submitting"
      >
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </FormGroup>

    <FormGroup label="Image URL" for-id="productImage">
      <input
        id="productImage"
        v-model="image_url"
        type="url"
        required
        :disabled="submitting"
        placeholder="Enter image URL"
      />
    </FormGroup>

    <FormGroup label="Quantity" for-id="productQuantity">
      <input
        id="productQuantity"
        v-model="quantity"
        type="number"
        required
        min="0"
        :disabled="submitting"
      />
    </FormGroup>

    <ErrorAlert v-if="error" :message="error" />

    <div class="form-actions">
      <button type="button" @click="emit('cancel')" :disabled="submitting">
        Cancel
      </button>
      <button type="submit" class="primary" :disabled="submitting">
        {{ submitting ? 'Saving...' : (product ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.product-form {
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
