<script setup lang="ts">
import { defineProps } from 'vue'

interface Product {
  id: number
  name: string
  image_url: string
  quantity: number
}

defineProps<{
  product: Product
}>()
</script>

<template>
  <div class="product-card card">
    <img :src="product.image_url" :alt="product.name" class="product-img" />
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <div class="qty-badge">
        <strong>Qty:</strong> {{ product.quantity }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  align-items: center;
  min-width: 220px;
  max-width: 350px;
  min-height: 100px;
  gap: 1.2rem;
  border: 1.4px solid #e6e9f9;
  transition: box-shadow 0.18s, border-color 0.16s;
}
.product-card:hover {
  box-shadow: var(--card-shadow-alt);
  border-color: var(--accent);
}
.product-img {
  width: 62px;
  height: 62px;
  border-radius: 9px;
  object-fit: cover;
  background: #eeeaa266;
  margin-right: 0.2rem;
  border: 1.5px solid var(--accent);
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-info h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.09rem;
  color: var(--text-main);
  font-weight: 700;
  letter-spacing: 0.5px;
}
.qty-badge {
  background: var(--secondary);
  color: #fff;
  border-radius: 8px;
  padding: 0.20em 0.85em;
  font-size: 1rem;
  margin-top: 0.24rem;
  width: fit-content;
  font-weight: 600;
}
</style>
