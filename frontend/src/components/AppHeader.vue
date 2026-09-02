<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { useNavigation } from '@/composables/useNavigation';

interface PageUser {
  id?: number;
  email?: string;
  name?: string;
  role?: string;
}

const page = usePage();
const store = useAppStore();
const { navItems } = useNavigation();

const user = computed<PageUser | null>(
  () => (page.props.user as PageUser) ?? null,
);
const initial = computed(() =>
  user.value?.name ? user.value.name.charAt(0).toUpperCase() : '?',
);

const dropdownItems = computed(() => [
  ...(user.value
    ? [
        {
          label: user.value.name ?? 'Pengguna',
          description: user.value.email,
          avatar: { text: initial.value },
          disabled: true,
        },
      ]
    : []),
  { type: 'separator' as const },
  { type: 'label' as const, label: 'Tipe menu' },
  {
    label: 'Sidebar',
    icon: 'i-lucide-panel-left',
    onSelect: () => store.setMenuMode('sidebar'),
  },
  {
    label: 'Topbar',
    icon: 'i-lucide-menu',
    onSelect: () => store.setMenuMode('topbar'),
  },
  { type: 'separator' as const },
  {
    label: 'Keluar',
    icon: 'i-lucide-log-out',
    color: 'error',
    to: '/auth/sso-logout',
  },
]);
</script>

<template>
  <UHeader title="NestJS Suite">
    <template #title>
      <div
        v-if="store.menuMode === 'topbar'"
        class="flex items-center gap-2.5"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-md"
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

    <UNavigationMenu
      v-if="store.menuMode === 'topbar'"
      :items="navItems"
      class="hidden lg:flex"
    />

    <template #right>
      <UDropdownMenu :items="dropdownItems">
        <UButton
          color="neutral"
          variant="ghost"
          class="group"
          :aria-label="user?.name ?? 'Menu pengguna'"
        >
          <UAvatar :text="initial" :alt="user?.name ?? 'Pengguna'" size="sm" />
          <span
            class="hidden max-w-40 truncate text-sm font-semibold md:inline"
          >
            {{ user?.name }}
          </span>
          <UIcon
            name="i-lucide-chevron-down"
            class="text-muted transition-transform group-data-[state=open]:rotate-180"
          />
        </UButton>

        <template #item-trailing="{ item }">
          <UIcon
            v-if="
              (item.label === 'Sidebar' && store.menuMode === 'sidebar') ||
              (item.label === 'Topbar' && store.menuMode === 'topbar')
            "
            name="i-lucide-check"
            class="text-primary"
          />
        </template>
      </UDropdownMenu>
    </template>

    <template #body>
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>