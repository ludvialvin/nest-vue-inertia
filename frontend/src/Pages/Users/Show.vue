<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
  user?: {
    id: number;
    email?: string;
    name?: string;
    role?: string;
  };
  profile?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  notFound?: boolean;
}>();

const fields = ['ID', 'Email', 'Role'] as const;
</script>

<template>
  <div>
    <template v-if="profile">
      <div class="flex flex-col gap-1">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">
          {{ profile.name }}
        </h2>
        <p class="text-sm text-slate-500">
          Profil user dengan dynamic route /users/:id.
        </p>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div
          v-for="f in fields"
          :key="f"
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <dt class="text-sm font-medium text-slate-500">{{ f }}</dt>
          <dd class="mt-2 text-lg font-bold text-slate-900">
            <template v-if="f === 'ID'">{{ profile.id }}</template>
            <template v-else-if="f === 'Email'">{{ profile.email }}</template>
            <template v-else>{{ profile.role }}</template>
          </dd>
        </div>
      </div>
    </template>

    <div
      v-else
      class="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
    >
      <p class="text-4xl font-bold text-brand-200">?</p>
      <h2 class="mt-2 text-xl font-bold text-slate-900">
        User Tidak Ditemukan
      </h2>
      <p class="mt-1 text-sm text-slate-500">
        Data user yang anda cari tidak tersedia.
      </p>
    </div>

    <Link
      href="/"
      class="mt-8 inline-flex items-center gap-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
    >
      ← Kembali ke Dashboard
    </Link>
  </div>
</template>