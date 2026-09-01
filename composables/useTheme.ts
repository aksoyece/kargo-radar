export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'kargo-radar-theme'

function getPreferredTheme(): ThemeMode {
  if (!import.meta.client) return 'light'

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  if (!import.meta.client) return

  document.documentElement.setAttribute('data-theme', mode)

  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.setAttribute('content', mode === 'dark' ? '#0f172a' : '#2563eb')
  }
}

export function useTheme() {
  const theme = useState<ThemeMode>('theme', () => 'light')

  function setTheme(mode: ThemeMode) {
    theme.value = mode
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, mode)
      applyTheme(mode)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    const mode = getPreferredTheme()
    theme.value = mode
    applyTheme(mode)
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
