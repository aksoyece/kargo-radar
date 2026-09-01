<script setup lang="ts">
const config = useRuntimeConfig()
const trackingNumber = ref('')
const { shipment, loading, error, track } = useTracking()

const useAftership = computed(() => config.public.useAftership)

const demoNumbers = [
  { label: 'Aras Kargo', number: 'ARS123456789' },
  { label: 'Yurtiçi Kargo', number: 'YRT987654321' },
  { label: 'MNG Kargo', number: 'MNG456789123' },
]

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
      <h1 class="hero-title">Paketinizi Takip Edin</h1>
      <p class="hero-subtitle">
        Farklı kargo firmalarına ait gönderilerinizi tek bir uygulama üzerinden sorgulayın.
      </p>

      <div v-if="useAftership" class="mode-badge">
        AfterShip API aktif — gerçek kargo verileri kullanılıyor
      </div>

      <div class="search-card">
        <form class="search-form" @submit.prevent="handleSubmit">
          <input
            v-model="trackingNumber"
            type="text"
            class="search-input"
            :placeholder="useAftership ? 'Gerçek takip numaranızı girin...' : 'Takip numaranızı girin...'"
            :disabled="loading"
            autocomplete="off"
            spellcheck="false"
          >
          <button type="submit" class="btn-track" :disabled="loading || !trackingNumber.trim()">
            {{ loading ? 'Sorgulanıyor...' : 'Takip Et' }}
          </button>
        </form>

        <div v-if="!useAftership" class="demo-hints">
          <p class="demo-hints__title">Demo takip numaraları</p>
          <ul class="demo-hints__list">
            <li v-for="demo in demoNumbers" :key="demo.number">
              <button
                type="button"
                class="demo-hint-btn"
                :title="demo.label"
                @click="handleDemoSelect(demo.number)"
              >
                {{ demo.number }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div v-if="loading" class="loading-state">
      <div class="spinner" />
      <p>Kargo bilgileri getiriliyor...</p>
    </div>

    <div v-if="error && !loading" class="error-alert" role="alert">
      <span class="error-alert__icon">⚠️</span>
      <span>{{ error }}</span>
    </div>

    <TrackingResult v-if="shipment && !loading" :shipment="shipment" />

    <SearchHistory @select="handleHistorySelect" />
  </div>
</template>
