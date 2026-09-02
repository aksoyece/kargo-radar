import { isError } from 'h3'
import { fetchFromAfterShip } from '../services/aftership'
import {
  normalizeArasResponse,
  normalizeHepsijetResponse,
  normalizeKolaygelsinResponse,
  normalizeMngResponse,
  normalizePttResponse,
  normalizeSuratResponse,
  normalizeTrendyolResponse,
  normalizeUpsResponse,
  normalizeYurticiResponse,
} from '~/services/adapters'
import type { CarrierSlug } from '~/types/tracking'
import {
  ARAS_MOCK,
  HEPSIJET_MOCK,
  KOLAYGELSIN_MOCK,
  MNG_MOCK,
  PTT_MOCK,
  simulateDelay,
  SURAT_MOCK,
  TRENDYOL_MOCK,
  UPS_MOCK,
  YURTICI_MOCK,
} from '../utils/mockData'

const NOT_FOUND_MESSAGE = 'Kargo bulunamadı. Lütfen takip numaranızı kontrol edin.'

function notFound(message = NOT_FOUND_MESSAGE) {
  throw createError({ statusCode: 404, message, statusMessage: 'Kargo bulunamadı.' })
}

function resolveCarrierFromMock(normalized: string, raw: string): CarrierSlug | null {
  const trimmed = raw.trim()

  if (normalized in ARAS_MOCK) return 'aras'
  if (normalized in YURTICI_MOCK) return 'yurtici'
  if (normalized in MNG_MOCK) return 'mng'
  if (trimmed in PTT_MOCK) return 'ptt'
  if (trimmed in TRENDYOL_MOCK) return 'trendyol'
  if (normalized in SURAT_MOCK || trimmed in SURAT_MOCK) return 'surat'
  if (normalized in HEPSIJET_MOCK) return 'hepsijet'
  if (normalized in UPS_MOCK) return 'ups'
  if (normalized in KOLAYGELSIN_MOCK) return 'kolaygelsin'

  return null
}

function isKnownMockNumber(normalized: string, raw: string): boolean {
  return resolveCarrierFromMock(normalized, raw) !== null
}

async function trackByCarrier(normalized: string, raw: string, carrier: CarrierSlug) {
  const trimmed = raw.trim()

  if (carrier === 'aras') {
    const data = ARAS_MOCK[normalized]
    if (!data) notFound()
    const response = await simulateDelay(data, 800)
    return normalizeArasResponse(response as Parameters<typeof normalizeArasResponse>[0])
  }

  if (carrier === 'yurtici') {
    const data = YURTICI_MOCK[normalized]
    if (!data) notFound()
    const response = await simulateDelay(data, 900)
    return normalizeYurticiResponse(response as Parameters<typeof normalizeYurticiResponse>[0])
  }

  if (carrier === 'mng') {
    const data = MNG_MOCK[normalized]
    if (!data) notFound()
    const response = await simulateDelay(data, 1000)
    return normalizeMngResponse(response as Parameters<typeof normalizeMngResponse>[0])
  }

  if (carrier === 'ptt') {
    const data = PTT_MOCK[trimmed]
    if (!data) notFound()
    const response = await simulateDelay(data, 850)
    return normalizePttResponse(response as Parameters<typeof normalizePttResponse>[0])
  }

  if (carrier === 'surat') {
    const data = SURAT_MOCK[normalized] || SURAT_MOCK[trimmed]
    if (!data) notFound()
    const response = await simulateDelay(data, 875)
    return normalizeSuratResponse(response as Parameters<typeof normalizeSuratResponse>[0])
  }

  if (carrier === 'hepsijet') {
    const data = HEPSIJET_MOCK[normalized]
    if (!data) notFound()
    const response = await simulateDelay(data, 880)
    return normalizeHepsijetResponse(response as Parameters<typeof normalizeHepsijetResponse>[0])
  }

  if (carrier === 'ups') {
    const data = UPS_MOCK[normalized]
    if (!data) notFound()
    const response = await simulateDelay(data, 920)
    return normalizeUpsResponse(response as Parameters<typeof normalizeUpsResponse>[0])
  }

  if (carrier === 'kolaygelsin') {
    const data = KOLAYGELSIN_MOCK[normalized]
    if (!data) notFound()
    const response = await simulateDelay(data, 890)
    return normalizeKolaygelsinResponse(response as Parameters<typeof normalizeKolaygelsinResponse>[0])
  }

  const data = TRENDYOL_MOCK[trimmed]
  if (!data) notFound()
  const response = await simulateDelay(data, 950)
  return normalizeTrendyolResponse(response as Parameters<typeof normalizeTrendyolResponse>[0])
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const number = query.number as string

  if (!number?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Lütfen bir takip numarası girin.' })
  }

  const normalized = number.trim().toUpperCase()
  const config = useRuntimeConfig()

  try {
    if (isKnownMockNumber(normalized, number)) {
      const carrier = resolveCarrierFromMock(normalized, number)
      if (!carrier) notFound()
      return trackByCarrier(normalized, number, carrier)
    }

    if (config.public.useAftership) {
      return await fetchFromAfterShip(number.trim())
    }

    notFound()
  }
  catch (error: unknown) {
    if (isError(error)) throw error

    throw createError({
      statusCode: 503,
      statusMessage: 'Kargo servisine ulaşılamadı. Lütfen daha sonra tekrar deneyin.',
    })
  }
})
