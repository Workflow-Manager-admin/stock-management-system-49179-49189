<!--
  AdminDashboardView.vue
  Clean SFC: only one <script setup>, grouped card-based admin dashboard using AdminCategoryBlock.
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/services/adminApi'
import type { Category, Product } from '@/services/adminApi'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue'
import CategoryForm from '@/components/admin/CategoryForm.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import AdminCategoryBlock from '@/components/admin/AdminCategoryBlock.vue'

import { API_BASE_URL } from '../constants'
const API_BASE = API_BASE_URL

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')

// Modal state
const showCategoryModal = ref(false)
const showProductModal = ref(false)
const editingCategory = ref<Category | null>(null)
const editingProduct = ref<Product | null>(null)
const submitting = ref(false)
const pendingProductCategoryId = ref<number | null>(null)

// Confirmation dialog state
const showConfirmDialog = ref(false)
const confirmDialogConfig = ref({
  title: '',
  message: '',
  action: null as (() => Promise<void>) | null
})

// Data management
async function handleRefillMockData() {
  confirmDialogConfig.value = {
    title: 'Refill Mock Data',
    message: 'This will reset all current data with sample data. Are you sure?',
    action: async () => {
      await performRefillMockData()
    }
  }
  showConfirmDialog.value = true
}

async function performRefillMockData() {
  loading.value = true
  error.value = ''
  try {
    await adminApi.refillMockData()
    const [categoriesData, productsData] = await Promise.all([
      fetch(`${API_BASE}/categories`).then(r => r.json()),
      fetch(`${API_BASE}/products`).then(r => r.json())
    ])
    categories.value = categoriesData
    products.value = productsData
  } catch (err) {
    console.error('Refill mock data error:', err)
    error.value = 'Failed to refill mock data. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleClearAllData() {
  confirmDialogConfig.value = {
    title: 'Clear All Data',
    message: 'This will remove all categories and products. This action cannot be undone. Are you sure?',
    action: async () => {
      await performClearAllData()
    }
  }
  showConfirmDialog.value = true
}

async function performClearAllData() {
  loading.value = true
  error.value = ''
  try {
    await adminApi.clearAllData()
    categories.value = []
    products.value = []
    const [categoriesData, productsData] = await Promise.all([
      fetch(`${API_BASE}/categories`).then(r => r.json()),
      fetch(`${API_BASE}/products`).then(r => r.json())
    ])
    categories.value = categoriesData
    products.value = productsData
  } catch (err) {
    console.error('Clear data error:', err)
    error.value = 'Failed to clear data. Please try again.'
  } finally {
    loading.value = false
  }
}

// Data load
async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const [categoriesData, productsData] = await Promise.all([
      fetch(`${API_BASE}/categories`).then(r => r.json()),
      fetch(`${API_BASE}/products`).then(r => r.json())
    ])
    categories.value = categoriesData
    products.value = productsData
  } catch (err) {
    console.error('Load data error:', err)
    error.value = 'Failed to load data. Please try again.'
  } finally {
    loading.value = false
  }
}
onMounted(loadData)

// --- CRUD handlers, adapted for category-grouped view ---
async function handleCategorySubmit(data: { name: string }) {
  submitting.value = true
  try {
    if (editingCategory.value) {
      await adminApi.updateCategory(editingCategory.value.id, data)
    } else {
      await adminApi.createCategory(data)
    }
    await loadData()
    showCategoryModal.value = false
  } catch (err) {
    console.error('Save category error:', err)
    error.value = 'Failed to save category. Please try again.'
  } finally {
    submitting.value = false
    editingCategory.value = null
  }
}

async function deleteCategory(category: Category) {
  confirmDialogConfig.value = {
    title: 'Delete Category',
    message: `Are you sure you want to delete the category "${category.name}"? This cannot be undone.`,
    action: async () => {
      try {
        await adminApi.deleteCategory(category.id)
        await loadData()
      } catch (err) {
        console.error('Delete category error:', err)
        error.value = 'Failed to delete category. Please try again.'
      }
    }
  }
  showConfirmDialog.value = true
}

// Open modal for add/edit category
function openCategoryModal(category?: Category) {
  editingCategory.value = category || null
  showCategoryModal.value = true
}

// --- PRODUCT handlers for grouped admin UI ---
async function handleProductSubmit(data: { name: string; category_id: number; image_url: string; quantity: number }) {
  submitting.value = true
  try {
    if (editingProduct.value) {
      await adminApi.updateProduct(editingProduct.value.id, data)
    } else {
      await adminApi.createProduct(data)
    }
    await loadData()
    showProductModal.value = false
  } catch (err) {
    console.error('Save product error:', err)
    error.value = 'Failed to save product. Please try again.'
  } finally {
    submitting.value = false
    editingProduct.value = null
    pendingProductCategoryId.value = null
  }
}

