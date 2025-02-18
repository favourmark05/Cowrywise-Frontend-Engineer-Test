import axios from 'axios';
import type { Photo } from '../types';

const api = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_API_KEY}`
  }
});

export const searchPhotos = async (query: string): Promise<Photo[]> => {
  const response = await api.get('/search/photos', {
    params: { query, per_page: 20 }
  });
  return response.data.results;
};

export const getPhotos = async (): Promise<Photo[]> => {
  const response = await api.get('/photos', {
    params: { per_page: 20 }
  });
  return response.data;
};