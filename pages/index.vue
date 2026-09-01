<script setup lang="ts">
import { CARRIER_COUNT, DEMO_TRACKINGS } from '~/types/tracking'

const config = useRuntimeConfig()
const { shipment, loading, error, trackingNumber, track, goHome } = useTracking()

const useAftership = computed(() => config.public.useAftership)
const showEmptyState = computed(() => !shipment.value && !loading.value && !error.value)
const showBackHome = computed(() => !loading.value && (shipment.value || error.value))

async function handleSubmit() {
  await track()
}

function handleDemoSelect(number: string) {
  trackingNumber.value = number
  track(number)
}

function handleHistorySelect(number: string) {
  trackingNumber.value = number
  track(number)
}
</script>

<template>
  <div>
    <section class="hero-section">
      <p class="hero-eyebrow">{{ CARRIER_COUNT }} kargo firması destekleniyor</p>
      <h1 class="hero-title">Kargonuzu takip edin</h1>
      <p class="hero-subtitle">
        Takip numaranızı girerek gönderinizin güncel durumunu ve hareket geçmişini görüntüleyin.
      </p>

      <div v-if="useAftership" class="notice-bar">
        <span class="notice-bar__dot" aria-hidden="true" />
        <span>Demo modu aktif — gerçek veriler simüle edilmektedir.</span>
      </div>

      <div class="search-card card">
        <form class="search-form" @submit.prevent="handleSubmit">
          <input
            v-model="trackingNumber"
            type="text"
            class="search-input"
            placeholder="Takip numaranızı girin"
            :disabled="loading"
            autocomplete="off"
            spellcheck="false"
            aria-label="Takip numarası"
          >
          <button type="submit" class="btn-track" :disabled="loading || !trackingNumber.trim()">
            <span v-if="loading" class="btn-track__spinner" aria-hidden="true" />
            {{ loading ? 'Sorgulanıyor...' : 'Takip Et' }}
          </button>
        </form>

        <div class="demo-hints">
          <p class="demo-hints__title">Hızlı dene</p>
          <ul class="demo-hints__list">
            <li v-for="demo in DEMO_TRACKINGS" :key="demo.number">
              <button
                type="button"
                class="demo-hint-btn"
                :class="{ 'demo-hint-btn--active': trackingNumber === demo.number }"
                :title="demo.label"
                @click="handleDemoSelect(demo.number)"
              >
                <span class="demo-hint-btn__label">{{ demo.label }}</span>
                <span class="demo-hint-btn__number">{{ demo.number }}</span>
                <span v-if="demo.hint" class="demo-hint-btn__hint">{{ demo.hint }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div v-if="showBackHome" class="back-home-bar">
      <button type="button" class="btn-back-home" @click="goHome">
        <span class="btn-back-home__icon" aria-hidden="true">←</span>
        Yeni arama yap
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner" />
      <p>Kargo bilgileri getiriliyor</p>
      <p class="loading-state__sub">Veriler ortak formata dönüştürülüyor</p>
    </div>

    <div v-if="error && !loading" class="error-alert" role="alert">
      <span class="error-alert__icon" aria-hidden="true">!</span>
      <div>
        <strong class="error-alert__title">Sorgu başarısız</strong>
        <p class="error-alert__text">{{ error }}</p>
      </div>
    </div>

    <TrackingResult v-if="shipment && !loading" :shipment="shipment" />

    <EmptyState v-if="showEmptyState" />

    <HowItWorks v-if="showEmptyState" />

    <SupportedCarriers />

    <SearchHistory @select="handleHistorySelect" />
  </div>
</template>
