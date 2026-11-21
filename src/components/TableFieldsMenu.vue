<script setup lang="ts">
const { isVisible, toggleField } = useTableFields()

const isOpen = ref(false)
</script>

<template>
  <div class="relative" @keydown.esc="isOpen = false">
    <UiButton
      variant="ghost"
      size="sm"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      Columns
      <span class="text-text-sub/60">▾</span>
    </UiButton>

    <template v-if="isOpen">
      <div class="fixed inset-0 z-10" @click="isOpen = false" />

      <div
        role="menu"
        class="absolute top-full right-0 z-20 mt-1 flex w-44 flex-col rounded-md border bg-primary p-1
               shadow-lg shadow-shadow transition starting:-translate-y-1 starting:opacity-0"
      >
        <button
          v-for="field in tableFields"
          :key="field.key"
          type="button"
          role="menuitemcheckbox"
          :aria-checked="isVisible(field.key)"
          class="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-left text-sm
                 transition-colors hover:bg-hover"
          :class="isVisible(field.key) ? 'text-text' : 'text-text-sub/60 hover:text-text'"
          @click="toggleField(field.key)"
        >
          {{ field.label }}
          <span v-if="isVisible(field.key)" class="text-xs">✓</span>
        </button>
      </div>
    </template>
  </div>
</template>