async function deleteProduct(product: Product) {
  // unused 'category' removed to fix lint errors
  confirmDialogConfig.value = {
    title: 'Delete Product',
    message: `Are you sure you want to delete the product "${product.name}"? This cannot be undone.`,
    action: async () => {
      try {
        await adminApi.deleteProduct(product.id)
        await loadData()
      } catch (err) {
        console.error('Delete product error:', err)
        error.value = 'Failed to delete product. Please try again.'
      }
    }
  }
  showConfirmDialog.value = true
}

// In grouped UI, allow both generic product modal and group-specific "add to this category"
function openProductModal(product?: Product | null, categoryId?: number) {
  editingProduct.value = product || null
  if (typeof categoryId === 'number') {
    pendingProductCategoryId.value = categoryId
  } else {
    pendingProductCategoryId.value = null
  }
  showProductModal.value = true
}
</script>

<template>
  <div class="admin-dashboard">
    <!-- Data Management Section -->
    <section class="dashboard-section data-management">
      <div class="section-header">
        <h2>Data Management</h2>
        <div class="data-actions">
          <button 
            @click="handleRefillMockData" 
            class="data-btn refill"
            :disabled="loading"
            aria-label="Refill database with mock data"
          >
            Refill Mock Data
          </button>
          <button 
            @click="handleClearAllData" 
            class="data-btn clear"
            :disabled="loading"
            aria-label="Clear all data from database"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </section>

    <div v-if="loading" class="loading">Loading...</div>
    <ErrorAlert v-else-if="error" :message="error" />

    <template v-else>
      <!-- Card-based grouped admin UI -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>Categories & Products</h2>
          <button @click="openCategoryModal()" class="add-btn" title="Add category" aria-label="Add category">
            ➕ Add Category
          </button>
        </div>
        
        <div v-if="categories.length === 0" class="empty-state">
          <p>No categories yet! Use the ➕ button above to create categories.</p>
        </div>
        <div v-else>
          <AdminCategoryBlock
            v-for="cat in categories"
            :key="cat.id"
            :category="cat"
            :products="products.filter(prod => prod.category_id === cat.id)"
            @add-product="(catId) => openProductModal(null, catId)" 
            @edit-category="openCategoryModal"
            @delete-category="deleteCategory"
            @edit-product="(product, category) => openProductModal(product, category.id)"
            @delete-product="deleteProduct"
          />
        </div>
      </section>
    </template>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showConfirmDialog"
      :title="confirmDialogConfig.title"
      :message="confirmDialogConfig.message"
      @confirm="async () => {
        showConfirmDialog = false;
        if (confirmDialogConfig.action) await confirmDialogConfig.action();
      }"
      @cancel="showConfirmDialog = false"
    />

    <!-- Modals -->
    <BaseModal
      :show="showCategoryModal"
      :title="editingCategory ? 'Edit Category' : 'Add Category'"
      @close="showCategoryModal = false"
    >
      <CategoryForm
        :category="editingCategory || undefined"
        :submitting="submitting"
        @submit="handleCategorySubmit"
        @cancel="showCategoryModal = false"
      />
    </BaseModal>

    <BaseModal
      :show="showProductModal"
      :title="editingProduct ? 'Edit Product' : 'Add Product'"
      @close="showProductModal = false"
    >
      <ProductForm
        :product="editingProduct || undefined"
        :categories="categories"
        :submitting="submitting"
        @submit="handleProductSubmit"
        @cancel="showProductModal = false"
      />
    </BaseModal>
  </div>
</template>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}
/* Card/block layout update overrides */
.dashboard-section {
  background: white;
  border-radius: var(--card-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--card-shadow);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.35rem;
}
.section-header h2 {
  margin: 0;
  color: var(--primary);
}
.add-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.51rem 1.01rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.13rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 0.3em;
  transition: background 0.14s, color 0.1s;
}
.add-btn:hover, .add-btn:focus-visible {
  background: var(--accent);
  color: var(--primary);
}
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 15px;
  background: #fffbe3;
  margin: 1rem auto;
  width: 100%;
  border: 2px dashed var(--accent);
  color: var(--text-muted);
  font-size: 1.1em;
}

.data-management {
  margin-bottom: 2rem;
}
.data-actions {
  display: flex;
  gap: 1rem;
}
.data-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.data-btn.refill {
  background: var(--accent);
  color: var(--primary);
}
.data-btn.clear {
  background: var(--danger);
  color: white;
}
.data-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.data-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  .add-btn {
    padding: 0.33rem 0.6rem;
    font-size: 1rem;
  }
  .data-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
