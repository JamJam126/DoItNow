<script setup lang="ts">
import type { BoardSummary } from '#shared/types/board'

const { data: boards, status, refresh } = await useFetch<BoardSummary[]>('/api/boards', {
  default: () => [],
})

const actionError = ref('')

async function createBoard(name: string) {
  const id = crypto.randomUUID()

  try {
    await boardApi.createBoard(id, name)
    await navigateTo(`/boards/${id}`)
  } catch {
    actionError.value = 'could not create the board'
  }
}

async function deleteBoard(board: BoardSummary) {
  const cards = board.cardCount ? ` and its ${board.cardCount} cards` : ''
  if (!confirm(`Delete "${board.name}"${cards}?`)) return

  try {
    await boardApi.deleteBoard(board.id)
    await refresh()
  } catch {
    actionError.value = 'could not delete the board'
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />

    <main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div class="flex items-baseline justify-between">
        <h1 class="text-sm font-medium">Boards</h1>
        <span v-if="actionError" class="font-mono text-xs text-error">{{ actionError }}</span>
      </div>

      <p v-if="status === 'pending'" class="font-mono text-xs text-text-sub/60">loading boards…</p>
      <p v-else-if="status === 'error'" class="font-mono text-xs text-text-sub/60">
        could not load boards
      </p>

      <ul v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="board in boards" :key="board.id">
          <BoardTile :board="board" @delete="deleteBoard(board)" />
        </li>
        <li>
          <AddBoardForm @create="createBoard" />
        </li>
      </ul>
    </main>
  </div>
</template>
