<script setup lang="ts">
import { STATUS_LABELS } from '~/types/tracking'
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
  <div class="result-card card">
    <div class="result-header">
      <div class="result-header__top">
        <div>
          <p class="result-header__carrier">{{ shipment.carrier }}</p>
          <div class="result-header__number">{{ shipment.trackingNumber }}</div>
        </div>
        <button
          type="button"
          class="btn-copy"
          :title="copied ? 'Kopyalandı' : 'Numarayı kopyala'"
          @click="copyTrackingNumber"
        >
          {{ copied ? 'Kopyalandı' : 'Kopyala' }}
        </button>
      </div>
      <div class="result-status-row">
        <span
          class="status-badge status-badge--lg"
          :class="`status-badge--${shipment.currentStatus}`"
        >
          {{ STATUS_LABELS[shipment.currentStatus] }}
        </span>
      </div>
    </div>

    <div class="result-meta">
      <div class="result-meta__item">
        <label>Konum</label>
        <span>{{ shipment.currentLocation }}</span>
      </div>
      <div class="result-meta__item">
        <label>Son güncelleme</label>
        <span class="mono">{{ shipment.lastUpdated }}</span>
      </div>
      <div class="result-meta__item result-meta__item--full">
        <label>Toplam hareket</label>
        <span class="mono">{{ shipment.events.length }} kayıt</span>
      </div>
    </div>

    <TrackingTimeline :events="shipment.events" />
  </div>
</template>
