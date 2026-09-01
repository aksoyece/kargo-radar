<script setup lang="ts">
import { CARRIERS } from '~/types/tracking'
</script>

<template>
  <section class="carriers-section" aria-label="Desteklenen kargo firmaları">
    <h2 class="section-title">Desteklenen Kargo Firmaları</h2>
    <p class="section-subtitle">
      Farklı API formatları tek bir arayüzde birleştirilir.
    </p>
    <div class="carriers-grid">
      <div
        v-for="carrier in CARRIERS"
        :key="carrier.slug"
        class="carrier-card"
        :style="{ '--carrier-accent': carrier.accent }"
      >
        <span class="carrier-card__icon" aria-hidden="true">{{ carrier.icon }}</span>
        <span class="carrier-card__name">{{ carrier.name }}</span>
      </div>
    </div>
  </section>
</template>
