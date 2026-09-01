<script lang="ts">
export default { layout: null };
</script>

<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';

const form = useForm({
  email: '',
  password: '',
});

function submit() {
  form.post('/login', {
    onFinish: () => form.reset('password'),
  });
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 text-xl font-bold text-white shadow-lg shadow-brand-900/40"
        >
          N
        </div>
        <h1 class="mt-5 text-2xl font-bold tracking-tight text-white">
          Masuk ke Dashboard
        </h1>
        <p class="mt-1 text-sm text-white/60">
          Gunakan akun perusahaan untuk melanjutkan.
        </p>
      </div>

      <form
        @submit.prevent="submit"
        class="rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8"
      >
        <div v-if="Object.keys(form.errors).length" class="mb-6 space-y-2">
          <p
            v-for="error in form.errors"
            :key="error"
            class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            {{ error }}
          </p>
        </div>

        <div class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              name="email"
              autocomplete="username"
              required
              placeholder="nama@perusahaan.com"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              :class="{ 'border-rose-300': form.errors.email }"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              name="password"
              autocomplete="current-password"
              required
              placeholder="••••••••"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              :class="{ 'border-rose-300': form.errors.password }"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="form.processing"
          class="mt-7 w-full rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ form.processing ? 'Memproses…' : 'Masuk' }}
        </button>
      </form>

      <p class="mt-6 text-center text-xs text-white/50">
        © {{ new Date().getFullYear() }} NestJS Suite. Semua hak dilindungi.
      </p>
    </div>
  </div>
</template>