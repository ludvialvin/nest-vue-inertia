import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { NavigationMenuItem } from '@nuxt/ui';

export function useNavigation() {
  const page = usePage();

  const navItems = computed<NavigationMenuItem[]>(() => [
    {
      label: 'Dashboard',
      to: '/',
      icon: 'i-lucide-layout-dashboard',
      active: page.url === '/',
    },
    {
      label: 'Pengguna',
      to: '/users/1',
      icon: 'i-lucide-users',
      active: page.url.startsWith('/users'),
    },
  ]);

  const footerItems: NavigationMenuItem[] = [
    { label: 'Dashboard', to: '/' },
    {
      label: 'Dokumentasi',
      to: 'https://ui.nuxt.com/docs/getting-started',
      target: '_blank',
    },
    {
      label: 'GitHub',
      to: 'https://github.com/nuxt/ui',
      target: '_blank',
    },
  ];

  return { navItems, footerItems };
}
