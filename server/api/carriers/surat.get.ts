import { getSuratMockData, simulateDelay } from '../../utils/mockData'

export default defineEventHandler((event) => {
  const number = getQuery(event).number as string

  if (!number) {
    throw createError({ statusCode: 400, statusMessage: 'Takip numarası gerekli.' })
  }

  const normalized = number.trim().toUpperCase()
  const data = getSuratMockData(normalized)

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Kargo bulunamadı.' })
  }

  return simulateDelay(data, 875)
})
