<script setup lang="ts">
import type { TrackingEvent } from '~/types/tracking'

defineProps<{
  events: TrackingEvent[]
}>()
</script>

<template>
  <div class="timeline-section">
    <h3 class="timeline-section__title">Hareket kaydı</h3>
    <div class="timeline">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="timeline-item"
      >
        <div
          class="timeline-item__marker"
          :class="`timeline-item__marker--${event.status}`"
        />
        <div class="timeline-item__content">
          <div class="timeline-item__description">{{ event.description }}</div>
          <div class="timeline-item__location">{{ event.location }}</div>
          <div class="timeline-item__time">{{ event.timestamp }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
