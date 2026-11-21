<script setup lang="ts">
const maxLength = 1000

const message = ref('')
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

const canSend = computed(() => message.value.trim() && status.value !== 'sending')

useHead({ title: 'Feedback · DoItNow' })

async function send() {
  if (!canSend.value) return

  status.value = 'sending'

  try {
    await $fetch('/api/feedback', { method: 'POST', body: { message: message.value } })
    message.value = ''
    status.value = 'sent'
  } catch (caught) {
    if ((caught as { statusCode?: number }).statusCode === 401) return navigateTo('/login')
    status.value = 'error'
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader>
      <template #title>
        <span class="text-sm font-medium text-text-sub">Feedback</span>
      </template>
    </AppHeader>

    <main class="mx-auto flex w-full max-w-md flex-col gap-6 p-4 sm:p-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-sm font-medium">Send feedback</h1>
        <p class="font-mono text-xs text-text-sub/60">found a bug or have an idea? tell me.</p>
      </div>

      <div v-if="status === 'sent'" class="flex flex-col items-start gap-4">
        <p class="font-mono text-xs text-success">thanks! your feedback was sent.</p>
        <UiButton size="sm" @click="status = 'idle'">Send another</UiButton>
      </div>

      <form v-else class="flex flex-col gap-3" @submit.prevent="send">
        <textarea
          v-model="message"
          rows="6"
          :maxlength="maxLength"
          placeholder="Your feedback…"
          aria-label="Feedback"
          class="resize-y rounded-md border bg-transparent p-3 text-sm leading-relaxed outline-none
                 transition-colors placeholder:text-text-sub/40 focus:border-text-sub/50"
          @keydown.ctrl.enter="send"
          @keydown.meta.enter="send"
        />

        <div class="flex items-center justify-between gap-3">
          <span class="font-mono text-[11px] text-text-sub/50">ctrl + enter to send</span>
          <span class="font-mono text-[11px] text-text-sub/50">{{ message.length }} / {{ maxLength }}</span>
        </div>

        <UiButton variant="solid" type="submit" :disabled="!canSend">
          {{ status === 'sending' ? 'Sending…' : 'Send' }}
        </UiButton>

        <p v-if="status === 'error'" class="font-mono text-xs text-error">
          could not send, try again
        </p>
      </form>

      <NuxtLink to="/" class="font-mono text-xs text-text-sub underline hover:text-text">
        back to boards
      </NuxtLink>
    </main>
  </div>
</template>
