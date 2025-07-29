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
  max-width: 340px;
  min-height: 100px;
  gap: 1.2rem;
  border: 2.2px solid #f1c40f25;
  box-shadow: 0 4px 10px #f7d99916;
  border-radius: 18px;
  transition: box-shadow 0.18s, border-color 0.20s;
  background: #fffefb;
}
.product-card:focus-within, .product-card:hover {
  box-shadow: var(--card-shadow-alt);
  border-color: var(--accent);
  outline: 2px solid var(--primary);
}
.product-img {
  width: 66px;
  height: 66px;
  border-radius: 12px;
  object-fit: cover;
  background: #fff9e8;
  margin-right: 0.2rem;
  border: 1.8px solid var(--accent);
  box-shadow: 0 2px 7px #ffe7a233;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-info h3 {
  margin: 0 0 0.34rem 0;
  font-size: 1.13rem;
  color: #28436a;
  font-weight: 700;
  letter-spacing: 0.024em;
  text-shadow: 0 1px 0 #fded8c26;
}
.qty-badge {
  background: linear-gradient(90deg, var(--secondary), #81dd81 95%);
  color: #fff;
  border-radius: 11px;
  padding: 0.26em 1.15em 0.26em 0.90em;
  font-size: 1.04rem;
  margin-top: 0.20rem;
  width: fit-content;
  font-weight: 700;
  box-shadow: 0 1.5px 5px #43c96b26;
  letter-spacing: 0.035em;
}
</style>
