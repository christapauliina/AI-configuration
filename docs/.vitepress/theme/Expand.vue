<script setup>
import { ref } from 'vue'

defineProps({
  info: {
    type: String,
    required: true
  }
})

const isExpanded = ref(false)
</script>

<template>
  <span class="inline-expand" :class="{ 'is-active': isExpanded }">
    <button 
      type="button" 
      class="expand-trigger" 
      @click="isExpanded = !isExpanded"
      :aria-expanded="isExpanded"
    >
      <slot />
      <span class="expand-icon">{{ isExpanded ? '✕' : '►' }}</span>
    </button>
    <span v-if="isExpanded" class="expand-content">
      {{ info }}
    </span>
  </span>
</template>

<style scoped>
.inline-expand {
  display: inline-block;
  vertical-align: baseline;
  margin: 6px 0;
}

/* Closed button*/
.expand-trigger {
  background-color: #f1f1f1;
  color: #111111;
  border: 1px solid #d4d4d4;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
  user-select: none;
}

/* Hover */
.expand-trigger:hover {
  background-color: #e5e5e5;
  border-color: #888888;
}

/* Opened button: */
.is-active .expand-trigger {
  background-color: #888888;
  color: #ffffff;
  border-color: #111111;
}

.expand-icon {
  font-size: 0.65em;
  opacity: 0.8;
}

/* Auki oleva selite: erittäin vaalea harmaa pohja, musta reunus vasemmalla */
.expand-content {
  display: inline-block;
  background-color: #f8f8f8;
  color: #1a1a1a;
  padding: 3px 9px;
  margin-left: 6px;
  margin-right: 4px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  border-left: 3px solid #111111;
  font-size: 0.9em;
  font-weight: 400;
}
</style>