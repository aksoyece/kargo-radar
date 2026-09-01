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
        date: '2025-08-31T22:10:00+03:00',
        message: 'Transfer merkezinden ayrıldı',
      },
      {
        status: 'accepted',
        city: 'Ankara',
        date: '2025-08-31T14:30:00+03:00',
        message: 'Kargo kabul edildi',
      },
    ],
  },
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
        timestamp: '2025-08-31T20:45:00+03:00',
        description: 'Transfer merkezinden ayrıldı',
      },
      {
        current_status: 'PREPARING',
        location: { city: 'Bursa' },
        timestamp: '2025-08-31T11:00:00+03:00',
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
          eventDate: '2025-08-31T23:40:00+03:00',
        },
        {
          statusCode: '1',
          statusDescription: 'Kargo kabul edildi',
          locationName: 'Konya',
          eventDate: '2025-08-31T16:10:00+03:00',
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
