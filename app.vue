<script setup lang="ts">
import { CARRIER_COUNT } from '~/types/tracking'

const { goHome } = useTracking()
</script>

<template>
  <div>
    <header class="app-header">
      <div class="container">
        <div class="app-header__inner">
          <NuxtLink to="/" class="app-logo" @click="goHome">
            <AppLogoIcon :size="36" />
            <span class="app-logo__text">
              <span class="app-logo__kargo">Kargo</span>
              <span class="app-logo__radar">Radar</span>
            </span>
          </NuxtLink>
          <div class="app-header__actions">
            <p class="app-tagline d-none d-sm-block">Kargo takip platformu</p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>

    <main class="container pb-4">
      <NuxtPage />
    </main>

    <footer class="app-footer">
      <div class="container">
        <div class="app-footer__main">
          <div class="app-footer__brand">
            <NuxtLink to="/" class="app-footer__brand-link" @click="goHome">
              <AppLogoIcon :size="28" />
              <span class="app-footer__brand-name">Kargo Radar</span>
            </NuxtLink>
            <p class="app-footer__tagline">Kargonuzu tek yerden takip edin.</p>
          </div>

          <p class="app-footer__note">
            {{ CARRIER_COUNT }} kargo firması destekleniyor.
          </p>
        </div>

        <div class="app-footer__bottom">
          <p class="app-footer__credit-line">
            &copy; {{ new Date().getFullYear() }} Kargo Radar
            <span class="app-footer__sep" aria-hidden="true">·</span>
            Designed &amp; developed by
            <a
              href="https://www.linkedin.com/in/eceaksoy16"
              target="_blank"
              rel="noopener noreferrer"
              class="app-footer__link"
            >Ece Aksoy</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
