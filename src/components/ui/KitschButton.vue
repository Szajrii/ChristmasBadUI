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
  santa:
    'bg-gradient-to-b from-red-500 via-red-600 to-red-800 text-yellow-200 border-yellow-300 hover:from-red-400 hover:to-red-700',
  elf: 'bg-gradient-to-b from-emerald-500 via-green-600 to-green-900 text-yellow-100 border-lime-300 hover:from-emerald-400 hover:to-green-800',
  gold: 'bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 text-red-950 border-white hover:from-yellow-200 hover:to-amber-500',
  grinch:
    'bg-gradient-to-b from-lime-400 via-lime-600 to-emerald-900 text-red-950 border-red-500 hover:from-lime-300 hover:to-lime-700',
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 px-3.5 py-2 text-sm font-bold tracking-wide shadow-[0_4px_0_rgba(0,0,0,0.45)] transition-transform duration-100 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      variantClasses[props.variant],
      props.active ? 'ring-2 ring-yellow-300 ring-offset-2 ring-offset-red-950' : '',
    ]"
  >
    <slot />
  </button>
</template>
