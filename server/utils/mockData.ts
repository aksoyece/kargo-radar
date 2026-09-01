export const ARAS_MOCK: Record<string, object> = {
  ARS123456789: {
    status: 'out_for_delivery',
    city: 'İstanbul',
    tracking_no: 'ARS123456789',
    last_update: '2026-09-01T09:42:00+03:00',
    history: [
      {
        status: 'out_for_delivery',
        city: 'İstanbul',
        date: '2026-09-01T09:42:00+03:00',
        message: 'Dağıtımda',
      },
      {
        status: 'at_hub',
        city: 'İstanbul',
        date: '2026-09-01T06:15:00+03:00',
        message: 'Dağıtım merkezine ulaştı',
      },
      {
        status: 'in_transit',
        city: 'Ankara',
        date: '2026-08-31T22:10:00+03:00',
        message: 'Transfer merkezinden ayrıldı',
      },
      {
        status: 'accepted',
        city: 'Ankara',
        date: '2026-08-31T14:30:00+03:00',
        message: 'Kargo kabul edildi',
      },
    ],
  },
  '7260036143471499': {
    status: 'delivered',
    city: 'Teslim Adresi',
    tracking_no: '7260036143471499',
    last_update: '2026-08-22T14:30:00+03:00',
    history: [
      {
        status: 'delivered',
        city: 'Teslim Adresi',
        date: '2026-08-22T14:30:00+03:00',
        message: 'Teslim edildi',
      },
      {
        status: 'out_for_delivery',
        city: 'Dağıtım Şubesi',
        date: '2026-08-22T09:15:00+03:00',
        message: 'Dağıtımda',
      },
      {
        status: 'at_hub',
        city: 'Varış Şubesi',
        date: '2026-08-21T18:40:00+03:00',
        message: 'Dağıtım merkezine ulaştı',
      },
      {
        status: 'in_transit',
        city: 'Transfer Merkezi',
        date: '2026-08-20T23:10:00+03:00',
        message: 'Transfer merkezinden ayrıldı',
      },
      {
        status: 'accepted',
        city: 'Çıkış Şubesi',
        date: '2026-08-20T11:20:00+03:00',
        message: 'Kargo kabul edildi',
      },
    ],
  },
}

function hashTrackingNumber(trackingNumber: string): number {
  let hash = 0
  for (const char of trackingNumber) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0)
    hash |= 0
  }
  return Math.abs(hash)
}

