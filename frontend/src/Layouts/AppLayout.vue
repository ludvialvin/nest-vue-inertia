<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { NavigationMenuItem } from '@nuxt/ui';

interface PageUser {
  id?: number;
  email?: string;
  name?: string;
  role?: string;
}

const page = usePage();
const user = computed<PageUser | null>(
  () => (page.props.user as PageUser) ?? null,
);
const initial = computed(() =>
  user.value?.name ? user.value.name.charAt(0).toUpperCase() : '?',
);

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Dashboard',
    to: '/',
    icon: 'i-lucide-layout-dashboard',
    active: page.url === '/',
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
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col">
      <UHeader title="NestJS Suite">
        <template #title>
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-md"
            >
              N
            </div>
            <div class="leading-tight">
              <p class="text-base font-bold tracking-tight">NestJS Suite</p>
              <p class="text-[11px] font-medium text-muted">
                Corporate Dashboard
              </p>
            </div>
          </div>
        </template>

        <UNavigationMenu :items="navItems" />

        <template #right>
          <div v-if="user" class="hidden items-center gap-2.5 md:flex">
            <UAvatar :text="initial" :alt="user.name" size="sm" />
            <div class="leading-tight">
              <p class="text-sm font-semibold">{{ user.name }}</p>
              <p class="text-[11px] font-medium text-muted">
                {{ user.email }}
              </p>
            </div>
          </div>

          <a
            v-if="user"
            color="neutral"
            variant="soft"
            icon="i-lucide-log-out"
            href="/auth/sso-logout"
          >
            Keluar
          </a>
        </template>

        <template #body>
          <UNavigationMenu
            :items="navItems"
            orientation="vertical"
            class="-mx-2.5"
          />
        </template>
      </UHeader>

      <UMain class="mx-auto w-full w-[95%] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <slot />
      </UMain>

      <UFooter>
        <template #left>
          <p class="text-muted text-sm">
            Copyright © {{ new Date().getFullYear() }} NestJS Suite
          </p>
        </template>

        <UNavigationMenu :items="footerItems" variant="link" />

        <template #right>
          <UColorModeButton />

          <UButton
            icon="i-simple-icons:github"
            color="neutral"
            variant="ghost"
            to="https://github.com/nuxt/ui"
            target="_blank"
            aria-label="GitHub"
          />
        </template>
      </UFooter>
    </div>
  </UApp>
</template>
