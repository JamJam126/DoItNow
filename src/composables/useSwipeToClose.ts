type Direction = 'undecided' | 'horizontal' | 'vertical'

const closeDistance = 80
const slideOutDuration = 200

export function useSwipeToClose(onClose: () => void) {
  const offset = ref(0)
  const isSwiping = ref(false)

  let startX = 0
  let startY = 0
  let direction: Direction = 'undecided'

  function onTouchStart(event: TouchEvent) {
    const touch = event.touches[0]
    if (!touch) return

    startX = touch.clientX
    startY = touch.clientY

    const startedInTextBox = (event.target as HTMLElement).closest('input, textarea')
    direction = startedInTextBox ? 'vertical' : 'undecided'
  }

  function onTouchMove(event: TouchEvent) {
    const touch = event.touches[0]
    if (!touch || direction === 'vertical') return

    const movedX = touch.clientX - startX
    const movedY = touch.clientY - startY

    if (direction === 'undecided') {
      if (Math.abs(movedX) < 10 && Math.abs(movedY) < 10) return
      direction = Math.abs(movedX) > Math.abs(movedY) ? 'horizontal' : 'vertical'
      if (direction === 'vertical') return
    }

    event.preventDefault()
    isSwiping.value = true
    offset.value = Math.max(0, movedX)
  }

  function onTouchEnd() {
    if (!isSwiping.value) return
    isSwiping.value = false

    if (offset.value < closeDistance) {
      offset.value = 0
      return
    }

    offset.value = window.innerWidth
    setTimeout(onClose, slideOutDuration)
  }

  return { offset, isSwiping, onTouchStart, onTouchMove, onTouchEnd }
}
