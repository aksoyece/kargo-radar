<script setup lang="ts">
const steps = [
  {
    icon: '🔍',
    title: 'Numaranı gir',
    text: 'Kargo takip numaranı arama kutusuna yaz veya demo numaralardan birini seç.',
  },
  {
    icon: '🔄',
    title: 'Veri dönüştürülür',
    text: 'Farklı firmalardan gelen API yanıtları ortak bir formata çevrilir.',
  },
  {
    icon: '📍',
    title: 'Durumu takip et',
    text: 'Güncel konum, son güncelleme ve tüm hareket geçmişini timeline\'da gör.',
  },
]
</script>

<template>
  <section class="how-section" aria-label="Nasıl çalışır">
    <h2 class="section-title">Nasıl Çalışır?</h2>
    <div class="how-grid">
      <article v-for="(step, index) in steps" :key="step.title" class="how-card">
        <div class="how-card__step">{{ index + 1 }}</div>
        <div class="how-card__icon" aria-hidden="true">{{ step.icon }}</div>
        <h3 class="how-card__title">{{ step.title }}</h3>
        <p class="how-card__text">{{ step.text }}</p>
      </article>
    </div>
  </section>
</template>
