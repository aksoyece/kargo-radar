<script setup lang="ts">
import { CARRIER_COUNT } from '~/types/tracking'
</script>

<template>
  <section class="empty-state card" aria-label="Başlangıç">
    <div class="empty-state__icon" aria-hidden="true">📦</div>
    <h2 class="empty-state__title">Takip numaranızı girin</h2>
    <p class="empty-state__text">
      Gönderinizin güncel durumunu ve tüm hareket geçmişini burada görüntüleyebilirsiniz.
    </p>
    <ul class="empty-state__tips">
      <li>Demo numaralarıyla hemen deneyebilirsiniz</li>
      <li>Arama geçmişiniz otomatik kaydedilir</li>
      <li>{{ CARRIER_COUNT }} farklı kargo firması desteklenir</li>
    </ul>
  </section>
</template>
