<script setup lang="ts">
interface ReindeerFlight {
  id: number
  topPercent: number
  durationSec: number
  delaySec: number
  direction: 'ltr' | 'rtl'
  sizeClass: string
  content: string
}

const flights: ReindeerFlight[] = [
  {
    id: 1,
    topPercent: 14,
    durationSec: 9,
    delaySec: 0,
    direction: 'ltr',
    sizeClass: 'text-3xl sm:text-4xl',
    content: '🎅🛷✨🦌🦌',
  },
  {
    id: 2,
    topPercent: 30,
    durationSec: 7,
    delaySec: -3,
    direction: 'rtl',
    sizeClass: 'text-2xl sm:text-3xl',
    content: '🦌✨🦌',
  },
  {
    id: 3,
    topPercent: 52,
    durationSec: 11,
    delaySec: -5,
    direction: 'ltr',
    sizeClass: 'text-2xl sm:text-4xl',
    content: '🦌🔴✨',
  },
  {
    id: 4,
    topPercent: 72,
    durationSec: 8,
    delaySec: -2,
    direction: 'rtl',
    sizeClass: 'text-3xl sm:text-4xl',
    content: '🦌🦌🛷🎅',
  },
  {
    id: 5,
    topPercent: 86,
    durationSec: 10,
    delaySec: -6,
    direction: 'ltr',
    sizeClass: 'text-2xl sm:text-3xl',
    content: '❄️🦌✨🦌',
  },
]
</script>

<template>
  <div
    data-testid="flying-reindeers-overlay"
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-15 overflow-hidden select-none"
  >
    <div
      v-for="flight in flights"
      :key="flight.id"
      data-testid="flying-reindeer-item"
      class="reindeer-flight absolute whitespace-nowrap drop-shadow-[2px_2px_0_#000000]"
      :class="[
        flight.sizeClass,
        flight.direction === 'ltr' ? 'reindeer-ltr' : 'reindeer-rtl',
      ]"
      :style="{
        top: `${flight.topPercent}%`,
        animationDuration: `${flight.durationSec}s`,
        animationDelay: `${flight.delaySec}s`,
      }"
    >
      {{ flight.content }}
    </div>
  </div>
</template>

<style scoped>
@keyframes fly-ltr {
  0% {
    transform: translateX(-25vw) translateY(0px) scaleX(-1);
  }
  25% {
    transform: translateX(20vw) translateY(-18px) scaleX(-1);
  }
  50% {
    transform: translateX(60vw) translateY(12px) scaleX(-1);
  }
  75% {
    transform: translateX(95vw) translateY(-14px) scaleX(-1);
  }
  100% {
    transform: translateX(125vw) translateY(0px) scaleX(-1);
  }
}

@keyframes fly-rtl {
  0% {
    transform: translateX(125vw) translateY(0px);
  }
  25% {
    transform: translateX(85vw) translateY(-16px);
  }
  50% {
    transform: translateX(45vw) translateY(14px);
  }
  75% {
    transform: translateX(10vw) translateY(-12px);
  }
  100% {
    transform: translateX(-30vw) translateY(0px);
  }
}

.reindeer-flight {
  left: 0;
  will-change: transform;
}

.reindeer-ltr {
  animation-name: fly-ltr;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.reindeer-rtl {
  animation-name: fly-rtl;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
