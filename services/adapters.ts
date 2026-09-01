import type { NormalizedShipment, ShipmentStatus, TrackingEvent } from '~/types/tracking'
import { formatDateTime, mapArasStatus, mapHepsijetStatus, mapKolaygelsinStatus, mapMngStatus, mapPttStatus, mapSuratStatus, mapTrendyolStatus, mapUpsStatus, mapYurticiStatus } from '~/utils/statusMapper'

interface ArasApiResponse {
  status: string
  city: string
  tracking_no: string
  last_update: string
  history: Array<{
    status: string
    city: string
    date: string
    message: string
  }>
}

interface YurticiApiResponse {
  current_status: string
  location: {
    city: string
    district?: string
  }
  barcode: string
  updated_at: string
  movements: Array<{
    current_status: string
    location: {
      city: string
    }
    timestamp: string
    description: string
  }>
}

interface MngApiResponse {
  data: {
    shipment: {
      consignmentNo: string
      statusCode: string
      statusText: string
      lastLocation: string
      lastUpdateTime: string
    }
    trackingDetails: Array<{
      statusCode: string
      statusDescription: string
      locationName: string
      eventDate: string
    }>
  }
}

const ARAS_DESCRIPTIONS: Record<string, string> = {
  accepted: 'Kargo kabul edildi',
  in_transit: 'Transfer merkezinden ayrıldı',
  at_hub: 'Dağıtım merkezine ulaştı',
  out_for_delivery: 'Dağıtımda',
  delivered: 'Teslim edildi',
  exception: 'Teslimat sorunu oluştu',
}

const YURTICI_DESCRIPTIONS: Record<string, string> = {
  PREPARING: 'Kargo kabul edildi',
  TRANSIT: 'Transfer merkezinden ayrıldı',
  AT_DISTRIBUTION: 'Dağıtım merkezine ulaştı',
  OUT_FOR_DELIVERY: 'Dağıtımda',
  DELIVERED: 'Teslim edildi',
  EXCEPTION: 'Teslimat sorunu oluştu',
}

function toEvent(
  status: ShipmentStatus,
  description: string,
  location: string,
  timestamp: string,
): TrackingEvent {
  return {
    status,
    description,
    location,
    timestamp: formatDateTime(timestamp),
  }
}

export function normalizeArasResponse(data: ArasApiResponse): NormalizedShipment {
  const events: TrackingEvent[] = data.history.map((item) =>
    toEvent(
      mapArasStatus(item.status),
      item.message || ARAS_DESCRIPTIONS[item.status] || item.status,
      item.city,
      item.date,
    ),
  )

  const currentStatus = mapArasStatus(data.status)

  return {
    carrier: 'Aras Kargo',
    carrierSlug: 'aras',
    trackingNumber: data.tracking_no,
    currentStatus,
    currentLocation: data.city,
    lastUpdated: formatDateTime(data.last_update),
    events,
  }
}

export function normalizeYurticiResponse(data: YurticiApiResponse): NormalizedShipment {
  const events: TrackingEvent[] = data.movements.map((item) =>
    toEvent(
      mapYurticiStatus(item.current_status),
      item.description || YURTICI_DESCRIPTIONS[item.current_status] || item.current_status,
      item.location.city,
      item.timestamp,
    ),
  )

  const currentStatus = mapYurticiStatus(data.current_status)

  return {
    carrier: 'Yurtiçi Kargo',
    carrierSlug: 'yurtici',
    trackingNumber: data.barcode,
    currentStatus,
    currentLocation: data.location.city,
    lastUpdated: formatDateTime(data.updated_at),
    events,
  }
}

export function normalizeMngResponse(data: MngApiResponse): NormalizedShipment {
  const shipment = data.data.shipment
  const events: TrackingEvent[] = data.data.trackingDetails.map((item) =>
    toEvent(
      mapMngStatus(item.statusCode),
      item.statusDescription,
      item.locationName,
      item.eventDate,
    ),
  )

  const currentStatus = mapMngStatus(shipment.statusCode)

  return {
    carrier: 'MNG Kargo',
    carrierSlug: 'mng',
    trackingNumber: shipment.consignmentNo,
    currentStatus,
    currentLocation: shipment.lastLocation,
    lastUpdated: formatDateTime(shipment.lastUpdateTime),
    events,
  }
}

interface PttApiResponse {
  sonuc: {
    takipNo: string
    durumKodu: string
    durumAciklama: string
    sonKonum: string
    sonGuncelleme: string
    detaylar: Array<{
      durum: string
      aciklama: string
      yer: string
      tarih: string
    }>
  }
}

interface TrendyolApiResponse {
  shipment: {
    trackingNumber: string
    status: string
    lastLocation: string
    updatedAt: string
  }
  timeline: Array<{
    status: string
    description: string
    location: string
    timestamp: string
  }>
}

