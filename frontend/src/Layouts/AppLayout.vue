<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

const navItems = [
  { label: 'Dashboard', href: '/' },
];
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-900">NestJS + Inertia</h1>
          <nav class="flex space-x-4">
            <Link
              v-for="item in navItems"
              :key="item.href"
              :href="item.href"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {{ item.label }}
            </Link>
          </nav>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
