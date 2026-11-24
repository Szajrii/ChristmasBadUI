<script setup lang="ts">
withDefaults(
  defineProps<{
    stripedBorder?: boolean
  }>(),
  {
    stripedBorder: true,
  }
)
</script>

<template>
  <div
    class="rounded-3xl p-2 shadow-[0_14px_40px_rgba(0,0,0,0.65)]"
    :class="stripedBorder ? 'candy-cane-border' : 'bg-yellow-400'"
  >
    <div
      class="h-full w-full rounded-[20px] border-4 border-yellow-300/90 bg-gradient-to-br from-red-950/95 via-emerald-950/95 to-red-900/95 text-amber-50"
    >
      <slot />
    </div>
  </div>
</template>
