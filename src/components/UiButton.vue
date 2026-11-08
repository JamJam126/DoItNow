<script setup lang="ts">
type Variant = 'solid' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const { variant = 'outline', size = 'md' } = defineProps<{
  variant?:  Variant
  size?:     Size
}>()

const variantClasses: Record<Variant, string> = {
  solid:    'bg-text text-primary hover:bg-text/85',
  outline:  'border text-text hover:bg-hover',
  ghost:    'text-text-sub hover:bg-hover hover:text-text',
  danger:   'text-error hover:bg-error/10',
}

const sizeClasses: Record<Size, string> = {
  sm:  'h-7 px-2 text-xs',
  md:  'h-9 px-3 text-sm',
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center gap-1.5 rounded-md font-medium
           transition-colors
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-sub
           disabled:pointer-events-none disabled:opacity-50"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot />
  </button>
</template>
