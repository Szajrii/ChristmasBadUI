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
    class="p-2.5 shadow-[8px_8px_0_#000000]"
    :class="stripedBorder ? 'candy-cane-border' : 'bg-[#ffff00]'"
  >
    <div
      class="h-full w-full border-4 border-double border-[#ffff00] bg-[#7a0000] text-[#ffffff]"
    >
      <slot />
    </div>
  </div>
</template>
