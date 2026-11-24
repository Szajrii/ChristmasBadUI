<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    enabled?: boolean
  }>(),
  {
    count: 14,
    enabled: true,
  }
)

const bulbColors = [
  'bg-red-500 shadow-[0_0_12px_#ef4444]',
  'bg-yellow-300 shadow-[0_0_12px_#fde047]',
  'bg-emerald-400 shadow-[0_0_12px_#34d399]',
  'bg-sky-400 shadow-[0_0_12px_#38bdf8]',
  'bg-fuchsia-400 shadow-[0_0_12px_#e879f9]',
]
</script>

<template>
  <div
    v-if="enabled"
    aria-hidden="true"
    class="relative flex w-full items-center justify-around overflow-hidden py-1.5"
  >
    <div class="absolute inset-x-0 top-1.5 h-0.5 bg-emerald-800/90" />
    <span
      v-for="i in count"
      :key="i"
      class="christmas-bulb relative z-10 mt-1 inline-block h-3.5 w-3 rounded-full border border-white/60"
      :class="bulbColors[(i - 1) % bulbColors.length]"
      :style="{ animationDelay: `${(i % 5) * 0.22}s` }"
    />
  </div>
</template>
