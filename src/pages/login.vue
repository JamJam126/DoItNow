<script setup lang="ts">
const { fetch: refreshSession } = useUserSession()

const username = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

async function logIn() {
  error.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    await refreshSession()
    await navigateTo('/')
  } catch (caught) {
    const isWrongLogin = (caught as { statusCode?: number }).statusCode === 401
    error.value = isWrongLogin ? 'wrong username or password' : 'could not log in, try again'
    password.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="grid flex-1 place-items-center p-4">
    <form class="flex w-full max-w-xs flex-col gap-3" @submit.prevent="logIn">
      <AppLogo class="mb-3" />

      <input
        v-model="username"
        type="text"
        autocomplete="username"
        autocapitalize="none"
        spellcheck="false"
        autofocus
        placeholder="Username"
        aria-label="Username"
        class="h-10 rounded-md border bg-transparent px-3 text-sm outline-none transition-colors
               placeholder:text-text-sub/40 focus:border-text-sub/50"
      />

      <input
        v-model="password"
        type="password"
        autocomplete="current-password"
        placeholder="Password"
        aria-label="Password"
        class="h-10 rounded-md border bg-transparent px-3 text-sm outline-none transition-colors
               placeholder:text-text-sub/40 focus:border-text-sub/50"
      />

      <UiButton
        variant="solid"
        type="submit"
        class="mt-1"
        :disabled="!username || !password || isSubmitting"
      >
        {{ isSubmitting ? 'Logging in…' : 'Log in' }}
      </UiButton>

      <p v-if="error" class="font-mono text-xs text-error">{{ error }}</p>
    </form>
  </main>
</template>
