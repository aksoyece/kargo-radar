import type { NormalizedShipment, ShipmentStatus, TrackingEvent } from '~/types/tracking'
import { formatDateTime } from '~/utils/statusMapper'

export interface AfterShipTracking {
  id?: string
  tracking_number?: string
  slug?: string
  tag?: string
  subtag?: string
  subtag_message?: string
  updated_at?: string
  checkpoints?: AfterShipCheckpoint[]
}

export interface AfterShipCheckpoint {
  tag?: string
  subtag?: string
  subtag_message?: string
  message?: string
  city?: string | null
  location?: string | null
  state?: string | null
  country_region_name?: string | null
  checkpoint_time?: string
}

export interface AfterShipApiEnvelope<T> {
  meta: {
    code: number
    message?: string
    type?: string
  }
  data: T
}

export interface AfterShipApiError {
  meta: {
    code: number
    message?: string
    type?: string
  }
  data?: {
    tracking?: {
      id?: string
      slug?: string
      tracking_number?: string
    }
  }
}

const TAG_STATUS_MAP: Record<string, ShipmentStatus> = {
  Pending: 'preparing',
  InfoReceived: 'preparing',
  InTransit: 'in_transit',
  OutForDelivery: 'out_for_delivery',
  Delivered: 'delivered',
  AttemptFail: 'problem',
  Exception: 'problem',
  AvailableForPickup: 'at_distribution_center',
  Expired: 'problem',
}

const DISTRIBUTION_KEYWORDS = [
  'distribution',
  'facility',
  'hub',
  'depot',
  'sorting',
  'merkez',
]

export function mapAfterShipTag(
  tag?: string,
  subtag?: string,
  message?: string,
): ShipmentStatus {
  if (!tag) return 'in_transit'

  if (tag === 'InTransit') {
    const combined = `${subtag || ''} ${message || ''}`.toLowerCase()
    if (DISTRIBUTION_KEYWORDS.some((keyword) => combined.includes(keyword))) {
      return 'at_distribution_center'
    }
  }

  return TAG_STATUS_MAP[tag] ?? 'in_transit'
}

function formatCarrierName(slug?: string): string {
  if (!slug) return 'Bilinmeyen Kargo'

  const known: Record<string, string> = {
    'aras': 'Aras Kargo',
    'aras-cargo': 'Aras Kargo',
    'yurtici-kargo': 'Yurtiçi Kargo',
    'mng-kargo': 'MNG Kargo',
    'ptt-kargo': 'PTT Kargo',
    'surat-kargo': 'Sürat Kargo',
    'ups': 'UPS',
    'fedex': 'FedEx',
    'dhl': 'DHL',
  }

  return known[slug] ?? slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function resolveLocation(checkpoint: AfterShipCheckpoint): string {
  return (
    checkpoint.city
    || checkpoint.location
    || checkpoint.state
    || checkpoint.country_region_name
    || '—'
  )
}

function toEvent(checkpoint: AfterShipCheckpoint): TrackingEvent {
  const status = mapAfterShipTag(
    checkpoint.tag,
    checkpoint.subtag,
    checkpoint.message || checkpoint.subtag_message,
  )

  return {
    status,
    description: checkpoint.message || checkpoint.subtag_message || 'Durum güncellendi',
    location: resolveLocation(checkpoint),
    timestamp: formatDateTime(checkpoint.checkpoint_time || ''),
  }
}

export function normalizeAfterShipTracking(tracking: AfterShipTracking): NormalizedShipment {
  const checkpoints = [...(tracking.checkpoints || [])].sort((a, b) => {
    const timeA = new Date(a.checkpoint_time || 0).getTime()
    const timeB = new Date(b.checkpoint_time || 0).getTime()
    return timeB - timeA
  })

  const latestCheckpoint = checkpoints[0]
  const currentStatus = mapAfterShipTag(
    tracking.tag || latestCheckpoint?.tag,
    tracking.subtag || latestCheckpoint?.subtag,
    tracking.subtag_message || latestCheckpoint?.message,
  )

  const currentLocation = latestCheckpoint
    ? resolveLocation(latestCheckpoint)
    : '—'

  return {
    carrier: formatCarrierName(tracking.slug),
    carrierSlug: tracking.slug || 'unknown',
    trackingNumber: tracking.tracking_number || '',
    currentStatus,
    currentLocation,
    lastUpdated: formatDateTime(tracking.updated_at || latestCheckpoint?.checkpoint_time || ''),
    events: checkpoints.map(toEvent),
  }
}
