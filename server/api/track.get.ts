import { fetchFromAfterShip } from '../services/aftership'
import {
  normalizeArasResponse,
  normalizeMngResponse,
  normalizeYurticiResponse,
} from '~/app/services/adapters'
import { detectCarrier } from '~/app/utils/statusMapper'
import { ARAS_MOCK, MNG_MOCK, simulateDelay, YURTICI_MOCK } from '../utils/mockData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const number = query.number as string
  const slug = query.slug as string | undefined

  if (!number?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Lütfen bir takip numarası girin.' })
  }

  const normalized = number.trim().toUpperCase()
  const config = useRuntimeConfig()

  if (config.public.useAftership) {
    return fetchFromAfterShip(number.trim(), slug)
  }

  const carrier = detectCarrier(normalized)

  if (!carrier) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz takip numarası. ARS, YRT veya MNG ile başlamalıdır. Gerçek kargo takibi için AfterShip modunu etkinleştirin.',
    })
  }

  try {
    if (carrier === 'aras') {
      const data = ARAS_MOCK[normalized]
      if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'Kargo bulunamadı.' })
      }
      const raw = await simulateDelay(data, 800)
      return normalizeArasResponse(raw as Parameters<typeof normalizeArasResponse>[0])
    }

    if (carrier === 'yurtici') {
      const data = YURTICI_MOCK[normalized]
      if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'Kargo bulunamadı.' })
      }
      const raw = await simulateDelay(data, 900)
      return normalizeYurticiResponse(raw as Parameters<typeof normalizeYurticiResponse>[0])
    }

    const data = MNG_MOCK[normalized]
    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Kargo bulunamadı.' })
    }
    const raw = await simulateDelay(data, 1000)
    return normalizeMngResponse(raw as Parameters<typeof normalizeMngResponse>[0])
  }
  catch (error: unknown) {
    const fetchError = error as { statusCode?: number, statusMessage?: string }
    if (fetchError.statusCode) {
      throw createError({
        statusCode: fetchError.statusCode,
        statusMessage: fetchError.statusMessage || 'Kargo bilgisi alınamadı.',
      })
    }
    throw createError({
      statusCode: 503,
      statusMessage: 'Kargo servisine ulaşılamadı. Lütfen daha sonra tekrar deneyin.',
    })
  }
})
