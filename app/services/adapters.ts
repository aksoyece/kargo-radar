import type { NormalizedShipment, ShipmentStatus, TrackingEvent } from '~/app/types/tracking'
import { formatDateTime, mapArasStatus, mapMngStatus, mapYurticiStatus } from '~/app/utils/statusMapper'

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
