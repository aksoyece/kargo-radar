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
            <span class="app-logo__icon" aria-hidden="true">📦</span>
            Paket Dedektifi
          </NuxtLink>
          <p class="app-tagline d-none d-sm-block">Kargo takip platformu</p>
        </div>
      </div>
    </header>

    <main class="container pb-4">
      <NuxtPage />
    </main>

    <footer class="app-footer">
      <div class="app-footer__inner container">
        <div class="app-footer__left">
          <p class="app-footer__brand">Paket Dedektifi</p>
          <p class="app-footer__meta">
            Nuxt · Vue · Bootstrap ·
            {{ useAftership ? 'AfterShip + Mock' : 'Mock API' }}
          </p>
          <p class="app-footer__copy">
            &copy; {{ new Date().getFullYear() }}
          </p>
        </div>
        <p class="app-footer__credit">
          Designed &amp; developed by
          <a
            href="https://www.linkedin.com/in/eceaksoy16"
            target="_blank"
            rel="noopener noreferrer"
            class="app-footer__link"
          >Ece Aksoy</a>
        </p>
      </div>
    </footer>
  </div>
</template>
