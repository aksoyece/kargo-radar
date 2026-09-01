import type { CarrierSlug, ShipmentStatus } from '~/types/tracking'

const ARAS_STATUS_MAP: Record<string, ShipmentStatus> = {
  accepted: 'preparing',
  in_transit: 'in_transit',
  at_hub: 'at_distribution_center',
  out_for_delivery: 'out_for_delivery',
  delivered: 'delivered',
  exception: 'problem',
}

const YURTICI_STATUS_MAP: Record<string, ShipmentStatus> = {
  PREPARING: 'preparing',
  TRANSIT: 'in_transit',
  AT_DISTRIBUTION: 'at_distribution_center',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  EXCEPTION: 'problem',
}

const MNG_STATUS_MAP: Record<string, ShipmentStatus> = {
  '1': 'preparing',
  '2': 'in_transit',
  '3': 'at_distribution_center',
  '4': 'out_for_delivery',
  '5': 'delivered',
  '9': 'problem',
}

export function mapArasStatus(status: string): ShipmentStatus {
  return ARAS_STATUS_MAP[status] ?? 'in_transit'
}

export function mapYurticiStatus(status: string): ShipmentStatus {
  return YURTICI_STATUS_MAP[status] ?? 'in_transit'
}

export function mapMngStatus(code: string): ShipmentStatus {
  return MNG_STATUS_MAP[code] ?? 'in_transit'
}

const PTT_STATUS_MAP: Record<string, ShipmentStatus> = {
  HAZIRLANIYOR: 'preparing',
  YOLDA: 'in_transit',
  MERKEZDE: 'at_distribution_center',
  DAGITIMDA: 'out_for_delivery',
  TESLIM: 'delivered',
  SORUN: 'problem',
}

const TRENDYOL_STATUS_MAP: Record<string, ShipmentStatus> = {
  PREPARING: 'preparing',
  IN_TRANSIT: 'in_transit',
  AT_HUB: 'at_distribution_center',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  EXCEPTION: 'problem',
}

export function mapPttStatus(status: string): ShipmentStatus {
  return PTT_STATUS_MAP[status] ?? 'in_transit'
}

export function mapTrendyolStatus(status: string): ShipmentStatus {
  return TRENDYOL_STATUS_MAP[status] ?? 'in_transit'
}

const SURAT_STATUS_MAP: Record<string, ShipmentStatus> = {
  '1': 'preparing',
  '2': 'in_transit',
  '3': 'at_distribution_center',
  '4': 'out_for_delivery',
  '5': 'delivered',
  '9': 'problem',
}

export function mapSuratStatus(code: string): ShipmentStatus {
  return SURAT_STATUS_MAP[code] ?? 'in_transit'
}

export function detectCarrier(trackingNumber: string): CarrierSlug | null {
  const normalized = trackingNumber.trim().toUpperCase()

  if (normalized.startsWith('ARS')) return 'aras'
  if (normalized.startsWith('YRT')) return 'yurtici'
  if (normalized.startsWith('MNG')) return 'mng'
  if (normalized.startsWith('SRT')) return 'surat'

  return null
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
