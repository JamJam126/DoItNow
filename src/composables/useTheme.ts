export type ThemePreference = 'system' | 'light' | 'dark'

const storageKey = 'doitnow:theme'
const lightQuery = '(prefers-color-scheme: light)'
const themeColors = { light: '#ffffff', dark: '#0a0a0a' }

function readPreference(): ThemePreference {
  const saved = readStorage(storageKey)
  return saved === 'light' || saved === 'system' ? saved : 'dark'
}

const preference = ref<ThemePreference>(readPreference())

function applyTheme() {
  const prefersLight = window.matchMedia(lightQuery).matches
  const theme = preference.value === 'system' ? (prefersLight ? 'light' : 'dark') : preference.value

  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
}

function setPreference(value: ThemePreference) {
  preference.value = value
  writeStorage(storageKey, value)
  applyTheme()
}

function followSystemTheme() {
  applyTheme()
  window.matchMedia(lightQuery).addEventListener('change', () => {
    if (preference.value === 'system') applyTheme()
  })
}

export function useTheme() {
  return { preference, setPreference, followSystemTheme }
}
