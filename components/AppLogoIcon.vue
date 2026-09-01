<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 32,
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 40 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    class="app-logo-icon"
  >
    <ellipse cx="20" cy="44.5" rx="10" ry="2.5" fill="#2563eb" opacity="0.14" />
    <path
      d="M20 3.5C12.8 3.5 8 10.2 8 17.2C8 25.5 20 41 20 41C20 41 32 25.5 32 17.2C32 10.2 27.2 3.5 20 3.5Z"
      fill="#4A90E2"
    />
    <path d="M14.5 15.5L20 12.5L25.5 15.5V21.5L20 24.5L14.5 21.5V15.5Z" fill="#fff" />
    <path d="M20 12.5L25.5 15.5V21.5L20 18.5V12.5Z" fill="#D6E8FA" />
    <path d="M14.5 15.5L20 12.5V18.5L14.5 21.5V15.5Z" fill="#B8D4F5" />
    <path d="M17.5 18H22.5" stroke="#4A90E2" stroke-width="1" stroke-linecap="round" />
  </svg>
</template>