export function normalizePttResponse(data: PttApiResponse): NormalizedShipment {
  const result = data.sonuc
  const events: TrackingEvent[] = result.detaylar.map((item) =>
    toEvent(
      mapPttStatus(item.durum),
      item.aciklama,
      item.yer,
      item.tarih,
    ),
  )

  return {
    carrier: 'PTT Kargo',
    carrierSlug: 'ptt',
    trackingNumber: result.takipNo,
    currentStatus: mapPttStatus(result.durumKodu),
    currentLocation: result.sonKonum,
    lastUpdated: formatDateTime(result.sonGuncelleme),
    events,
  }
}

export function normalizeTrendyolResponse(data: TrendyolApiResponse): NormalizedShipment {
  const events: TrackingEvent[] = data.timeline.map((item) =>
    toEvent(
      mapTrendyolStatus(item.status),
      item.description,
      item.location,
      item.timestamp,
    ),
  )

  return {
    carrier: 'Trendyol Express',
    carrierSlug: 'trendyol',
    trackingNumber: data.shipment.trackingNumber,
    currentStatus: mapTrendyolStatus(data.shipment.status),
    currentLocation: data.shipment.lastLocation,
    lastUpdated: formatDateTime(data.shipment.updatedAt),
    events,
  }
}

interface SuratApiResponse {
  response: {
    barcodeNo: string
    lastStatus: string
    lastStatusText: string
    currentBranch: string
    lastUpdate: string
  }
  statusHistory: Array<{
    statusCode: string
    statusText: string
    branchName: string
    actionDate: string
  }>
}

export function normalizeSuratResponse(data: SuratApiResponse): NormalizedShipment {
  const shipment = data.response
  const events: TrackingEvent[] = data.statusHistory.map((item) =>
    toEvent(
      mapSuratStatus(item.statusCode),
      item.statusText,
      item.branchName,
      item.actionDate,
    ),
  )

  return {
    carrier: 'Sürat Kargo',
    carrierSlug: 'surat',
    trackingNumber: shipment.barcodeNo,
    currentStatus: mapSuratStatus(shipment.lastStatus),
    currentLocation: shipment.currentBranch,
    lastUpdated: formatDateTime(shipment.lastUpdate),
    events,
  }
}

interface HepsijetApiResponse {
  current_status: string
  location: { city: string }
  barcode: string
  updated_at: string
  movements: Array<{
    current_status: string
    location: { city: string }
    timestamp: string
    description: string
  }>
}

interface UpsApiResponse {
  trackResponse: {
    shipment: Array<{
      inquiryNumber: string
      package: Array<{
        activity: Array<{
          status: { type: string, description: string }
          location: { address: { city: string } }
          date: string
          time: string
        }>
      }>
    }>
  }
}

interface KolaygelsinApiResponse {
  data: {
    shipment: {
      consignmentNo: string
      statusCode: string
      statusText: string
      lastLocation: string
      lastUpdateTime: string
    }
    trackingDetails: Array<{
      statusCode: string
      statusDescription: string
      locationName: string
      eventDate: string
    }>
  }
}

export function normalizeHepsijetResponse(data: HepsijetApiResponse): NormalizedShipment {
  const events: TrackingEvent[] = data.movements.map((item) =>
    toEvent(
      mapHepsijetStatus(item.current_status),
      item.description,
      item.location.city,
      item.timestamp,
    ),
  )

  return {
    carrier: 'HepsiJet',
    carrierSlug: 'hepsijet',
    trackingNumber: data.barcode,
    currentStatus: mapHepsijetStatus(data.current_status),
    currentLocation: data.location.city,
    lastUpdated: formatDateTime(data.updated_at),
    events,
  }
}

export function normalizeUpsResponse(data: UpsApiResponse): NormalizedShipment {
  const shipment = data.trackResponse.shipment[0]
  const activities = shipment.package[0]?.activity ?? []

  const events: TrackingEvent[] = activities.map((item) => {
    const timestamp = `${item.date}T${item.time}+03:00`
    return toEvent(
      mapUpsStatus(item.status.type),
      item.status.description,
      item.location.address.city,
      timestamp,
    )
  })

  const latest = activities[0]

  return {
    carrier: 'UPS',
    carrierSlug: 'ups',
    trackingNumber: shipment.inquiryNumber,
    currentStatus: latest ? mapUpsStatus(latest.status.type) : 'in_transit',
    currentLocation: latest?.location.address.city ?? '—',
    lastUpdated: latest ? formatDateTime(`${latest.date}T${latest.time}+03:00`) : '—',
    events,
  }
}

export function normalizeKolaygelsinResponse(data: KolaygelsinApiResponse): NormalizedShipment {
  const shipment = data.data.shipment
  const events: TrackingEvent[] = data.data.trackingDetails.map((item) =>
    toEvent(
      mapKolaygelsinStatus(item.statusCode),
      item.statusDescription,
      item.locationName,
      item.eventDate,
    ),
  )

  return {
    carrier: 'Kolay Gelsin',
    carrierSlug: 'kolaygelsin',
    trackingNumber: shipment.consignmentNo,
    currentStatus: mapKolaygelsinStatus(shipment.statusCode),
    currentLocation: shipment.lastLocation,
    lastUpdated: formatDateTime(shipment.lastUpdateTime),
    events,
  }
}
