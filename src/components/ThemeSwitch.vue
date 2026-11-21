<script setup lang="ts">
import type { ThemePreference } from '~/composables/useTheme'

const { preference, setPreference } = useTheme()

const options: { value: ThemePreference, label: string }[] = [
  { value: 'system',  label: 'System theme' },
  { value: 'light',   label: 'Light theme' },
  { value: 'dark',    label: 'Dark theme' },
]
</script>

<template>
  <div class="flex items-center justify-between px-2 py-1">
    <span class="text-sm text-text-sub">Theme</span>

    <div class="flex rounded-md border p-0.5">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :title="option.label"
        :aria-label="option.label"
        :aria-pressed="preference === option.value"
        class="flex size-6 cursor-pointer items-center justify-center rounded transition-colors"
        :class="preference === option.value ? 'bg-hover text-text' : 'text-text-sub/60 hover:text-text'"
        @click="setPreference(option.value)"
      >
        <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <template v-if="option.value === 'system'">
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M8 20h8M12 16v4" />
          </template>
          <template v-else-if="option.value === 'light'">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </template>
          <path v-else d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      </button>
    </div>
  </div>
</template>
