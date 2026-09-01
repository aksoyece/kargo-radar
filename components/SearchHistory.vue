<script setup lang="ts">
import { STATUS_LABELS } from '~/types/tracking'

const emit = defineEmits<{
  select: [trackingNumber: string]
}>()

const { history, removeFromHistory, clearHistory } = useSearchHistory()
</script>

<template>
  <section v-if="history.length > 0" class="history-section">
    <div class="history-section__header">
      <h2 class="history-section__title">Arama Geçmişi</h2>
      <button type="button" class="btn-clear-history" @click="clearHistory">
        Temizle
      </button>
    </div>
    <ul class="history-list">
      <li
        v-for="item in history"
        :key="item.trackingNumber"
        class="history-item"
        @click="emit('select', item.trackingNumber)"
      >
        <div class="history-item__info">
          <span class="history-item__number">{{ item.trackingNumber }}</span>
          <span class="history-item__carrier">
            {{ item.carrier }} · {{ STATUS_LABELS[item.currentStatus] }}
          </span>
        </div>
        <span
          :class="['status-badge', `status-badge--${item.currentStatus}`]"
        >
          {{ STATUS_LABELS[item.currentStatus] }}
        </span>
        <button
          type="button"
          class="history-item__remove"
          aria-label="Geçmişten kaldır"
          @click.stop="removeFromHistory(item.trackingNumber)"
        >
          ×
        </button>
      </li>
    </ul>
  </section>
</template>
