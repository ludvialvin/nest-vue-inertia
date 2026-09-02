import { defineStore } from 'pinia';

export type MenuMode = 'sidebar' | 'topbar';

export const menuModeOptions: {
  label: string;
  value: MenuMode;
  icon: string;
}[] = [
  { label: 'Sidebar', value: 'sidebar', icon: 'i-lucide-panel-left' },
  { label: 'Topbar', value: 'topbar', icon: 'i-lucide-menu' },
];

const STORAGE_KEY = 'app.menuMode';

function loadMenuMode(): MenuMode {
  if (typeof window === 'undefined') return 'sidebar';
  return (localStorage.getItem(STORAGE_KEY) as MenuMode) === 'topbar'
    ? 'topbar'
    : 'sidebar';
}

export const useAppStore = defineStore('app', {
  state: () => ({
    menuMode: loadMenuMode(),
  }),
  actions: {
    setMenuMode(mode: MenuMode) {
      this.menuMode = mode;
      localStorage.setItem(STORAGE_KEY, mode);
    },
  },
});
