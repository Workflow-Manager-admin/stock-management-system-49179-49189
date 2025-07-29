<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import CategorySidebar from '../components/CategorySidebar.vue';
import CategoryBlock from '../components/CategoryBlock.vue';
import type { ComponentPublicInstance } from 'vue';


// PUBLIC_INTERFACE

/**
 * Category type for category navigation.
 */
interface Category {
  id: number;
  name: string;
}

/**
 * Product type for display/product list.
 */
interface Product {
  id: number;
  name: string;
  category_id: number;
  image_url: string;
  quantity: number;
}

/**
 * API endpoint base for category and product data.
 * Sourced from the environment variable VUE_APP_BACKEND_BASE_URL
 */
const API_BASE = import.meta.env.VUE_APP_BACKEND_BASE_URL as string;
if (!API_BASE) {
  // Development warning for missing env
  // eslint-disable-next-line no-console
  console.warn('VUE_APP_BACKEND_BASE_URL not set! Check your .env configuration.');
}

// ----- Reactive State -----
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const errorMsg = ref<string>('');
const loading = ref<boolean>(false);
const selectedCategoryId = ref<number | null>(null);

// Reference storage for scrolling/focus to correct category block
type CategorySectionEl = Element | ComponentPublicInstance | null;
const categoryRefs = ref<Record<number, CategorySectionEl>>({});

/**
 * Fetch category data and select first on load (highlight only)
 */
async function fetchCategories(): Promise<void> {
  try {
    const resp = await fetch(`${API_BASE}/categories`);
    if (!resp.ok) throw new Error('Failed to load categories');
    categories.value = await resp.json();
    if (categories.value.length > 0) selectedCategoryId.value = categories.value[0].id;
  } catch (e: unknown) {
    errorMsg.value =
      e instanceof Error ? e.message : 'Something went wrong loading categories.';
  }
}

/**
 * Fetch products data.
 */
async function fetchProducts(): Promise<void> {
  try {
    const resp = await fetch(`${API_BASE}/products`);
    if (!resp.ok) throw new Error('Failed to load products');
    products.value = await resp.json();
  } catch (e: unknown) {
    errorMsg.value =
      e instanceof Error ? e.message : 'Something went wrong loading products.';
  }
}

// One-time data load
onMounted(async () => {
  loading.value = true;
  errorMsg.value = '';
  await Promise.all([fetchCategories(), fetchProducts()]);
  loading.value = false;
});

/**
 * Util: True if given object is a Vue component instance.
 */
function isComponentInstance(obj: unknown): obj is ComponentPublicInstance {
  return !!obj && typeof obj === 'object' && '$el' in obj;
}

/**
 * Get HTMLElement from a ref/value that may be a component or DOM node.
 */
function getDomElement(ref: CategorySectionEl): HTMLElement | null {
  if (!ref) return null;
  if (ref instanceof HTMLElement) return ref;
  if (isComponentInstance(ref) && ref.$el instanceof HTMLElement) return ref.$el;
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
    // Optional focus for accessibility:
    refEl.focus?.({ preventScroll: true });
  }
}

/**
 * Group products by category id (computed for efficient lookup).
 */
const productsByCategory = computed(() => {
  const map: Record<number, Product[]> = {};
  products.value.forEach((p) => {
    if (!map[p.category_id]) map[p.category_id] = [];
    map[p.category_id].push(p);
  });
  return map;
});

/**
 * Returns a ref setter for each category block.
 */
function setCategoryRef(id: number) {
  return (el: CategorySectionEl) => {
    categoryRefs.value[id] = el;
  };
}
</script>

<template>
  <main class="container">
    <CategorySidebar
      :categories="categories"
      :selectedCategoryId="selectedCategoryId"
      @select="handleSelectCategory"
    />

    <section class="product-section all-categories-scroll" aria-label="All product categories, scrollable">
      <template v-if="loading">
        <p class="loading">Loading...</p>
      </template>
      <template v-else-if="errorMsg">
        <div class="error-box" role="alert">
          <strong>Oops!</strong>
          <div>{{ errorMsg }}</div>
        </div>
      </template>
      <template v-else-if="categories.length === 0">
        <div class="empty-state" role="status">
          <span class="empty-state-icon">🏷️</span>
          <h2>No Categories Available</h2>
          <p>There are no product categories to display right now.</p>
          <p class="empty-state-hint">Check back soon for updates!</p>
        </div>
      </template>
      <template v-else>
        <CategoryBlock
          v-for="category in categories"
          :key="category.id"
          :category="category"
          :products="productsByCategory[category.id] || []"
          :highlighted="selectedCategoryId === category.id"
          :setCategoryRef="setCategoryRef(category.id)"
        />
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
  overflow-y: auto;
  min-width: 0;
  border: 1.2px solid #e7eafd;
  max-height: 78vh;
  scroll-behavior: smooth;
}
.all-categories-scroll {
  overflow-y: auto;
  max-height: 78vh;
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
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #fff;
  border-radius: var(--card-radius);
  margin: 1rem auto;
  max-width: 500px;
  border: 2px dashed var(--accent);
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-state h2 {
  color: var(--primary);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-muted);
  margin: 0.5rem 0;
}

.empty-state-hint {
  font-size: 0.9rem;
  opacity: 0.8;
  font-style: italic;
}

@media (max-width: 860px) {
  .container {
    flex-direction: column;
    align-items: stretch;
  }
  .product-section {
    padding: 1.12rem 0.6rem;
    margin-top: 1.4rem;
    max-height: 62vh;
  }
}
</style>
