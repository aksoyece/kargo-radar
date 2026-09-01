<script setup lang="ts">
import { DEMO_TRACKINGS } from '~/types/tracking'

const config = useRuntimeConfig()
const trackingNumber = ref('')
const { shipment, loading, error, track } = useTracking()

const useAftership = computed(() => config.public.useAftership)
const showEmptyState = computed(() => !shipment.value && !loading.value && !error.value)

async function handleSubmit() {
  await track(trackingNumber.value)
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
      <div class="hero-badge">6 kargo firması · tek arayüz</div>
      <h1 class="hero-title">Paketinizi Takip Edin</h1>
      <p class="hero-subtitle">
        Farklı kargo firmalarına ait gönderilerinizi tek bir uygulama üzerinden sorgulayın.
        Tüm veriler ortak bir formatta sunulur.
      </p>

      <div v-if="useAftership" class="mode-badge">
        Mock mod aktif — demo ve kayıtlı numaralar simüle veriyle gösterilir
      </div>

      <div class="search-card">
        <form class="search-form" @submit.prevent="handleSubmit">
          <input
            v-model="trackingNumber"
            type="text"
            class="search-input"
            placeholder="Takip numaranızı girin..."
            :disabled="loading"
            autocomplete="off"
            spellcheck="false"
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

    <div v-if="loading" class="loading-state">
      <div class="spinner" />
      <p>Kargo bilgileri getiriliyor...</p>
      <p class="loading-state__sub">Farklı API formatları ortak yapıya dönüştürülüyor</p>
    </div>

    <div v-if="error && !loading" class="error-alert" role="alert">
      <span class="error-alert__icon">⚠️</span>
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
