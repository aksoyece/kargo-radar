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

export type CarrierSlug =
  | 'aras'
  | 'yurtici'
  | 'mng'
  | 'ptt'
  | 'trendyol'
  | 'surat'
  | 'hepsijet'
  | 'ups'
  | 'kolaygelsin'

export interface CarrierInfo {
  slug: CarrierSlug
  name: string
  prefix: string
}

export const CARRIERS: CarrierInfo[] = [
  { slug: 'aras', name: 'Aras Kargo', prefix: 'ARS' },
  { slug: 'yurtici', name: 'Yurtiçi Kargo', prefix: 'YRT' },
  { slug: 'mng', name: 'MNG Kargo', prefix: 'MNG' },
  { slug: 'ptt', name: 'PTT Kargo', prefix: 'PTT' },
  { slug: 'trendyol', name: 'Trendyol Express', prefix: 'TY' },
  { slug: 'surat', name: 'Sürat Kargo', prefix: 'SRT' },
  { slug: 'hepsijet', name: 'HepsiJet', prefix: 'HPS' },
  { slug: 'ups', name: 'UPS', prefix: 'UPS' },
  { slug: 'kolaygelsin', name: 'Kolay Gelsin', prefix: 'KOL' },
]

export const CARRIER_COUNT = CARRIERS.length

export interface DemoTracking {
  label: string
  number: string
  hint?: string
}

export const DEMO_TRACKINGS: DemoTracking[] = [
  { label: 'Aras Kargo', number: 'ARS123456789', hint: 'Dağıtımda' },
  { label: 'Yurtiçi Kargo', number: 'YRT987654321', hint: 'Dağıtımda' },
  { label: 'MNG Kargo', number: 'MNG456789123', hint: 'Dağıtımda' },
  { label: 'Sürat Kargo', number: '7240436855704001', hint: 'Teslim edildi' },
  { label: 'PTT Kargo', number: '7340033913597705', hint: 'Teslim edildi' },
  { label: 'Trendyol Express', number: '7330035301373796', hint: 'Teslim edildi' },
  { label: 'HepsiJet', number: 'HPS345678901', hint: 'Yolda' },
  { label: 'UPS', number: 'UPS9876543210', hint: 'Dağıtım merkezinde' },
  { label: 'Kolay Gelsin', number: 'KOL112233445', hint: 'Hazırlanıyor' },
  { label: 'Aras Kargo', number: 'ARS888777666', hint: 'Sorun oluştu' },
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
