<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
  title: string;
  user?: {
    id: number;
    email?: string;
    name?: string;
    role?: string;
    department?: string;
  };
}>();

const stats = [
  { label: 'Total Pengguna', value: '128', trend: '+12%', trendUp: true },
  { label: 'Order Hari Ini', value: '42', trend: '+8%', trendUp: true },
  {
    label: 'Pendapatan Bulan Ini',
    value: 'Rp 3,2 jt',
    trend: '-2%',
    trendUp: false,
  },
];

const profiles = [
  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'Admin' },
  { id: 2, name: 'Siti Aminah', email: 'siti@example.com', role: 'Editor' },
  { id: 99, name: 'Tidak ada', email: '—', role: '—' },
];
</script>

<template>
  <div>
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-bold tracking-tight text-slate-900">
        {{ title }}
      </h2>
      <p class="text-sm text-slate-500">
        Selamat datang kembali,
        <span class="font-semibold text-brand-700">{{ user?.name }}</span>
        <span v-if="user?.department" class="text-slate-400">
          · {{ user.department }}
        </span>
      </p>
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-3">
      <div
        v-for="s in stats"
        :key="s.label"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p class="text-sm font-medium text-slate-500">{{ s.label }}</p>
        <div class="mt-2 flex items-end justify-between">
          <p class="text-3xl font-bold tracking-tight text-slate-900">
            {{ s.value }}
          </p>
          <span
            class="rounded-full px-2 py-1 text-xs font-semibold"
            :class="
              s.trendUp
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            "
          >
            {{ s.trend }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 class="text-lg font-semibold text-slate-900">
        Profil & Dynamic Route
      </h3>
      <p class="mt-1 text-sm text-slate-500">
        Klik salah satu profil untuk membuka halaman
        <code
          class="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-700"
          >/users/:id</code
        >.
      </p>
      <ul class="mt-4 divide-y divide-slate-100">
        <li v-for="p in profiles" :key="p.id">
          <Link
            :href="`/users/${p.id}`"
            class="flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-brand-50"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white"
              >
                {{ p.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ p.name }}</p>
                <p class="text-xs text-slate-500">{{ p.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
              >
                {{ p.role }}
              </span>
              <span class="text-xs font-medium text-brand-600"
                >/users/{{ p.id }} →</span
              >
            </div>
          </Link>
        </li>
      </ul>
    </div>
  </div>
</template>
