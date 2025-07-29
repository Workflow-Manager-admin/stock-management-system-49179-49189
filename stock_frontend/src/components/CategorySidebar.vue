<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Category {
  id: number
  name: string
}

defineProps<{
  categories: Category[]
  selectedCategoryId: number | null
}>()

const emits = defineEmits(['select'])

function handleSelect(id: number) {
  emits('select', id)
}
</script>

<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">Categories</h2>
    <ul>
      <li
        v-for="category in categories"
        :key="category.id"
        :class="['category-item', { active: selectedCategoryId === category.id }]"
        @click="handleSelect(category.id)"
        tabindex="0"
      >
        {{ category.name }}
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  background: #3498db;
  padding: 1rem 0.5rem 1rem 0.5rem;
  border-radius: 14px;
  min-width: 170px;
  max-width: 190px;
  color: #fff;
  margin-right: 2rem;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, Arial, sans-serif;
  box-shadow: 2px 2px 12px #cce6ff44;
}
.sidebar-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  color: #fffbea;
  text-align: center;
  letter-spacing: 1px;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.category-item {
  cursor: pointer;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  margin-bottom: 0.5rem;
  background: #2980b9;
  transition: 0.2s;
  outline: none;
  font-size: 1.04rem;
  text-align: left;
}
.category-item.active, .category-item:hover, .category-item:focus {
  background: #f1c40f;
  color: #205889;
  font-weight: bold;
  border: 2px solid #fff3;
  box-shadow: 0 0 0 2px #f9e79f85;
}
</style>
