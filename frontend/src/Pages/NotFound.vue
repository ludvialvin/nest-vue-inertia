<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
</script>

<template>
  <div class="py-16 text-center">
    <p class="text-6xl font-bold text-brand-200">404</p>
    <h2 class="mt-4 text-2xl font-bold text-slate-900">
      Halaman Tidak Ditemukan
    </h2>
    <p class="mt-2 text-sm text-slate-500">
      Halaman yang anda cari tidak tersedia atau telah dipindahkan.
    </p>
    <Link
      href="/"
      class="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
    >
      Kembali ke Dashboard
    </Link>
  </div>
</template>