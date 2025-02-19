<script setup lang="ts">
import { ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import SearchIcon from "./icons/SearchIcon.vue";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  (e: "search", query: string): void;
  (e: "update:modelValue", value: string): void;
}>();

const searchQuery = ref(props.modelValue);

const debouncedSearch = useDebounceFn((query: string) => {
  emit("search", query);
}, 5000);

const handleInput = () => {
    emit("update:modelValue", searchQuery.value);
  debouncedSearch(searchQuery.value);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    emit("search", searchQuery.value);
  }
};
</script>

<template>
  <div class="search-section">
    <div class="search-container">
      <SearchIcon />
      <input
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @keydown.enter="handleKeyDown"
        placeholder="Search for photo"
        class="search-input"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-section {
  position: relative;
  height: var(--search-height);
  margin-bottom: 40px;
}

.search-container {
  position: relative;
  max-width: 80%;
  margin: 0 auto;
  max-width: 65%;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 2px 35px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  padding: 25px 20px;
  border: none;
  border-radius: 4px;
  background: white;
  font-size: 1.1rem;
  color: black;
  transition: box-shadow var(--transition-duration);

  &:focus {
    outline: none;
  }
}
</style>