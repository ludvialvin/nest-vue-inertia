<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
</script>

<template>
  <div class="py-16 text-center">
    <p class="text-6xl font-bold text-gray-300">404</p>
    <h2 class="mt-4 text-2xl font-bold text-gray-900">
      Halaman Tidak Ditemukan
    </h2>
    <p class="mt-2 text-sm text-gray-600">
      Halaman yang anda cari tidak tersedia atau telah dipindahkan.
    </p>
    <Link
      href="/"
      class="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      Kembali ke Dashboard
    </Link>
  </div>
</template>