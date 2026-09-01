import type { NormalizedShipment } from '~/types/tracking'

const HISTORY_KEY = 'kargo-radar-history'
const MAX_HISTORY = 10

export function useSearchHistory() {
  const history = useState<import('~/types/tracking').SearchHistoryItem[]>('search-history', () => [])

  function loadHistory() {
    if (!import.meta.client) return

    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) {
        history.value = JSON.parse(stored)
      }
    }
    catch {
      history.value = []
    }
  }

  function saveHistory() {
    if (!import.meta.client) return
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  }

  function addToHistory(shipment: NormalizedShipment) {
    const item = {
      trackingNumber: shipment.trackingNumber,
      carrier: shipment.carrier,
      currentStatus: shipment.currentStatus,
      searchedAt: new Date().toISOString(),
    }

    history.value = [
      item,
      ...history.value.filter((h) => h.trackingNumber !== item.trackingNumber),
    ].slice(0, MAX_HISTORY)

    saveHistory()
  }

  function removeFromHistory(trackingNumber: string) {
    history.value = history.value.filter((h) => h.trackingNumber !== trackingNumber)
    saveHistory()
  }

  function clearHistory() {
    history.value = []
    saveHistory()
  }

  onMounted(loadHistory)

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    loadHistory,
  }
}
