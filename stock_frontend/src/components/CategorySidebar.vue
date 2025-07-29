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
  background: #fff;
  padding: 1.3rem 0.7rem 1.3rem 0.7rem;
  border-radius: var(--card-radius);
  min-width: 175px;
  max-width: 220px;
  color: var(--text-main);
  margin-right: 2rem;
  font-family: inherit;
  box-shadow: var(--card-shadow);
  border: 1.4px solid #e7eafd;
  align-self: flex-start;
}
.sidebar-title {
  font-size: 1.14rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--primary);
  text-align: center;
  letter-spacing: 0.5px;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.category-item {
  cursor: pointer;
  border-radius: 10px;
  padding: 0.64rem 1.15rem;
  margin-bottom: 0.5rem;
  background: none;
  border: none;
  transition: background 0.14s, color 0.14s;
  outline: none;
  font-size: 1.02rem;
  text-align: left;
  color: var(--text-main);
  font-weight: 500;
}
.category-item.active, .category-item:hover, .category-item:focus {
  background: var(--accent);
  color: #205889;
  font-weight: 700;
}
</style>
