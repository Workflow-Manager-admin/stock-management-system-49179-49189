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
  <div class="product-card">
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
  background: #fffbe6;
  border: 2.5px solid #2ecc71;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0.85rem 1.2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px #a3e4d744;
  min-width: 220px;
  max-width: 350px;
  min-height: 110px;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, Arial, sans-serif;
  transition: transform 0.13s;
}
.product-card:hover {
  transform: scale(1.04);
  border-color: #f1c40f;
  box-shadow: 0 7px 20px #fceabb7a;
}
.product-img {
  width: 68px;
  height: 68px;
  border-radius: 10px;
  object-fit: cover;
  background: #f1c40f11;
  margin-right: 1rem;
  border: 2px solid #f1c40f;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-info h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.15rem;
  color: #315580;
  font-weight: 700;
  text-shadow: 1px 1px 0 #ffe;
  letter-spacing: 1px;
}
.qty-badge {
  background: #f1c40f;
  color: #fff;
  border-radius: 9px;
  padding: 0.25em 0.75em;
  font-size: 1rem;
  margin-top: 0.24rem;
  width: fit-content;
  font-weight: 600;
}
</style>
