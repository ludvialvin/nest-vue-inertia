<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

interface PageUser {
  id?: number;
  email?: string;
  name?: string;
  role?: string;
}

const page = usePage();
const user = computed<PageUser | null>(() => (page.props.user as PageUser) ?? null);
const initial = computed(() =>
  user.value?.name ? user.value.name.charAt(0).toUpperCase() : '?',
);
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header
      class="sticky top-0 z-20 border-b border-white/10 bg-brand-950 text-white shadow-lg"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold shadow-md"
            >
              N
            </div>
            <div class="leading-tight">
              <p class="text-base font-bold tracking-tight">NestJS Suite</p>
              <p class="text-[11px] font-medium text-white/60">
                Corporate Dashboard
              </p>
            </div>
          </div>

          <nav class="hidden items-center gap-1 sm:flex">
            <Link
              href="/"
              class="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Dashboard
            </Link>
          </nav>

          <div class="flex items-center gap-3">
            <div v-if="user" class="hidden items-center gap-2 md:flex">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-bold text-white"
              >
                {{ initial }}
              </div>
              <div class="leading-tight">
                <p class="text-sm font-semibold text-white">{{ user.name }}</p>
                <p class="text-[11px] font-medium text-white/60">
                  {{ user.email }}
                </p>
              </div>
            </div>

            <Link
              href="/auth/sso-logout"
              class="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              Keluar
            </Link>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>