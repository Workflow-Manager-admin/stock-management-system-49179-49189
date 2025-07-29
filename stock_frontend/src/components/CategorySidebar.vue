<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// PUBLIC_INTERFACE
/**
 * CategorySidebar component: lists categories in a sidebar and emits 'select' on click/keyboard.
 */
interface Category {
  id: number;
  name: string;
}

const props = defineProps<{
  categories: Category[];
  selectedCategoryId: number | null;
}>();

const emit = defineEmits<{
  (e: 'select', id: number): void;
}>();

/**
 * Handle category selection (mouse or keyboard).
 * @param id Category ID to select.
 */
function handleSelect(id: number) {
  emit('select', id);
}
</script>

<template>
  <aside class="sidebar" aria-label="Category navigation">
    <h2 class="sidebar-title">Categories</h2>
    <ul>
      <li
        v-for="category in props.categories"
        :key="category.id"
        :class="['category-item', { active: props.selectedCategoryId === category.id }]"
        @click="handleSelect(category.id)"
        @keydown.enter.space="handleSelect(category.id)"
        tabindex="0"
        :aria-current="props.selectedCategoryId === category.id ? 'true' : undefined"
        :aria-label="`Scroll to category: ${category.name}`"
        role="button"
      >
        {{ category.name }}
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  background: #fff;
  padding: 1.3rem 0.7rem;
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
  border-radius: 18px;
  padding: 0.85rem 1.45rem;
  margin-bottom: 0.75rem;
  background: #fafcff;
  border: 1.5px solid #f1c40f40;
  transition: background 0.16s, color 0.16s, border 0.18s, box-shadow 0.18s;
  outline: none;
  font-size: 1.06rem;
  text-align: left;
  color: var(--text-main);
  font-weight: 500;
  letter-spacing: 0.012em;
  box-shadow: 0 1px 4px #f1c40f15;
}
.category-item.active,
.category-item:hover,
.category-item:focus {
  background: var(--accent);
  color: #224869;
  font-weight: 700;
  box-shadow: 0 2px 10px #fde48c33;
  border-color: var(--accent);
}
</style>
