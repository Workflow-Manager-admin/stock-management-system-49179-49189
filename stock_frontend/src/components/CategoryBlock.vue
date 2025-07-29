<script setup lang="ts">
import ProductCard from './ProductCard.vue';
import { defineProps } from 'vue';
import type { ComponentPublicInstance } from 'vue';

// PUBLIC_INTERFACE
/**
 * CategoryBlock component: renders a single product category section with header,
 * divider, product list and empty fallback. Handles highlighting and accessibility.
 */
interface Category {
  id: number;
  name: string;
}
interface Product {
  id: number;
  name: string;
  category_id: number;
  image_url: string;
  quantity: number;
}

const props = defineProps<{
  category: Category;
  products: Product[];
  highlighted: boolean;
  setCategoryRef: (el: Element | ComponentPublicInstance | null) => void;
}>();
</script>

<template>
  <section
    class="category-block"
    :ref="props.setCategoryRef"
    :tabindex="-1"
    :aria-label="`Products in ${props.category.name}`"
  >
    <h2
      class="cat-title"
      :id="`category-section-${props.category.id}`"
      :class="{ highlighted: props.highlighted }"
    >
      <span>{{ props.category.name }}</span>
      <div class="cat-divider" />
    </h2>
    <div class="product-list">
      <ProductCard
        v-for="product in props.products"
        :key="product.id"
        :product="product"
      />
      <div v-if="props.products.length === 0" class="no-products" role="status">
        <span class="no-products-icon">📦</span>
        <p>No products in this category yet!</p>
        <span class="no-products-hint">Products added to this category will appear here.</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.35rem 2rem;
  margin-top: 0.13rem;
}
.no-products {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 15px;
  background: #fffbe3;
  margin: 1rem auto;
  width: 100%;
  border: 2px dashed var(--accent);
}

.no-products-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.no-products p {
  font-size: 1.1rem;
  color: var(--text-main);
  margin: 0.5rem 0;
  font-weight: 500;
}

.no-products-hint {
  display: block;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  font-style: italic;
}
@media (max-width: 860px) {
  .category-block {
    margin-bottom: 2.2rem;
  }
}
</style>
