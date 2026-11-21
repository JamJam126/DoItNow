<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'

const { orderedFields, isVisible, toggleField, setFieldOrder } = useTableFields()

const isOpen = ref(false)

const fields = computed({
  get: () => orderedFields.value,
  set: (fields) => setFieldOrder(fields.map((field) => field.key)),
})
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
        class="absolute top-full right-0 z-20 mt-1 flex w-52 flex-col rounded-md border bg-primary p-1
               shadow-lg shadow-shadow transition starting:-translate-y-1 starting:opacity-0"
      >
        <VueDraggable
          v-model="fields"
          handle=".field-handle"
          :animation="150"
          :force-fallback="true"
          :fallback-on-body="true"
          class="flex flex-col"
        >
          <div v-for="field in fields" :key="field.key" class="flex items-center rounded hover:bg-hover">
            <span
              aria-hidden="true"
              class="field-handle flex h-8 w-6 shrink-0 cursor-grab items-center justify-center text-text-sub/50
                     hover:text-text"
            >
              <svg viewBox="0 0 24 24" class="size-3.5" fill="currentColor">
                <circle cx="9" cy="6" r="1.6" />
                <circle cx="15" cy="6" r="1.6" />
                <circle cx="9" cy="12" r="1.6" />
                <circle cx="15" cy="12" r="1.6" />
                <circle cx="9" cy="18" r="1.6" />
                <circle cx="15" cy="18" r="1.6" />
              </svg>
            </span>
            <button
              type="button"
              role="menuitemcheckbox"
              :aria-checked="isVisible(field.key)"
              class="flex flex-1 cursor-pointer items-center justify-between py-1.5 pr-2 text-left text-sm
                     transition-colors"
              :class="isVisible(field.key) ? 'text-text' : 'text-text-sub/60 hover:text-text'"
              @click="toggleField(field.key)"
            >
              {{ field.label }}
              <span v-if="isVisible(field.key)" class="text-xs">✓</span>
            </button>
          </div>
        </VueDraggable>

        <p class="px-2 pt-1.5 pb-1 font-mono text-[11px] text-text-sub/50">drag to reorder</p>
      </div>
    </template>
  </div>
</template>
