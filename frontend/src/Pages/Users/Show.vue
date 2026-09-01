<script setup lang="ts">
defineProps<{
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  notFound?: boolean;
}>();
</script>

<template>
  <div>
    <template v-if="user">
      <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
      <dl class="mt-4 grid gap-4 sm:grid-cols-3">
        <div class="rounded-lg bg-white p-6 shadow">
          <dt class="text-sm font-medium text-gray-500">ID</dt>
          <dd class="mt-2 text-lg font-bold text-gray-900">{{ user.id }}</dd>
        </div>
        <div class="rounded-lg bg-white p-6 shadow">
          <dt class="text-sm font-medium text-gray-500">Email</dt>
          <dd class="mt-2 text-lg font-bold text-gray-900">{{ user.email }}</dd>
        </div>
        <div class="rounded-lg bg-white p-6 shadow">
          <dt class="text-sm font-medium text-gray-500">Role</dt>
          <dd class="mt-2 text-lg font-bold text-gray-900">{{ user.role }}</dd>
        </div>
      </dl>
    </template>

    <div v-else>
      <h2 class="text-2xl font-bold text-gray-900">User Tidak Ditemukan</h2>
      <p class="mt-1 text-sm text-gray-600">
        Data user yang anda cari tidak tersedia.
      </p>
    </div>
  </div>
</template>