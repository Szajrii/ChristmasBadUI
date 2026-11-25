<script setup lang="ts">
import KitschCard from './KitschCard.vue'

withDefaults(
  defineProps<{
    titleId?: string
    maxWidthClass?: string
  }>(),
  {
    titleId: undefined,
    maxWidthClass: 'max-w-md',
  }
)
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
  >
    <KitschCard class="w-full" :class="maxWidthClass">
      <slot />
    </KitschCard>
  </div>
</template>
