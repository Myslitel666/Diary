import { writable } from 'svelte/store';

// Хранилище для записей
export const entries = writable([]);

// Хранилище для деталей
export const details = writable([]);