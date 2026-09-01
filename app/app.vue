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
      <p>Paket Dedektifi &copy; {{ new Date().getFullYear() }} — Mock API ile çalışmaktadır.</p>
    </footer>
  </div>
</template>
