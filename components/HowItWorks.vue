<script setup lang="ts">
const steps = [
  {
    title: 'Takip numarasını girin',
    text: 'Kargo firmasından aldığınız numarayı arama kutusuna yazın veya demo numaralardan birini seçin.',
  },
  {
    title: 'Veri dönüştürülür',
    text: 'Farklı API formatlarından gelen veriler tek bir standart yapıya çevrilir.',
  },
  {
    title: 'Durumu görüntüleyin',
    text: 'Güncel konum, son güncelleme ve tüm hareket geçmişini takip edin.',
  },
]
</script>

<template>
  <section class="how-section" aria-label="Nasıl çalışır">
    <h2 class="section-title">Nasıl çalışır?</h2>
    <p class="section-subtitle">Üç adımda kargonuzu takip edin.</p>
    <div class="how-grid">
      <article v-for="(step, index) in steps" :key="step.title" class="how-card">
        <div class="how-card__step">Adım {{ index + 1 }}</div>
        <h3 class="how-card__title">{{ step.title }}</h3>
        <p class="how-card__text">{{ step.text }}</p>
      </article>
    </div>
  </section>
</template>
