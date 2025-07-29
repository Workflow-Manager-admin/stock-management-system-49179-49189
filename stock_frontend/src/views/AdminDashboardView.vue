<!--
  AdminDashboardView.vue
  Clean SFC: only one <script setup>, grouped card-based admin dashboard using AdminCategoryBlock, right sidebar.
-->
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { adminApi } from '@/services/adminApi'
import type { Category, Product } from '@/services/adminApi'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue'
import CategoryForm from '@/components/admin/CategoryForm.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import AdminCategoryBlock from '@/components/admin/AdminCategoryBlock.vue'
import CategorySidebar from '@/components/CategorySidebar.vue'
import type { ComponentPublicInstance } from 'vue'

import { API_BASE_URL } from '../constants'
const API_BASE = API_BASE_URL

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')

// Category sidebar interaction state for admin page
const selectedCategoryId = ref<number | null>(null)
type CategorySectionEl = Element | ComponentPublicInstance | null
const categoryRefs = ref<Record<number, CategorySectionEl>>({})

/**
 * Util: True if given object is a Vue component instance.
 */
function isComponentInstance(obj: unknown): obj is ComponentPublicInstance {
  return !!obj && typeof obj === 'object' && '$el' in obj;
}

/**
 * Get HTMLElement from a ref/value that may be a component or DOM node.
 */
function getDomElement(refEl: CategorySectionEl): HTMLElement | null {
  if (!refEl) return null;
  if (refEl instanceof HTMLElement) return refEl;
  if (isComponentInstance(refEl) && refEl.$el instanceof HTMLElement) return refEl.$el;
  return null;
}

/**
 * Scroll to category section after selection (sidebar).
 */
async function handleSelectCategory(id: number): Promise<void> {
  selectedCategoryId.value = id;
  await nextTick();
  const refEl = getDomElement(categoryRefs.value[id]);
  if (refEl && typeof refEl.scrollIntoView === 'function') {
    refEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    refEl.focus?.({ preventScroll: true });
  }
}

/**
 * Returns a ref setter for each category block.
 */
function setCategoryRef(id: number) {
  return (el: CategorySectionEl) => {
    categoryRefs.value[id] = el;
  };
}

// Products grouped by category (for fast lookup)
const productsByCategory = computed(() => {
  const map: Record<number, Product[]> = {};
  products.value.forEach((prod) => {
    if (!map[prod.category_id]) map[prod.category_id] = [];
    map[prod.category_id].push(prod);
  });
  return map;
});

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

/**
 * Data load, also reset selected category for sidebar if needed.
 */
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
    if (categories.value.length > 0 && selectedCategoryId.value == null) {
      selectedCategoryId.value = categories.value[0].id
    }
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
  <div class="admin-dashboard-flex">
    <div class="admin-dashboard-main">
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
              :products="productsByCategory[cat.id] || []"
              :ref="setCategoryRef(cat.id)"
              :class="{ 'highlighted-block': selectedCategoryId === cat.id }"
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
    <div class="admin-dashboard-sidebar" v-if="categories.length">
      <CategorySidebar
        :categories="categories"
        :selectedCategoryId="selectedCategoryId"
        @select="handleSelectCategory"
      />
    </div>
  </div>
</template>

<style scoped>
/* Responsive admin dashboard two-column layout with sidebar on right */

.admin-dashboard-flex {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2.3rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.admin-dashboard-main {
  padding: 2rem 0rem 2rem 2rem;
  flex: 1;
  min-width: 0;
}

.admin-dashboard-sidebar {
  align-self: flex-start;
  margin-top: 2.7rem;
  position: sticky;
  top: 1.2rem;
  z-index: 2;
  /* Place summary/index sidebar on right for admin view */
}

@media (max-width: 880px) {
  .admin-dashboard-flex {
    flex-direction: column-reverse;
    gap: 1.7rem;
    padding: 0 4vw;
  }
  .admin-dashboard-main {
    padding: 1rem 0.3rem 1rem 0.3rem;
  }
  .admin-dashboard-sidebar {
    margin-top: 0.7rem;
    margin-bottom: 1.2rem;
    position: static;
  }
}

.admin-dashboard {
  /* legacy: preserved for downstream styles */
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
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
/* Highlight for selected category block */
.highlighted-block {
  outline: 3px solid var(--accent, #f1c40f);
  border-radius: 9px;
  box-shadow: 0 1px 15px 0 #f1c40f29;
  background: #fffbe3;
}
</style>
