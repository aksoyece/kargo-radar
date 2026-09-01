<script setup lang="ts">
import { STATUS_ICONS, STATUS_LABELS } from '~/types/tracking'
import type { NormalizedShipment } from '~/types/tracking'

const props = defineProps<{
  shipment: NormalizedShipment
}>()

const copied = ref(false)

async function copyTrackingNumber() {
  if (!import.meta.client) return

  try {
    await navigator.clipboard.writeText(props.shipment.trackingNumber)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch {
    // Clipboard API desteklenmiyorsa sessizce geç
  }
}
</script>

<template>
  <div class="result-card">
    <div class="result-header">
      <div class="result-header__top">
        <div class="result-header__carrier">{{ shipment.carrier }}</div>
        <button
          type="button"
          class="btn-copy"
          :title="copied ? 'Kopyalandı!' : 'Numarayı kopyala'"
          @click="copyTrackingNumber"
        >
          {{ copied ? '✓ Kopyalandı' : '📋 Kopyala' }}
        </button>
      </div>
      <div class="result-header__number">{{ shipment.trackingNumber }}</div>
      <div class="result-status">
        <span class="result-status__icon">{{ STATUS_ICONS[shipment.currentStatus] }}</span>
        <span class="result-status__label">{{ STATUS_LABELS[shipment.currentStatus] }}</span>
      </div>
    </div>

    <div class="result-meta">
      <div class="result-meta__item">
        <label>Konum</label>
        <span>{{ shipment.currentLocation }}</span>
      </div>
      <div class="result-meta__item">
        <label>Son Güncelleme</label>
        <span>{{ shipment.lastUpdated }}</span>
      </div>
      <div class="result-meta__item result-meta__item--full">
        <label>Toplam Hareket</label>
        <span>{{ shipment.events.length }} kayıt</span>
      </div>
    </div>

    <TrackingTimeline :events="shipment.events" />
  </div>
</template>
