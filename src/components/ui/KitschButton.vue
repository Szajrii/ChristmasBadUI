<script setup lang="ts">
export type KitschButtonVariant = 'santa' | 'elf' | 'gold' | 'grinch'

const props = withDefaults(
  defineProps<{
    variant?: KitschButtonVariant
    active?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'santa',
    active: false,
    disabled: false,
    type: 'button',
  }
)

const variantClasses: Record<KitschButtonVariant, string> = {
  santa: 'bg-[#cc0000] text-[#ffff00] border-[#ff6666] hover:bg-[#ee0000]',
  elf: 'bg-[#007700] text-[#ffffff] border-[#55ff55] hover:bg-[#009900]',
  gold: 'bg-[#ffcc00] text-[#990000] border-[#ffff88] hover:bg-[#ffdd33]',
  grinch: 'bg-[#66cc00] text-[#000000] border-[#ccff66] hover:bg-[#77dd00]',
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="retro-bevel inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      variantClasses[props.variant],
      props.active ? 'outline-2 outline-dashed outline-[#ffff00]' : '',
    ]"
  >
    <slot />
  </button>
</template>
