import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// PUBLIC_INTERFACE
/**
 * Counter store: tracks count and a derived doubleCount value.
 */
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment(): void {
    count.value++;
  }

  return { count, doubleCount, increment };
});
