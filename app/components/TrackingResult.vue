<script setup lang="ts">
import { STATUS_ICONS, STATUS_LABELS } from '~/app/types/tracking'
import type { NormalizedShipment } from '~/app/types/tracking'

defineProps<{
  shipment: NormalizedShipment
}>()
</script>

<template>
  <div class="result-card">
    <div class="result-header">
      <div class="result-header__carrier">{{ shipment.carrier }}</div>
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
    </div>

    <TrackingTimeline :events="shipment.events" />
  </div>
</template>
