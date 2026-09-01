<script setup lang="ts">
const config = useRuntimeConfig()
const useAftership = computed(() => config.public.useAftership)
</script>

<template>
  <div>
    <header class="app-header">
      <div class="container">
        <div class="app-header__inner">
          <NuxtLink to="/" class="app-logo">
            📦 Paket <span>Dedektifi</span>
          </NuxtLink>
          <p class="app-tagline d-none d-sm-block">Tüm kargolarınız tek yerde</p>
        </div>
      </div>
    </header>

    <main class="container pb-4">
      <NuxtPage />
    </main>

    <footer class="app-footer">
      <div class="app-footer__inner">
        <p class="app-footer__brand">📦 Paket Dedektifi</p>
        <p class="app-footer__meta">
          Nuxt.js · Vue.js · Bootstrap —
          {{ useAftership ? 'AfterShip + Mock fallback' : 'Mock API modu' }}
        </p>
        <p class="app-footer__copy">
          &copy; {{ new Date().getFullYear() }} Paket Dedektifi
        </p>
      </div>
    </footer>
  </div>
</template>