function toTurkeyIso(year: number, month: number, day: number, hour: number, minute: number): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+03:00`
}

export function createArasDeliveredMock(trackingNumber: string) {
  const hash = hashTrackingNumber(trackingNumber)

  // Her numara için sabit, 2026 içinde gerçekçi teslim tarihi
  const deliveryMonth = 1 + (hash % 8) // Ocak–Ağustos 2026
  const deliveryDay = 1 + ((hash >> 3) % 28)
  const deliveryHour = 10 + (hash % 8)
  const deliveryMinute = (hash % 4) * 15

  const delivered = toTurkeyIso(2026, deliveryMonth, deliveryDay, deliveryHour, deliveryMinute)
  const outForDelivery = toTurkeyIso(2026, deliveryMonth, deliveryDay, Math.max(8, deliveryHour - 5), deliveryMinute)
  const atHub = toTurkeyIso(2026, deliveryMonth, Math.max(1, deliveryDay - 1), 18, 40)
  const inTransit = toTurkeyIso(2026, deliveryMonth, Math.max(1, deliveryDay - 2), 23, 10)
  const accepted = toTurkeyIso(2026, deliveryMonth, Math.max(1, deliveryDay - 3), 11, 20)

  return {
    status: 'delivered',
    city: 'Teslim Adresi',
    tracking_no: trackingNumber,
    last_update: delivered,
    history: [
      {
        status: 'delivered',
        city: 'Teslim Adresi',
        date: delivered,
        message: 'Teslim edildi',
      },
      {
        status: 'out_for_delivery',
        city: 'Dağıtım Şubesi',
        date: outForDelivery,
        message: 'Dağıtımda',
      },
      {
        status: 'at_hub',
        city: 'Varış Şubesi',
        date: atHub,
        message: 'Dağıtım merkezine ulaştı',
      },
      {
        status: 'in_transit',
        city: 'Transfer Merkezi',
        date: inTransit,
        message: 'Transfer merkezinden ayrıldı',
      },
      {
        status: 'accepted',
        city: 'Çıkış Şubesi',
        date: accepted,
        message: 'Kargo kabul edildi',
      },
    ],
  }
}

export function getArasMockData(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  return ARAS_MOCK[normalized] || createArasDeliveredMock(normalized)
}

function buildDeliveredDates(trackingNumber: string) {
  const hash = hashTrackingNumber(trackingNumber)
  const deliveryMonth = 1 + (hash % 8)
  const deliveryDay = 1 + ((hash >> 3) % 28)
  const deliveryHour = 10 + (hash % 8)
  const deliveryMinute = (hash % 4) * 15

  return {
    delivered: toTurkeyIso(2026, deliveryMonth, deliveryDay, deliveryHour, deliveryMinute),
    outForDelivery: toTurkeyIso(2026, deliveryMonth, deliveryDay, Math.max(8, deliveryHour - 5), deliveryMinute),
    atHub: toTurkeyIso(2026, deliveryMonth, Math.max(1, deliveryDay - 1), 18, 40),
    inTransit: toTurkeyIso(2026, deliveryMonth, Math.max(1, deliveryDay - 2), 23, 10),
    accepted: toTurkeyIso(2026, deliveryMonth, Math.max(1, deliveryDay - 3), 11, 20),
  }
}

export function createPttDeliveredMock(trackingNumber: string) {
  const dates = buildDeliveredDates(trackingNumber)

  return {
    sonuc: {
      takipNo: trackingNumber,
      durumKodu: 'TESLIM',
      durumAciklama: 'Teslim Edildi',
      sonKonum: 'Teslim Adresi',
      sonGuncelleme: dates.delivered,
      detaylar: [
        { durum: 'TESLIM', aciklama: 'Teslim edildi', yer: 'Teslim Adresi', tarih: dates.delivered },
        { durum: 'DAGITIMDA', aciklama: 'Dağıtımda', yer: 'Dağıtım Şubesi', tarih: dates.outForDelivery },
        { durum: 'MERKEZDE', aciklama: 'Dağıtım merkezine ulaştı', yer: 'Varış Şubesi', tarih: dates.atHub },
        { durum: 'YOLDA', aciklama: 'Transfer merkezinden ayrıldı', yer: 'Transfer Merkezi', tarih: dates.inTransit },
        { durum: 'HAZIRLANIYOR', aciklama: 'Kargo kabul edildi', yer: 'Çıkış Şubesi', tarih: dates.accepted },
      ],
    },
  }
}

export function createTrendyolDeliveredMock(trackingNumber: string) {
  const dates = buildDeliveredDates(trackingNumber)

  return {
    shipment: {
      trackingNumber,
      status: 'DELIVERED',
      lastLocation: 'Teslim Adresi',
      updatedAt: dates.delivered,
    },
    timeline: [
      { status: 'DELIVERED', description: 'Teslim edildi', location: 'Teslim Adresi', timestamp: dates.delivered },
      { status: 'OUT_FOR_DELIVERY', description: 'Dağıtımda', location: 'Dağıtım Şubesi', timestamp: dates.outForDelivery },
      { status: 'AT_HUB', description: 'Dağıtım merkezine ulaştı', location: 'Varış Şubesi', timestamp: dates.atHub },
      { status: 'IN_TRANSIT', description: 'Transfer merkezinden ayrıldı', location: 'Transfer Merkezi', timestamp: dates.inTransit },
      { status: 'PREPARING', description: 'Kargo kabul edildi', location: 'Çıkış Şubesi', timestamp: dates.accepted },
    ],
  }
}

export const PTT_MOCK: Record<string, object> = {
  '7340033913597705': {
    sonuc: {
      takipNo: '7340033913597705',
      durumKodu: 'TESLIM',
      durumAciklama: 'Teslim Edildi',
      sonKonum: 'Teslim Adresi',
      sonGuncelleme: '2026-08-15T13:20:00+03:00',
      detaylar: [
        { durum: 'TESLIM', aciklama: 'Teslim edildi', yer: 'Teslim Adresi', tarih: '2026-08-15T13:20:00+03:00' },
        { durum: 'DAGITIMDA', aciklama: 'Dağıtımda', yer: 'PTT Dağıtım', tarih: '2026-08-15T09:00:00+03:00' },
        { durum: 'MERKEZDE', aciklama: 'Dağıtım merkezine ulaştı', yer: 'PTT Merkez', tarih: '2026-08-14T17:30:00+03:00' },
        { durum: 'HAZIRLANIYOR', aciklama: 'Kargo kabul edildi', yer: 'PTT Şubesi', tarih: '2026-08-14T10:15:00+03:00' },
      ],
    },
  },
}

export const TRENDYOL_MOCK: Record<string, object> = {
  '7330035301373796': {
    shipment: {
      trackingNumber: '7330035301373796',
      status: 'DELIVERED',
      lastLocation: 'Teslim Adresi',
      updatedAt: '2026-08-04T15:45:00+03:00',
    },
    timeline: [
      { status: 'DELIVERED', description: 'Teslim edildi', location: 'Teslim Adresi', timestamp: '2026-08-04T15:45:00+03:00' },
      { status: 'OUT_FOR_DELIVERY', description: 'Dağıtımda', location: 'Trendyol Dağıtım', timestamp: '2026-08-04T10:30:00+03:00' },
      { status: 'AT_HUB', description: 'Dağıtım merkezine ulaştı', location: 'İstanbul Hub', timestamp: '2026-08-03T19:10:00+03:00' },
      { status: 'IN_TRANSIT', description: 'Yolda', location: 'Transfer Merkezi', timestamp: '2026-08-03T08:20:00+03:00' },
      { status: 'PREPARING', description: 'Kargo kabul edildi', location: 'Depo', timestamp: '2026-08-02T14:00:00+03:00' },
    ],
  },
}

export function getPttMockData(trackingNumber: string) {
  const normalized = trackingNumber.trim()
  return PTT_MOCK[normalized] || createPttDeliveredMock(normalized)
}

export function getTrendyolMockData(trackingNumber: string) {
  const normalized = trackingNumber.trim()
  return TRENDYOL_MOCK[normalized] || createTrendyolDeliveredMock(normalized)
}

export function createSuratDeliveredMock(trackingNumber: string) {
  const dates = buildDeliveredDates(trackingNumber)

  return {
    response: {
      barcodeNo: trackingNumber,
      lastStatus: '5',
      lastStatusText: 'Teslim Edildi',
      currentBranch: 'Teslim Adresi',
      lastUpdate: dates.delivered,
    },
    statusHistory: [
      { statusCode: '5', statusText: 'Teslim edildi', branchName: 'Teslim Adresi', actionDate: dates.delivered },
      { statusCode: '4', statusText: 'Dağıtımda', branchName: 'Sürat Dağıtım', actionDate: dates.outForDelivery },
      { statusCode: '3', statusText: 'Dağıtım merkezine ulaştı', branchName: 'Varış Şubesi', actionDate: dates.atHub },
      { statusCode: '2', statusText: 'Transfer merkezinden ayrıldı', branchName: 'Transfer Merkezi', actionDate: dates.inTransit },
      { statusCode: '1', statusText: 'Kargo kabul edildi', branchName: 'Çıkış Şubesi', actionDate: dates.accepted },
    ],
  }
}

export const SURAT_MOCK: Record<string, object> = {
  SRT567891234: {
    response: {
      barcodeNo: 'SRT567891234',
      lastStatus: '4',
      lastStatusText: 'Dağıtımda',
      currentBranch: 'Bursa',
      lastUpdate: '2026-09-01T11:30:00+03:00',
    },
    statusHistory: [
      { statusCode: '4', statusText: 'Dağıtımda', branchName: 'Bursa', actionDate: '2026-09-01T11:30:00+03:00' },
      { statusCode: '3', statusText: 'Dağıtım merkezine ulaştı', branchName: 'Bursa', actionDate: '2026-09-01T07:45:00+03:00' },
      { statusCode: '2', statusText: 'Transfer merkezinden ayrıldı', branchName: 'Ankara', actionDate: '2026-08-31T21:20:00+03:00' },
      { statusCode: '1', statusText: 'Kargo kabul edildi', branchName: 'Ankara', actionDate: '2026-08-31T13:10:00+03:00' },
    ],
  },
  '7240436855704001': {
    response: {
      barcodeNo: '7240436855704001',
      lastStatus: '5',
      lastStatusText: 'Teslim Edildi',
      currentBranch: 'Teslim Adresi',
      lastUpdate: '2026-08-28T16:10:00+03:00',
    },
    statusHistory: [
      { statusCode: '5', statusText: 'Teslim edildi', branchName: 'Teslim Adresi', actionDate: '2026-08-28T16:10:00+03:00' },
      { statusCode: '4', statusText: 'Dağıtımda', branchName: 'Sürat Dağıtım', actionDate: '2026-08-28T10:25:00+03:00' },
      { statusCode: '3', statusText: 'Dağıtım merkezine ulaştı', branchName: 'Varış Şubesi', actionDate: '2026-08-27T19:00:00+03:00' },
      { statusCode: '2', statusText: 'Transfer merkezinden ayrıldı', branchName: 'Transfer Merkezi', actionDate: '2026-08-27T08:40:00+03:00' },
      { statusCode: '1', statusText: 'Kargo kabul edildi', branchName: 'Çıkış Şubesi', actionDate: '2026-08-26T14:30:00+03:00' },
    ],
  },
}

export function getSuratMockData(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  return SURAT_MOCK[normalized] || SURAT_MOCK[trackingNumber.trim()] || createSuratDeliveredMock(trackingNumber.trim())
}

export const YURTICI_MOCK: Record<string, object> = {
  YRT987654321: {
    current_status: 'OUT_FOR_DELIVERY',
    location: {
      city: 'İzmir',
      district: 'Konak',
    },
    barcode: 'YRT987654321',
    updated_at: '2026-09-01T10:15:00+03:00',
    movements: [
      {
        current_status: 'OUT_FOR_DELIVERY',
        location: { city: 'İzmir' },
        timestamp: '2026-09-01T10:15:00+03:00',
        description: 'Dağıtımda',
      },
      {
        current_status: 'AT_DISTRIBUTION',
        location: { city: 'İzmir' },
        timestamp: '2026-09-01T07:30:00+03:00',
        description: 'Dağıtım merkezine ulaştı',
      },
      {
        current_status: 'TRANSIT',
        location: { city: 'Bursa' },
        timestamp: '2026-08-31T20:45:00+03:00',
        description: 'Transfer merkezinden ayrıldı',
      },
      {
        current_status: 'PREPARING',
        location: { city: 'Bursa' },
        timestamp: '2026-08-31T11:00:00+03:00',
        description: 'Kargo kabul edildi',
      },
    ],
  },
}

export const MNG_MOCK: Record<string, object> = {
  MNG456789123: {
    data: {
      shipment: {
        consignmentNo: 'MNG456789123',
        statusCode: '4',
        statusText: 'Dağıtımda',
        lastLocation: 'Antalya',
        lastUpdateTime: '2026-09-01T08:55:00+03:00',
      },
      trackingDetails: [
        {
          statusCode: '4',
          statusDescription: 'Dağıtımda',
          locationName: 'Antalya',
          eventDate: '2026-09-01T08:55:00+03:00',
        },
        {
          statusCode: '3',
          statusDescription: 'Dağıtım merkezine ulaştı',
          locationName: 'Antalya',
          eventDate: '2026-09-01T05:20:00+03:00',
        },
        {
          statusCode: '2',
          statusDescription: 'Transfer merkezinden ayrıldı',
          locationName: 'Konya',
          eventDate: '2026-08-31T23:40:00+03:00',
        },
        {
          statusCode: '1',
          statusDescription: 'Kargo kabul edildi',
          locationName: 'Konya',
          eventDate: '2026-08-31T16:10:00+03:00',
        },
      ],
    },
  },
}

export function simulateDelay<T>(data: T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms)
  })
}

export function createHepsijetDeliveredMock(trackingNumber: string) {
  const dates = buildDeliveredDates(trackingNumber)

  return {
    current_status: 'DELIVERED',
    location: { city: 'Teslim Adresi' },
    barcode: trackingNumber,
    updated_at: dates.delivered,
    movements: [
      { current_status: 'DELIVERED', location: { city: 'Teslim Adresi' }, timestamp: dates.delivered, description: 'Teslim edildi' },
      { current_status: 'OUT_FOR_DELIVERY', location: { city: 'Dağıtım Şubesi' }, timestamp: dates.outForDelivery, description: 'Dağıtımda' },
      { current_status: 'AT_DISTRIBUTION', location: { city: 'Varış Şubesi' }, timestamp: dates.atHub, description: 'Dağıtım merkezine ulaştı' },
      { current_status: 'TRANSIT', location: { city: 'Transfer Merkezi' }, timestamp: dates.inTransit, description: 'Transfer merkezinden ayrıldı' },
      { current_status: 'PREPARING', location: { city: 'Çıkış Şubesi' }, timestamp: dates.accepted, description: 'Kargo kabul edildi' },
    ],
  }
}

export const HEPSIJET_MOCK: Record<string, object> = {
  HPS345678901: {
    current_status: 'TRANSIT',
    location: { city: 'Eskişehir' },
    barcode: 'HPS345678901',
    updated_at: '2026-09-01T12:05:00+03:00',
    movements: [
      { current_status: 'TRANSIT', location: { city: 'Eskişehir' }, timestamp: '2026-09-01T12:05:00+03:00', description: 'Transfer merkezinden ayrıldı' },
      { current_status: 'AT_DISTRIBUTION', location: { city: 'Ankara' }, timestamp: '2026-09-01T06:40:00+03:00', description: 'Dağıtım merkezine ulaştı' },
      { current_status: 'PREPARING', location: { city: 'Ankara' }, timestamp: '2026-08-31T15:20:00+03:00', description: 'Kargo kabul edildi' },
    ],
  },
}

export function getHepsijetMockData(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  return HEPSIJET_MOCK[normalized] || createHepsijetDeliveredMock(normalized)
}

export function createUpsDeliveredMock(trackingNumber: string) {
  const dates = buildDeliveredDates(trackingNumber)

  return {
    trackResponse: {
      shipment: [{
        inquiryNumber: trackingNumber,
        package: [{
          activity: [
            { status: { type: 'D', description: 'Teslim edildi' }, location: { address: { city: 'Teslim Adresi' } }, date: dates.delivered.slice(0, 10), time: dates.delivered.slice(11, 19) },
            { status: { type: 'O', description: 'Dağıtımda' }, location: { address: { city: 'Dağıtım Şubesi' } }, date: dates.outForDelivery.slice(0, 10), time: dates.outForDelivery.slice(11, 19) },
            { status: { type: 'X', description: 'Dağıtım merkezine ulaştı' }, location: { address: { city: 'Varış Şubesi' } }, date: dates.atHub.slice(0, 10), time: dates.atHub.slice(11, 19) },
            { status: { type: 'I', description: 'Yolda' }, location: { address: { city: 'Transfer Merkezi' } }, date: dates.inTransit.slice(0, 10), time: dates.inTransit.slice(11, 19) },
            { status: { type: 'M', description: 'Kargo kabul edildi' }, location: { address: { city: 'Çıkış Şubesi' } }, date: dates.accepted.slice(0, 10), time: dates.accepted.slice(11, 19) },
          ],
        }],
      }],
    },
  }
}

export const UPS_MOCK: Record<string, object> = {
  UPS9876543210: {
    trackResponse: {
      shipment: [{
        inquiryNumber: 'UPS9876543210',
        package: [{
          activity: [
            { status: { type: 'X', description: 'Dağıtım merkezine ulaştı' }, location: { address: { city: 'İstanbul' } }, date: '2026-09-01', time: '08:30:00' },
            { status: { type: 'I', description: 'Yolda' }, location: { address: { city: 'Gebze' } }, date: '2026-08-31', time: '22:15:00' },
            { status: { type: 'M', description: 'Kargo kabul edildi' }, location: { address: { city: 'Gebze' } }, date: '2026-08-31', time: '14:00:00' },
          ],
        }],
      }],
    },
  },
}

export function getUpsMockData(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  return UPS_MOCK[normalized] || createUpsDeliveredMock(normalized)
}

export function createKolaygelsinDeliveredMock(trackingNumber: string) {
  const dates = buildDeliveredDates(trackingNumber)

  return {
    data: {
      shipment: {
        consignmentNo: trackingNumber,
        statusCode: '5',
        statusText: 'Teslim Edildi',
        lastLocation: 'Teslim Adresi',
        lastUpdateTime: dates.delivered,
      },
      trackingDetails: [
        { statusCode: '5', statusDescription: 'Teslim edildi', locationName: 'Teslim Adresi', eventDate: dates.delivered },
        { statusCode: '4', statusDescription: 'Dağıtımda', locationName: 'Dağıtım Şubesi', eventDate: dates.outForDelivery },
        { statusCode: '3', statusDescription: 'Dağıtım merkezine ulaştı', locationName: 'Varış Şubesi', eventDate: dates.atHub },
        { statusCode: '2', statusDescription: 'Transfer merkezinden ayrıldı', locationName: 'Transfer Merkezi', eventDate: dates.inTransit },
        { statusCode: '1', statusDescription: 'Kargo kabul edildi', locationName: 'Çıkış Şubesi', eventDate: dates.accepted },
      ],
    },
  }
}

export const KOLAYGELSIN_MOCK: Record<string, object> = {
  KOL112233445: {
    data: {
      shipment: {
        consignmentNo: 'KOL112233445',
        statusCode: '1',
        statusText: 'Hazırlanıyor',
        lastLocation: 'Adana',
        lastUpdateTime: '2026-09-01T07:10:00+03:00',
      },
      trackingDetails: [
        { statusCode: '1', statusDescription: 'Kargo kabul edildi', locationName: 'Adana', eventDate: '2026-09-01T07:10:00+03:00' },
      ],
    },
  },
}

export function getKolaygelsinMockData(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  return KOLAYGELSIN_MOCK[normalized] || createKolaygelsinDeliveredMock(normalized)
}
