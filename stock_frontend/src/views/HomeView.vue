<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CategorySidebar from '../components/CategorySidebar.vue'
import ProductCard from '../components/ProductCard.vue'

interface Category {
  id: number
  name: string
}
interface Product {
  id: number
  name: string
  category_id: number
  image_url: string
  quantity: number
}

// API endpoint origins
const API_BASE = 'https://vscode-internal-6-beta.beta01.cloud.kavia.ai:3001'

// State
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const errorMsg = ref<string>('')
const loading = ref(false)
const selectedCategoryId = ref<number | null>(null)

// Fetch categories and products from API
async function fetchCategories() {
  try {
    const resp = await fetch(`${API_BASE}/categories`)
    if (!resp.ok) throw new Error('Failed to load categories')
    categories.value = await resp.json()
    // Default select first category
    if (categories.value.length > 0) selectedCategoryId.value = categories.value[0].id
  } catch (e: unknown) {
    if (e instanceof Error) {
      errorMsg.value = e.message
    } else {
      errorMsg.value = 'Something went wrong loading categories.'
    }
  }
}
async function fetchProducts() {
  try {
    const resp = await fetch(`${API_BASE}/products`)
    if (!resp.ok) throw new Error('Failed to load products')
    products.value = await resp.json()
  } catch (e: unknown) {
    if (e instanceof Error) {
      errorMsg.value = e.message
    } else {
      errorMsg.value = 'Something went wrong loading products.'
    }
  }
}

onMounted(async () => {
  loading.value = true
  errorMsg.value = ''
  await Promise.all([fetchCategories(), fetchProducts()])
  loading.value = false
})

function handleSelectCategory(id: number) {
  selectedCategoryId.value = id
}

// Group products by category id
const productsByCategory = computed(() => {
  const map: Record<number, Product[]> = {}
  products.value.forEach(p => {
    if (!map[p.category_id]) map[p.category_id] = []
    map[p.category_id].push(p)
  })
  return map
})
</script>

<template>
  <main class="container">
    <CategorySidebar
      :categories="categories"
      :selectedCategoryId="selectedCategoryId"
      @select="handleSelectCategory"
    />

    <section class="product-section">
      <template v-if="loading">
        <p class="loading">Loading...</p>
      </template>
      <template v-else-if="errorMsg">
        <div class="error-box">
          <strong>Oops!</strong>
          <div>{{ errorMsg }}</div>
        </div>
      </template>
      <template v-else>
        <template v-for="category in categories" :key="category.id">
          <div v-if="selectedCategoryId === category.id">
            <h2 class="cat-title">
              <span>{{ category.name }}</span>
              <div class="cat-divider" />
            </h2>
            <div class="product-list">
              <ProductCard
                v-for="product in productsByCategory[category.id] || []"
                :key="product.id"
                :product="product"
              />
              <div v-if="(productsByCategory[category.id] || []).length === 0" class="no-products">
                No products in this category yet!
              </div>
            </div>
          </div>
        </template>
      </template>
    </section>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  min-height: 420px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;
}
.product-section {
  flex: 1;
  background: #fff;
  border-radius: var(--card-radius);
  margin-left: 0;
  padding: 2.1rem 1.7rem 1.2rem 1.2rem;
  box-shadow: var(--card-shadow);
  font-family: inherit;
  overflow-x: auto;
  min-width: 0;
  border: 1.2px solid #e7eafd;
}

.loading {
  color: var(--secondary);
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  margin-top: 2rem;
  letter-spacing: 0.015em;
}
.error-box {
  background: #ffebee;
  color: #af2a2a;
  border: 1.5px solid var(--danger);
  padding: 1.1em 1.4em;
  border-radius: 13px;
  font-size: 1.1rem;
  margin-top: 1.2em;
  font-weight: 600;
  text-align: left;
}

.cat-title {
  margin: 1.1rem 0 0.2rem 0;
  font-size: 1.09rem;
  color: var(--primary);
  display: flex;
  align-items: center;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.cat-divider {
  flex: 1;
  border-top: 2.5px dashed var(--accent);
  margin-left: 1rem;
  margin-bottom: 0.1rem;
  height: 0;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.35rem 2rem;
}

.no-products {
  font-size: 1.05rem;
  color: #888;
  padding: 0.7rem 0.5rem 1rem 0.5rem;
  border-radius: 10px;
  background: #fffbe3;
  margin-top: 1rem;
  font-weight: 400;
}
@media (max-width: 860px) {
  .container {
    flex-direction: column;
    align-items: stretch;
  }
  .product-section {
    padding: 1.12rem 0.6rem;
    margin-top: 1.4rem;
  }
}
</style>
