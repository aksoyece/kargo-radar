import type {
  AfterShipApiEnvelope,
  AfterShipApiError,
  AfterShipTracking,
} from '~/app/services/aftershipAdapter'
import { normalizeAfterShipTracking } from '~/app/services/aftershipAdapter'
import type { NormalizedShipment } from '~/app/types/tracking'

const AFTERSHIP_API_VERSION = '2026-07'
const AFTERSHIP_BASE_URL = `https://api.aftership.com/tracking/${AFTERSHIP_API_VERSION}`

interface DetectCourierResult {
  couriers?: Array<{ slug?: string, name?: string }>
}

interface GetTrackingsResult {
  trackings?: AfterShipTracking[]
}

function getApiKey(): string {
  const config = useRuntimeConfig()
  const apiKey = config.aftershipApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'AfterShip API anahtarı yapılandırılmamış. AFTERSHIP_API_KEY ortam değişkenini ayarlayın.',
    })
  }

  return apiKey
}

async function aftershipRequest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: Record<string, unknown>
    query?: Record<string, string>
  } = {},
): Promise<AfterShipApiEnvelope<T>> {
  const apiKey = getApiKey()

  try {
    return await $fetch<AfterShipApiEnvelope<T>>(`${AFTERSHIP_BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'as-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: options.body,
      query: options.query,
    })
  }
  catch (error: unknown) {
    const fetchError = error as {
      data?: AfterShipApiError
      statusCode?: number
      statusMessage?: string
    }

    const aftershipError = fetchError.data
    const message = aftershipError?.meta?.message
      || fetchError.statusMessage
      || 'AfterShip API isteği başarısız oldu.'

    throw createError({
      statusCode: fetchError.statusCode || 502,
      statusMessage: message,
      data: aftershipError,
    })
  }
}

async function detectCourier(trackingNumber: string): Promise<string | null> {
  const response = await aftershipRequest<DetectCourierResult>('/couriers/detect', {
    method: 'POST',
    body: { tracking_number: trackingNumber },
  })

  return response.data.couriers?.[0]?.slug || null
}

async function getExistingTracking(trackingNumber: string): Promise<AfterShipTracking | null> {
  const response = await aftershipRequest<GetTrackingsResult>('/trackings', {
    query: { tracking_numbers: trackingNumber },
  })

  return response.data.trackings?.[0] || null
}

async function getTrackingById(id: string): Promise<AfterShipTracking> {
  const response = await aftershipRequest<AfterShipTracking>(`/trackings/${id}`)
  return response.data
}

async function createTracking(
  trackingNumber: string,
  slug: string,
): Promise<AfterShipTracking> {
  try {
    const response = await aftershipRequest<AfterShipTracking>('/trackings', {
      method: 'POST',
      body: {
        tracking_number: trackingNumber,
        slug,
      },
    })

    return response.data
  }
  catch (error: unknown) {
    const fetchError = error as {
      statusCode?: number
      data?: AfterShipApiError
    }

    if (fetchError.data?.meta?.code === 4003) {
      const existingId = fetchError.data.data?.tracking?.id
      if (existingId) {
        return getTrackingById(existingId)
      }

      const existing = await getExistingTracking(trackingNumber)
      if (existing?.id) {
        return getTrackingById(existing.id)
      }
    }

    throw error
  }
}

/**
 * AfterShip Tracking API quick start akışı:
 * 1. Mevcut takip kaydını ara (GET /trackings?tracking_numbers=)
 * 2. Yoksa kargo firmasını tespit et (POST /couriers/detect)
 * 3. Takip kaydı oluştur (POST /trackings)
 * 4. Yanıtı ortak formata dönüştür
 *
 * @see https://www.aftership.com/docs/tracking/quickstart/api-quick-start
 */
export async function fetchFromAfterShip(
  trackingNumber: string,
  slug?: string,
): Promise<NormalizedShipment> {
  const normalizedNumber = trackingNumber.trim()

  let tracking = await getExistingTracking(normalizedNumber)

  if (!tracking) {
    const courierSlug = slug || await detectCourier(normalizedNumber)

    if (!courierSlug) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Kargo firması tespit edilemedi. Lütfen takip numaranızı kontrol edin.',
      })
    }

    tracking = await createTracking(normalizedNumber, courierSlug)
  }
  else if (tracking.id && (!tracking.checkpoints || tracking.checkpoints.length === 0)) {
    tracking = await getTrackingById(tracking.id)
  }

  if (!tracking.checkpoints?.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Kargo bulundu ancak henüz hareket bilgisi yok. Lütfen daha sonra tekrar deneyin.',
    })
  }

  return normalizeAfterShipTracking(tracking)
}
