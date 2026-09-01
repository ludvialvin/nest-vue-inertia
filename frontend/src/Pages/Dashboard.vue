<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
  title: string;
  user: {
    name: string;
    email: string;
  };
}>();
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
    <p class="mt-1 text-sm text-gray-600">
      Selamat datang di dashboard. Anda masuk sebagai
      <span class="font-medium text-gray-900">{{ user.name }}</span>
      ({{ user.email }}).
    </p>

    <div class="mt-6 grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg bg-white p-6 shadow">
        <p class="text-sm font-medium text-gray-500">Total Pengguna</p>
        <p class="mt-2 text-3xl font-bold text-gray-900">128</p>
      </div>
      <div class="rounded-lg bg-white p-6 shadow">
        <p class="text-sm font-medium text-gray-500">Order Hari Ini</p>
        <p class="mt-2 text-3xl font-bold text-gray-900">42</p>
      </div>
      <div class="rounded-lg bg-white p-6 shadow">
        <p class="text-sm font-medium text-gray-500">Pendapatan</p>
        <p class="mt-2 text-3xl font-bold text-gray-900">Rp 3.2jt</p>
      </div>
    </div>

    <div class="mt-10">
      <h3 class="text-lg font-semibold text-gray-900">Contoh Dynamic Route</h3>
      <p class="mt-1 text-sm text-gray-600">
        Klik salah satu user untuk membuka halaman dynamic route
        <code class="rounded bg-gray-200 px-1 py-0.5 text-xs">/users/:id</code>.
      </p>
      <ul class="mt-4 space-y-2">
        <li>
          <Link
            href="/users/1"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            /users/1 — Budi Santoso
          </Link>
        </li>
        <li>
          <Link
            href="/users/2"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            /users/2 — Siti Aminah
          </Link>
        </li>
        <li>
          <Link
            href="/users/99"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            /users/99 — not found
          </Link>
        </li>
      </ul>
    </div>
  </div>
</template>
