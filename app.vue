<template>
  <div>
    <header class="app-header">
      <div class="container">
        <div class="app-header__inner">
          <NuxtLink to="/" class="app-logo">
            <AppLogoIcon :size="36" />
            <span class="app-logo__text">
              <span class="app-logo__paket">Paket</span>
              <span class="app-logo__dedektifi">Dedektifi</span>
            </span>
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
        <p class="app-footer__credit-line">
          <AppLogoIcon :size="18" class="app-footer__logo" />
          &copy; {{ new Date().getFullYear() }} Paket Dedektifi
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
    </footer>
  </div>
</template>
