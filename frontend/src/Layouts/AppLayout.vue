<script setup lang="ts">
import { useAppStore, menuModeOptions } from '@/stores/app';
import { useNavigation } from '@/composables/useNavigation';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

const store = useAppStore();
const { navItems } = useNavigation();
</script>

<template>
  <UApp>
    <div class="flex min-h-screen bg-background">
      <aside
        v-if="store.menuMode === 'sidebar'"
        class="hidden shrink-0 border-e border-default bg-background lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col"
      >
        <div
          class="flex h-14 items-center gap-2.5 border-b border-default px-4 lg:h-[74px]"
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

        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
          size="sm"
          class="flex-1 overflow-y-auto px-2.5 py-3"
        />

        <div class="border-t border-default p-3">
          <USelect
            v-model="store.menuMode"
            :items="menuModeOptions"
            size="xs"
            aria-label="Tipe menu"
            class="w-full"
          />
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <AppHeader />

        <UMain class="mx-auto w-full w-[95%] flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <slot />
        </UMain>

        <AppFooter />
      </div>
    </div>
  </UApp>
</template>
