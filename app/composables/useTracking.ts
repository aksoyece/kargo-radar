import type { NormalizedShipment } from '~/app/types/tracking'

export function useTracking() {
  const shipment = ref<NormalizedShipment | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { addToHistory } = useSearchHistory()

  async function track(trackingNumber: string) {
    const trimmed = trackingNumber.trim()

    if (!trimmed) {
      error.value = 'Lütfen bir takip numarası girin.'
      return
    }

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
      const fetchError = err as { data?: { statusMessage?: string }, statusMessage?: string }
      error.value =
        fetchError.data?.statusMessage
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
  }

  return {
    shipment,
    loading,
    error,
    track,
    reset,
  }
}
