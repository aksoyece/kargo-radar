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
import { detectCarrier } from '~/utils/statusMapper'
import {
  ARAS_MOCK,
  getArasMockData,
  getHepsijetMockData,
  getKolaygelsinMockData,
  getPttMockData,
  getSuratMockData,
  getTrendyolMockData,
  getUpsMockData,
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

function resolveCarrier(normalized: string, raw: string): CarrierSlug {
  const fromPrefix = detectCarrier(normalized)
  if (fromPrefix) return fromPrefix

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

  if (/^\d+$/.test(normalized)) {
    if (normalized.startsWith('726')) return 'aras'
    if (normalized.startsWith('724')) return 'surat'
    if (normalized.startsWith('733')) return 'trendyol'
    if (normalized.startsWith('734')) return 'ptt'
    if (normalized.startsWith('735')) return 'hepsijet'
    if (normalized.startsWith('729')) return 'kolaygelsin'
  }

  return 'aras'
}

async function trackByCarrier(normalized: string, carrier: CarrierSlug) {
  if (carrier === 'aras') {
    const raw = await simulateDelay(getArasMockData(normalized), 800)
    return normalizeArasResponse(raw as Parameters<typeof normalizeArasResponse>[0])
  }

  if (carrier === 'yurtici') {
    const data = YURTICI_MOCK[normalized]
    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Kargo bulunamadı. Demo için YRT987654321 deneyin.' })
    }
    const raw = await simulateDelay(data, 900)
    return normalizeYurticiResponse(raw as Parameters<typeof normalizeYurticiResponse>[0])
  }

  if (carrier === 'mng') {
    const data = MNG_MOCK[normalized]
    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Kargo bulunamadı. Demo için MNG456789123 deneyin.' })
    }
    const raw = await simulateDelay(data, 1000)
    return normalizeMngResponse(raw as Parameters<typeof normalizeMngResponse>[0])
  }

  if (carrier === 'ptt') {
    const raw = await simulateDelay(getPttMockData(normalized), 850)
    return normalizePttResponse(raw as Parameters<typeof normalizePttResponse>[0])
  }

  if (carrier === 'surat') {
    const raw = await simulateDelay(getSuratMockData(normalized), 875)
    return normalizeSuratResponse(raw as Parameters<typeof normalizeSuratResponse>[0])
  }

  if (carrier === 'hepsijet') {
    const raw = await simulateDelay(getHepsijetMockData(normalized), 880)
    return normalizeHepsijetResponse(raw as Parameters<typeof normalizeHepsijetResponse>[0])
  }

  if (carrier === 'ups') {
    const raw = await simulateDelay(getUpsMockData(normalized), 920)
    return normalizeUpsResponse(raw as Parameters<typeof normalizeUpsResponse>[0])
  }

  if (carrier === 'kolaygelsin') {
    const raw = await simulateDelay(getKolaygelsinMockData(normalized), 890)
    return normalizeKolaygelsinResponse(raw as Parameters<typeof normalizeKolaygelsinResponse>[0])
  }

  const raw = await simulateDelay(getTrendyolMockData(normalized), 950)
  return normalizeTrendyolResponse(raw as Parameters<typeof normalizeTrendyolResponse>[0])
}

function isKnownMockNumber(normalized: string, raw: string): boolean {
  const trimmed = raw.trim()

  return normalized in ARAS_MOCK
    || normalized in YURTICI_MOCK
    || normalized in MNG_MOCK
    || trimmed in PTT_MOCK
    || trimmed in TRENDYOL_MOCK
    || normalized in SURAT_MOCK
    || trimmed in SURAT_MOCK
    || normalized in HEPSIJET_MOCK
    || normalized in UPS_MOCK
    || normalized in KOLAYGELSIN_MOCK
    || detectCarrier(normalized) !== null
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const number = query.number as string
  const slug = query.slug as string | undefined

  if (!number?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Lütfen bir takip numarası girin.' })
  }

  const normalized = number.trim().toUpperCase()
  const config = useRuntimeConfig()

  try {
    const carrier = resolveCarrier(normalized, number)

    if (isKnownMockNumber(normalized, number)) {
      return trackByCarrier(normalized, carrier)
    }

    if (config.public.useAftership) {
      try {
        return await fetchFromAfterShip(number.trim(), slug || carrier)
      }
      catch {
        return trackByCarrier(normalized, carrier)
      }
    }

    return trackByCarrier(normalized, carrier)
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
