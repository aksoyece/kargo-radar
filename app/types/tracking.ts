export type ShipmentStatus =
  | 'preparing'
  | 'in_transit'
  | 'at_distribution_center'
  | 'out_for_delivery'
  | 'delivered'
  | 'problem'

export interface TrackingEvent {
  status: ShipmentStatus
  description: string
  location: string
  timestamp: string
}

export interface NormalizedShipment {
  carrier: string
  carrierSlug: string
  trackingNumber: string
  currentStatus: ShipmentStatus
  currentLocation: string
  lastUpdated: string
  events: TrackingEvent[]
}

export interface SearchHistoryItem {
  trackingNumber: string
  carrier: string
  currentStatus: ShipmentStatus
  searchedAt: string
}

export type CarrierSlug = 'aras' | 'yurtici' | 'mng'

export interface CarrierInfo {
  slug: CarrierSlug
  name: string
  prefix: string
}

export const CARRIERS: CarrierInfo[] = [
  { slug: 'aras', name: 'Aras Kargo', prefix: 'ARS' },
  { slug: 'yurtici', name: 'Yurtiçi Kargo', prefix: 'YRT' },
  { slug: 'mng', name: 'MNG Kargo', prefix: 'MNG' },
]

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  preparing: 'Hazırlanıyor',
  in_transit: 'Yolda',
  at_distribution_center: 'Dağıtım Merkezinde',
  out_for_delivery: 'Dağıtımda',
  delivered: 'Teslim Edildi',
  problem: 'Sorun Oluştu',
}

export const STATUS_ICONS: Record<ShipmentStatus, string> = {
  preparing: '📦',
  in_transit: '🚛',
  at_distribution_center: '🏢',
  out_for_delivery: '🚚',
  delivered: '✅',
  problem: '⚠️',
}
