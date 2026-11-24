<script setup lang="ts">
withDefaults(
  defineProps<{
    enabled?: boolean
  }>(),
  {
    enabled: true,
  }
)

const flakes = [
  { left: '4%', size: '1.1rem', duration: '9s', delay: '0s', char: '❄️' },
  { left: '11%', size: '1.5rem', duration: '12s', delay: '1.5s', char: '❅' },
  { left: '19%', size: '0.95rem', duration: '8s', delay: '3s', char: '❆' },
  { left: '27%', size: '1.4rem', duration: '11s', delay: '0.7s', char: '❄️' },
  { left: '36%', size: '1.2rem', duration: '10s', delay: '2.2s', char: '❅' },
  { left: '45%', size: '1.6rem', duration: '13s', delay: '4s', char: '❄️' },
  { left: '54%', size: '1rem', duration: '8.5s', delay: '1.1s', char: '❆' },
  { left: '63%', size: '1.35rem', duration: '11.5s', delay: '2.8s', char: '❄️' },
  { left: '72%', size: '1.1rem', duration: '9.5s', delay: '0.4s', char: '❅' },
  { left: '81%', size: '1.5rem', duration: '12.5s', delay: '3.5s', char: '❄️' },
  { left: '89%', size: '1rem', duration: '8.8s', delay: '1.9s', char: '❆' },
  { left: '95%', size: '1.3rem', duration: '10.8s', delay: '0.2s', char: '❄️' },
]
</script>

<template>
  <div
    v-if="enabled"
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-0 overflow-hidden"
  >
    <span
      v-for="(flake, idx) in flakes"
      :key="idx"
      class="snowflake text-white/85"
      :style="{
        left: flake.left,
        fontSize: flake.size,
        animationDuration: flake.duration,
        animationDelay: flake.delay,
      }"
    >
      {{ flake.char }}
    </span>
  </div>
</template>
