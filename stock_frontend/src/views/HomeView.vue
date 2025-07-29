<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import CategorySidebar from '../components/CategorySidebar.vue';
import ProductCard from '../components/ProductCard.vue';
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
 * @constant
 */
const API_BASE = 'https://vscode-internal-6-beta.beta01.cloud.kavia.ai:3001';

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
      <template v-else>
        <template v-for="category in categories" :key="category.id">
          <section
            class="category-block"
            :ref="setCategoryRef(category.id)"
            :tabindex="-1"
            :aria-label="`Products in ${category.name}`"
          >
            <h2
              class="cat-title"
              :id="`category-section-${category.id}`"
              :class="{ highlighted: selectedCategoryId === category.id }"
            >
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
          </section>
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
  overflow-y: auto;
  min-width: 0;
  border: 1.2px solid #e7eafd;
  /* Set vertical scroll if content exceeds parent */
  max-height: 78vh;
  scroll-behavior: smooth;
}
/* Ensure longer content gets a vertical scrollbar if needed */
.all-categories-scroll {
  overflow-y: auto;
  max-height: 78vh;
}
/* Style for separating sections */
.category-block {
  margin-bottom: 2.2rem;
  outline: none;
}
/* Optional: highlight on scroll/focus for accessibility */
.cat-title.highlighted {
  outline: 3px solid var(--accent);
  border-radius: 7px;
  background: #fffde6;
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
  margin: 1.55rem 0 0.7rem 0;
  font-size: 1.22rem;
  color: var(--primary);
  display: flex;
  align-items: center;
  font-family: inherit;
  font-weight: 800;
  letter-spacing: 0.026em;
  scroll-margin-top: 2.2em;
  transition: background 0.2s;
  background: #f9fafb;
  border-radius: 14px;
  min-height: 3.2em;
  padding: 0.70rem 1.5rem 0.60rem 1.3rem;
  box-shadow: 0 2px 11px 0 #f4d6641e;
  border: 1.7px solid #ffe58f48;
  /* New: extra margin below heading for product spacing */
  margin-bottom: 0.95rem;
}
.cat-title span {
  padding-right: 1.35em;
  font-size: 1.11em;
  font-weight: 700;
  color: #2b4363;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 0 #fff47e2d;
}
.cat-divider {
  flex: 1;
  border-top: 2px dotted var(--accent);
  margin-left: 1.3rem;
  margin-bottom: 0.12rem;
  height: 0;
  opacity: 0.65;
}

/* Optionally add a top margin to product-list for even more gap */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.35rem 2rem;
  margin-top: 0.13rem;
}

.no-products {
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
    max-height: 62vh;
  }
}
</style>

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
  /* Add spacing below for product separation */
  margin-bottom: 0.85rem;
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
