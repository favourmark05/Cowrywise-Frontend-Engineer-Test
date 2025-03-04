<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Photo } from "../types";
import DownloadIcon from "./icons/DownloadIcon.vue";
import LoaderIcon from "./icons/LoaderIcon.vue";

// defineProps<{
//   photo: Photo;
// }>();
const downloading = ref(false);
const props = defineProps<{ photo: Photo }>();
const emit = defineEmits<{
  (e: "close"): void;
}>();
const downloadImage = async () => {
  downloading.value = true;
  try {
    const response = await fetch(props.photo.urls.full);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.photo.user.name.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    downloading.value = false;
  } catch (error) {
    console.error("Error downloading the image:", error);
    downloading.value = false;
  }
};
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close");
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "auto";
});
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <p class="close-button" @click="emit('close')">&times;</p>
    <div class="modal-container" @click.stop>
      <div class="image-wrapper">
        <img :src="photo.urls.full" :alt="photo.alt_description" />
      </div>

      <div class="modal-info">
        <div>
          <h2>{{ photo.user.name }}</h2>
          <p>{{ photo.user?.location || "Unknown Location" }}</p>
        </div>
        <DownloadIcon @click.prevent="downloadImage" v-if="downloading == false"/>
        <LoaderIcon v-else/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 900px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-in-out forwards;
}

.image-wrapper {
  width: 100%;
  max-height: 600px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    z-index: 1;
    transition: transform 0.3s ease-in-out;
    object-fit: fill;
    object-position: center;
  }

  img:hover {
    transform: scale(1.05);
  }
}

.modal-info {
  padding: 20px 45px;
  text-align: left;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: -20px;
  }

  p {
    font-size: 1rem;
    color: #666;
  }
}

.close-button {
  position: absolute;
  top: 40px;
  right: 20%;
  background: none;
  border: none;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  z-index: 1000;

  @media (max-width: 768px) {
    right: 10%;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}
</style>
