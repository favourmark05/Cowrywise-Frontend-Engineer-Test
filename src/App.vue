<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getPhotos, searchPhotos } from "./api";
import type { Photo } from "./types";
import PhotoItem from "./components/PhotoItem.vue";
import PhotoModal from "./components/PhotoModal.vue";
import SearchBar from "./components/SearchBar.vue";

const photos = ref<Photo[]>([]);
const loading = ref(true);
const selectedPhoto = ref<Photo | null>(null);
const error = ref<string | null>(null);
const searchTerm = ref<string>("");
const showSearchResults = ref(false);

const fetchPhotos = async (query: string = "") => {
  loading.value = true;
  error.value = null;

  try {
    photos.value = query ? await searchPhotos(query) : await getPhotos();
  } catch (e) {
    error.value = "Failed to load photos. Please try again.";
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query: string) => {
  showSearchResults.value = true;
  fetchPhotos(query);
  searchTerm.value = query;
};

const goBack = () => {
  searchTerm.value = "";
  showSearchResults.value = false;
  fetchPhotos();
};


const openModal = (photo: Photo) => {
  selectedPhoto.value = photo;
};

const closeModal = () => {
  selectedPhoto.value = null;
};

onMounted(() => {
  fetchPhotos();
});
</script>

<template>
  <div class="app">
    <div class="backdrop">
      <SearchBar
        v-if="!loading && !showSearchResults"
        v-model="searchTerm"
        @search="handleSearch"
        class="search"
      />
      <div v-if="loading" class="search-result-container">
        <p class="search-result">
          Searching for <span>“{{ searchTerm }}”</span>
        </p>
      </div>
      <div v-if="!loading && photos.length > 0 && showSearchResults" class="search-result-container">
        <p class="search-result ">
          Search Result for <span>“{{ searchTerm }}”</span>
        </p>
        <p class="back-btn" @click="goBack">Clear Search</p>
      </div>
    </div>

    <main>
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <div class="noImage" v-if="!loading && photos.length === 0">
        <h3>No image found</h3>
      </div>

      <div class="photo-grid" :class="{ 'is-loading': loading }">
        <template v-if="loading">
          <div v-for="n in 9" :key="n" class="photo-placeholder" />
        </template>
        <template v-else>
          <PhotoItem
            v-for="(photo, index) in photos"
            class="photo-item"
            :key="photo.id"
            :photo="photo"
            :is-first-row="index < 3"
            @click="openModal"
          />
        </template>
      </div>
    </main>

    <Transition name="fade">
      <PhotoModal
        v-if="selectedPhoto"
        :photo="selectedPhoto"
        @close="closeModal"
      />
    </Transition>
  </div>
</template>


<style lang="scss">
:root {
  --grid-gap: 30px;
  --search-height: 200px;
  --text-color: #ffffff;
  --background-color: #f5f5f5;
  --transition-duration: 0.3s;
  --error-color: #dc3545;
}

.app {
  .backdrop {
    background-color: #dde2e9;
    height: 300px;
    width: 100%;
  }

  .search {
    top: 65%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  .search-result {
    max-width: 80%;
    margin: 0 auto;
    max-width: 65%;
    align-items: center;
    font-size: 50px;
    color: #0a3e73;
    padding: 80px 35px;

    @media (max-width: 668px) {
      font-size: 20px;
    }

  }
  .search-result span {
    color: #6b7280;
    font-weight: normal;
  }

  .search-result-container {
    display: grid;
    grid-template-columns: auto auto;
  }
  .back-btn {
    margin-top: 60px;
    padding: 10px 20px;
    height: 50px;
    width: 125px;
    color: red;
    font-weight: bold;
    cursor: pointer;
  }

  main {
    background-color: white;
    .error {
      color: var(--error-color);
      text-align: center;
      padding: 20px;
      margin: 20px;
      background: rgba(220, 53, 69, 0.1);
      border-radius: 8px;
    }
    .noImage {
      color: var(--error-color);
      text-align: center;
      padding: 20px;
      margin: 20px;
      background: rgba(220, 53, 69, 0.1);
      border-radius: 8px;
    }

    .photo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--grid-gap);
      padding: 0 var(--grid-gap) 50px;
      max-width: 1000px;
      margin: 0 auto;

      &.is-loading {
        .photo-item {
          visibility: hidden;
        }
      }

      .photo-placeholder {
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e0e0e0 50%,
          #f0f0f0 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 8px;
        aspect-ratio: 4/5;
      }
      &:not(.is-loading) {
        .photo-item:nth-child(1),
        .photo-item:nth-child(3) {
          height: 350px;
          width: 100%;
        }

        @media (min-width: 768px) {
          .photo-item:nth-child(n + 4):nth-child(3n + 1),
          .photo-item:nth-child(n + 4):nth-child(3n + 3) {
            margin-top: -50px;
          }
        }
      }

      .photo-item {
        cursor: pointer;
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity var(--transition-duration);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  .photo-item {
    height: auto !important;
    width: 100%;
  }
  .photo-item.first-row {
    margin-top: 0;
  }
}
</style>