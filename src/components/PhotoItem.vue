<script setup lang="ts">
import { computed } from 'vue';
import type { Photo } from '../types';

const props = defineProps<{
  photo: Photo;
  isFirstRow: boolean;
}>();

const emit = defineEmits<{
  (e: 'click', photo: Photo): void;
}>();

const classes = computed(() => ({
  'photo-item': true,
  'first-row': props.isFirstRow
}));
</script>

<template>
  <div 
    :class="classes"
    @click="emit('click', photo)"
  >
    <div class="photo-overlay"></div>
    <img 
      :src="photo.urls.regular" 
      :alt="photo.alt_description"
      loading="lazy"
    />
    <div class="photo-info">
      <h3>{{ photo.user?.name }}</h3>
      <p>{{ photo.user?.location || 'Unknown Location' }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.photo-item {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform var(--transition-duration);

  &.first-row {
    margin-top: -60px;
  }

  &:hover {
    transform: scale(1.02);

    .photo-overlay {
      opacity: 1;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--overlay-color);
  opacity: 0.7;
  transition: opacity var(--transition-duration);
}

.photo-info {
  position: absolute;
  text-align: left;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  color: var(--text-color);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  z-index: 2;

  h3 {
    margin-bottom: -5px;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
}
</style>