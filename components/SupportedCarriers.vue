<script setup lang="ts">
import { CARRIERS } from '~/types/tracking'
</script>

<template>
  <section class="carriers-section" aria-label="Desteklenen kargo firmaları">
    <h2 class="section-title">Desteklenen firmalar</h2>
    <p class="section-subtitle">
      Her firma farklı API formatı kullanır; hepsi aynı manifesto fişine dönüştürülür.
    </p>
    <div class="carriers-grid">
      <div
        v-for="carrier in CARRIERS"
        :key="carrier.slug"
        class="carrier-card"
      >
        <span class="carrier-card__code">{{ carrier.prefix }}</span>
        <span class="carrier-card__name">{{ carrier.name }}</span>
      </div>
    </div>
  </section>
</template>
