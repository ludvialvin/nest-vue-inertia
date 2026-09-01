<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
  title: string;
  user: {
    name: string;
    email: string;
    role?: string;
  };
}>();

const stats = [
  { label: 'Total Pengguna', value: '128', trend: '+12%', trendUp: true },
  { label: 'Order Hari Ini', value: '42', trend: '+8%', trendUp: true },
  { label: 'Pendapatan Bulan Ini', value: 'Rp 3,2 jt', trend: '-2%', trendUp: false },
];

const profiles = [
  { id: 1, name: 'Budi Santoso', role: 'Admin' },
  { id: 2, name: 'Siti Aminah', role: 'Editor' },
  { id: 99, name: 'Tidak ada', role: '—' },
];
</script>

<template>
  <div>
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-bold tracking-tight text-slate-900">{{ title }}</h2>
      <p class="text-sm text-slate-500">
        Selamat datang kembali,
        <span class="font-semibold text-brand-700">{{ user.name }}</span> ({{
          user.email
        }}) — role <span class="font-semibold text-brand-700 capitalize">{{ user.role }}</span>.
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
          <p class="text-3xl font-bold tracking-tight text-slate-900">{{ s.value }}</p>
          <span
            class="rounded-full px-2 py-1 text-xs font-semibold"
            :class="s.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
          >
            {{ s.trend }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 class="text-lg font-semibold text-slate-900">Contoh Dynamic Route</h3>
      <p class="mt-1 text-sm text-slate-500">
        Klik salah satu profil untuk membuka halaman
        <code class="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-700"
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
                <p class="text-xs text-slate-500">{{ p.role }}</p>
              </div>
            </div>
            <span class="text-xs font-medium text-brand-600">/users/{{ p.id }} →</span>
          </Link>
        </li>
      </ul>
    </div>
  </div>
</template>