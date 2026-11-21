<script setup lang="ts">
const minPasswordLength = 10

const { user } = useUserSession()

const currentPassword = ref('')
const newPassword = ref('')
const repeatedPassword = ref('')
const isSubmitting = ref(false)
const error = ref('')
const isChanged = ref(false)

const problem = computed(() => {
  if (newPassword.value && newPassword.value.length < minPasswordLength) {
    return `new password needs at least ${minPasswordLength} characters`
  }
  if (repeatedPassword.value && repeatedPassword.value !== newPassword.value) {
    return 'new passwords do not match'
  }
  return ''
})

const canSubmit = computed(() => {
  const isFilled = currentPassword.value && newPassword.value && repeatedPassword.value
  return isFilled && !problem.value && !isSubmitting.value
})

useHead({ title: 'Account · DoItNow' })

async function changePassword() {
  error.value = ''
  isChanged.value = false
  isSubmitting.value = true

  try {
    await $fetch('/api/account/password', {
      method: 'PUT',
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    })
    isChanged.value = true
    currentPassword.value = ''
    newPassword.value = ''
    repeatedPassword.value = ''
  } catch (caught) {
    const statusCode = (caught as { statusCode?: number }).statusCode
    if (statusCode === 401) return navigateTo('/login')
    error.value = statusCode === 403 ? 'current password is wrong' : 'could not change the password, try again'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader>
      <template #title>
        <span class="text-sm font-medium text-text-sub">Account</span>
      </template>
    </AppHeader>

    <main class="mx-auto flex w-full max-w-sm flex-col gap-6 p-4 sm:p-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-sm font-medium">Change password</h1>
        <p class="font-mono text-xs text-text-sub/60">signed in as {{ user?.username }}</p>
      </div>

      <form class="flex flex-col gap-3" @submit.prevent="changePassword">
        <input
          v-model="currentPassword"
          type="password"
          autocomplete="current-password"
          placeholder="Current password"
          aria-label="Current password"
          class="h-10 rounded-md border bg-transparent px-3 text-sm outline-none transition-colors
                 placeholder:text-text-sub/40 focus:border-text-sub/50"
        />
        <input
          v-model="newPassword"
          type="password"
          autocomplete="new-password"
          placeholder="New password"
          aria-label="New password"
          class="h-10 rounded-md border bg-transparent px-3 text-sm outline-none transition-colors
                 placeholder:text-text-sub/40 focus:border-text-sub/50"
        />
        <input
          v-model="repeatedPassword"
          type="password"
          autocomplete="new-password"
          placeholder="Repeat new password"
          aria-label="Repeat new password"
          class="h-10 rounded-md border bg-transparent px-3 text-sm outline-none transition-colors
                 placeholder:text-text-sub/40 focus:border-text-sub/50"
        />

        <UiButton variant="solid" type="submit" class="mt-1" :disabled="!canSubmit">
          {{ isSubmitting ? 'Changing…' : 'Change password' }}
        </UiButton>

        <p v-if="problem" class="font-mono text-xs text-text-sub">{{ problem }}</p>
        <p v-else-if="error" class="font-mono text-xs text-error">{{ error }}</p>
        <p v-else-if="isChanged" class="font-mono text-xs text-success">password changed</p>
      </form>

      <NuxtLink to="/" class="font-mono text-xs text-text-sub underline hover:text-text">
        back to boards
      </NuxtLink>
    </main>
  </div>
</template>
