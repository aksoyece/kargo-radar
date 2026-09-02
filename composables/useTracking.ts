import type { NormalizedShipment } from '~/types/tracking'

export function useTracking() {
  const shipment = useState<NormalizedShipment | null>('tracking-shipment', () => null)
  const loading = useState('tracking-loading', () => false)
  const error = useState<string | null>('tracking-error', () => null)
  const trackingNumber = useState('tracking-number', () => '')

  const { addToHistory } = useSearchHistory()

  async function track(number?: string) {
    const trimmed = (number ?? trackingNumber.value).trim()

    if (!trimmed) {
      error.value = 'Lütfen bir takip numarası girin.'
      return
    }

    trackingNumber.value = trimmed
    loading.value = true
    error.value = null
    shipment.value = null

    try {
      const result = await $fetch<NormalizedShipment>('/api/track', {
        query: { number: trimmed },
      })

      shipment.value = result
      addToHistory(result)
    }
    catch (err: unknown) {
      const fetchError = err as {
        data?: { statusMessage?: string, message?: string }
        statusMessage?: string
        message?: string
      }
      error.value =
        fetchError.data?.message
        || fetchError.data?.statusMessage
        || fetchError.message
        || fetchError.statusMessage
        || 'Bir hata oluştu. Lütfen tekrar deneyin.'
      shipment.value = null
    }
    finally {
      loading.value = false
    }
  }

  function reset() {
    shipment.value = null
    error.value = null
    loading.value = false
    trackingNumber.value = ''
  }

  function scrollToTop() {
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goHome() {
    reset()
    scrollToTop()
  }

  return {
    shipment,
    loading,
    error,
    trackingNumber,
    track,
    reset,
    goHome,
  }
}
