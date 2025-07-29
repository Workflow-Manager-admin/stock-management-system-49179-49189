<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/services/adminApi'
import type { Category, Product } from '@/services/adminApi'
import BaseModal from '@/components/ui/BaseModal.vue'
import CategoryForm from '@/components/admin/CategoryForm.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

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

// Load data
async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const [categoriesData, productsData] = await Promise.all([
      fetch('https://vscode-internal-6-beta.beta01.cloud.kavia.ai:3001/categories').then(r => r.json()),
      fetch('https://vscode-internal-6-beta.beta01.cloud.kavia.ai:3001/products').then(r => r.json())
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

// Category CRUD
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
  if (!confirm(`Delete category "${category.name}"?`)) return
  
  try {
    await adminApi.deleteCategory(category.id)
    await loadData()
  } catch (err) {
    console.error('Delete category error:', err)
    error.value = 'Failed to delete category. Please try again.'
  }
}

// Product CRUD
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
  }
}

async function deleteProduct(product: Product) {
  if (!confirm(`Delete product "${product.name}"?`)) return
  
  try {
    await adminApi.deleteProduct(product.id)
    await loadData()
  } catch (err) {
    console.error('Delete product error:', err)
    error.value = 'Failed to delete product. Please try again.'
  }
}

function openCategoryModal(category?: Category) {
  editingCategory.value = category || null
  showCategoryModal.value = true
}

function openProductModal(product?: Product) {
  editingProduct.value = product || null
  showProductModal.value = true
}
</script>

<template>
  <div class="admin-dashboard">
    <div v-if="loading" class="loading">Loading...</div>
    <ErrorAlert v-else-if="error" :message="error" />
    
    <template v-else>
      <!-- Categories Section -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>Categories</h2>
          <button @click="openCategoryModal()" class="add-btn">
            Add Category
          </button>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category.id">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>
                  <button
                    @click="openCategoryModal(category)"
                    class="action-btn edit"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteCategory(category)"
                    class="action-btn delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Products Section -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>Products</h2>
          <button @click="openProductModal()" class="add-btn">
            Add Product
          </button>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>
                  {{ categories.find(c => c.id === product.category_id)?.name }}
                </td>
                <td>{{ product.quantity }}</td>
                <td>
                  <button
                    @click="openProductModal(product)"
                    class="action-btn edit"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteProduct(product)"
                    class="action-btn delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

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
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: var(--primary);
}

.add-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  color: var(--text-muted);
  font-weight: 600;
}

.action-btn {
  padding: 0.3rem 0.8rem;
  margin: 0 0.2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.action-btn.edit {
  background: var(--primary);
  color: white;
}

.action-btn.delete {
  background: var(--danger);
  color: white;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .action-btn {
    padding: 0.2rem 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
