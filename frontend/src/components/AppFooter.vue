<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation';

const { footerItems } = useNavigation();
</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }} NestJS Suite
      </p>
    </template>

    <UNavigationMenu :items="footerItems" variant="link" />

    <template #right>
      <UColorModeButton />

      <UButton
        icon="i-simple-icons:github"
        color="neutral"
        variant="ghost"
        to="https://github.com/nuxt/ui"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>