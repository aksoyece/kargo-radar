# Kargo Radar

Farklı kargo firmalarına ait gönderilerin tek bir uygulama üzerinden takip edilebildiği kargo takip uygulaması.

- **Canlı:** https://kargo-radar.vercel.app
- **Repo:** https://github.com/aksoyece/kargo-radar

## Teknolojiler

- **Nuxt.js 4** + **Vue.js 3**
- **Bootstrap 5**
- **PWA** (ana ekrana eklenebilir)
- **Koyu / açık tema**
- **Pinia** (state yönetimi)
- **LocalStorage** (arama geçmişi)
- **AfterShip Tracking API** (gerçek kargo verisi)

## Kurulum

```bash
npm install
cp .env.example .env
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

## Demo Takip Numaraları (Mock Mod)

| Firma | Takip Numarası |
|-------|----------------|
| Aras Kargo | `ARS123456789` |
| Yurtiçi Kargo | `YRT987654321` |
| Sürat Kargo | `7240436855704001` |
| HepsiJet | `HPS345678901` |
| UPS | `UPS9876543210` |
| Kolay Gelsin | `KOL112233445` |

## AfterShip Entegrasyonu

Gerçek kargo verileri için [AfterShip Tracking API](https://www.aftership.com/docs/tracking/quickstart/api-quick-start) kullanılır.

1. [AfterShip](https://www.aftership.com/) hesabı oluşturun
2. [API anahtarı](https://organization.automizely.com/api-keys) alın
3. `.env` dosyasını yapılandırın:

```env
NUXT_PUBLIC_USE_AFTERSHIP=true
AFTERSHIP_API_KEY=your_api_key_here
```

### API Akışı

AfterShip quick start dokümantasyonuna uygun olarak:

1. `GET /trackings?tracking_numbers=` — mevcut kayıt aranır
2. `POST /couriers/detect` — kargo firması otomatik tespit edilir
3. `POST /trackings` — yeni takip kaydı oluşturulur
4. Yanıt `aftershipAdapter.ts` ile ortak formata dönüştürülür

- **Base URL:** `https://api.aftership.com/tracking/2026-07`
- **Kimlik doğrulama:** `as-api-key` header'ı

## Mimari

Uygulama, farklı kaynaklardan gelen verileri ortak `NormalizedShipment` formatına dönüştürür:

| Kaynak | Response Yapısı |
|--------|-----------------|
| Aras Kargo (mock) | `{ status, city, history[] }` |
| Yurtiçi Kargo (mock) | `{ current_status, location: { city }, movements[] }` |
| MNG Kargo (mock) | `{ data: { shipment, trackingDetails[] } }` |
| AfterShip API | `{ tag, checkpoints[], slug, ... }` |

Adapter katmanları:
- `services/adapters.ts` — mock API'ler
- `services/aftershipAdapter.ts` — AfterShip API
- `server/services/aftership.ts` — AfterShip HTTP istemcisi

## Standart Kargo Durumları

- Hazırlanıyor
- Yolda
- Dağıtım Merkezinde
- Dağıtımda
- Teslim Edildi
- Sorun Oluştu
