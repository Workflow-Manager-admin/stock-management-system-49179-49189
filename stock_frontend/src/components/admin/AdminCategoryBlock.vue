<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

/**
 * Category + products block for admin section.
 * visually grouped, shows products in cards, with prominent CRUD controls.
 */
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

const props = defineProps<{
  category: Category
  products: Product[]
}>()

const emit = defineEmits<{
  (e: 'add-product', categoryId: number): void
  (e: 'edit-category', category: Category): void
  (e: 'delete-category', category: Category): void

  (e: 'edit-product', product: Product, category: Category): void
  (e: 'delete-product', product: Product, category: Category): void
}>()
</script>

<template>
  <section class="admin-category-block">
    <div class="cat-header-row">
      <div class="cat-title">
        <span>{{ props.category.name }}</span>
        <div class="cat-divider" />
      </div>
      <div class="cat-actions">
        <!-- Category controls use icons and tooltips -->
        <button
          class="icon-btn"
          @click="() => emit('edit-category', props.category)"
          aria-label="Edit category"
          title="Edit category"
        >
          ✏️
        </button>
        <button
          class="icon-btn danger"
          @click="() => emit('delete-category', props.category)"
          aria-label="Delete category"
          title="Delete category"
        >
          🗑️
        </button>
        <button
          class="icon-btn success"
          @click="() => emit('add-product', props.category.id)"
          aria-label="Add product"
          title="Add product to category"
        >
          ➕
        </button>
      </div>
    </div>
    <div class="admin-product-list">
      <template v-if="props.products.length > 0">
        <div
          v-for="product in props.products"
          :key="product.id"
          class="admin-product-card-row"
        >
          <ProductCard :product="product" />
          <div class="prod-actions">
            <button
              class="icon-btn"
              @click="() => emit('edit-product', product, props.category)"
              aria-label="Edit product"
              title="Edit product"
            >
              ✏️
            </button>
            <button
              class="icon-btn danger"
              @click="() => emit('delete-product', product, props.category)"
              aria-label="Delete product"
              title="Delete product"
            >
              🗑️
            </button>
          </div>
        </div>
      </template>
      <div v-else class="admin-no-products" role="status">
        <span class="no-products-icon">📦</span>
        <p>No products in this category yet!</p>
        <span class="no-products-hint"
          >Use the ➕ button above to add a new product.</span
        >
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-category-block {
  margin-bottom: 2.6rem;
  background: #fff;
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  padding: 1.0em 1.5em 1.35em 1.25em;
  border: 1.7px solid #ffe58f48;
}

.cat-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5em;
  gap: 0.5em;
}

.cat-title {
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 1.21rem;
  color: var(--primary);
  background: #f9fafb;
  border-radius: 13px;
  min-height: 2.67em;
  padding: 0.48em 1.1em 0.48em 0.95em;
  box-shadow: 0 2px 9px 0 #fae36c1a;
  letter-spacing: 0.018em;
  font-family: inherit;
}
.cat-title span {
  padding-right: 1.10em;
  font-size: 1.09em;
  font-weight: 700;
  color: #2b4363;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 0 #fff47e18;
}
.cat-divider {
  flex: 1;
  border-top: 2px dotted var(--accent);
  margin-left: 1.16em;
  margin-bottom: 0.09em;
  height: 0;
  opacity: 0.73;
}

.cat-actions {
  display: flex;
  align-items: center;
  gap: 0.25em;
  flex-shrink: 0;
  margin-left: 1.3em;
}
.icon-btn {
  background: var(--surface);
  border: 1.5px solid #e2e5f7;
  border-radius: 11px;
  font-size: 1.22rem;
  padding: 0.21em 0.55em;
  margin-left: 0.1em;
  margin-right: 0.02em;
  cursor: pointer;
  transition: background 0.13s, border 0.13s, color 0.12s;
  box-shadow: 0 1.3px 7px #f8e00e19;
  color: var(--primary);
  line-height: 1.3;
}
.icon-btn:hover,
.icon-btn:focus-visible {
  background: var(--accent);
  color: var(--primary);
  border-color: var(--accent);
  outline: 2px solid var(--primary);
}
.icon-btn.danger {
  background: var(--danger, #ef5350);
  color: #fff;
  border-color: var(--danger, #ef5350);
}
.icon-btn.danger:hover,
.icon-btn.danger:focus-visible {
  background: #fff;
  color: var(--danger, #ef5350);
  border-color: var(--danger, #ef5350);
  outline: 2px solid var(--danger, #ef5350);
}
.icon-btn.success {
  background: var(--secondary, #2ecc71);
  color: #fff;
  border-color: var(--secondary, #2ecc71);
}
.icon-btn.success:hover,
.icon-btn.success:focus-visible {
  background: #fff;
  color: var(--secondary, #2ecc71);
  border-color: var(--secondary, #2ecc71);
}

.admin-product-list {
  display: flex;
  flex-direction: column;
  gap: 1.09rem;
}

.admin-product-card-row {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  margin-bottom: 0.5rem;
}
.prod-actions {
  display: flex;
  gap: 0.18em;
}

.admin-no-products {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 15px;
  background: #fffbe3;
  border: 2px dashed var(--accent);
  margin: 1.0em auto 0.1em auto;
  width: 97%;
}
.no-products-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}
.admin-no-products p {
  font-size: 1.08rem;
  color: var(--text-main);
  margin: 0.4rem 0 0.09em 0;
  font-weight: 500;
}
.no-products-hint {
  display: block;
  font-size: 0.92rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  font-style: italic;
}
@media (max-width: 860px) {
  .admin-category-block {
    margin-bottom: 1.6rem;
    padding: 0.7em 0.5em 0.8em 0.4em;
  }
  .admin-product-list {
    gap: 0.5rem;
  }
  .cat-header-row {
    flex-direction: column;
    gap: 0.18em;
    align-items: flex-start;
  }
}
</style>
