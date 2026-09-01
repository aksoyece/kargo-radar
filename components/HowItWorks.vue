<script setup lang="ts">
const steps = [
  {
    title: 'Numaranı gir',
    text: 'Takip numaranı arama kutusuna yaz veya hızlı dene kartlarından birini seç.',
  },
  {
    title: 'Veri dönüştürülür',
    text: 'Her firmanın farklı API yanıtı ortak gönderi formatına çevrilir.',
  },
  {
    title: 'Manifestoyu oku',
    text: 'Güncel konum, son güncelleme ve tüm hareket kaydını fiş üzerinde gör.',
  },
]
</script>

<template>
  <section class="how-section" aria-label="Nasıl çalışır">
    <h2 class="section-title">Nasıl çalışır</h2>
    <div class="how-grid">
      <article
        v-for="(step, index) in steps"
        :key="step.title"
        class="how-card manifest-card"
      >
        <div class="how-card__step">Adım {{ index + 1 }}</div>
        <h3 class="how-card__title">{{ step.title }}</h3>
        <p class="how-card__text">{{ step.text }}</p>
      </article>
    </div>
  </section>
</template>
