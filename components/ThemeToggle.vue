<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'"
    :title="theme === 'dark' ? 'Açık tema' : 'Koyu tema'"
    @click="toggleTheme"
  >
    <span v-if="theme === 'dark'" aria-hidden="true">☀️</span>
    <span v-else aria-hidden="true">🌙</span>
  </button>
</template>
