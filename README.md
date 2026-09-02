# Kargo Radar

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?style=flat&logo=nuxtdotjs&logoColor=white)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=flat&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-kargo--radar.vercel.app-2563eb?style=flat)](https://kargo-radar.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-kargo--radar-181717?style=flat&logo=github&logoColor=white)](https://github.com/aksoyece/kargo-radar)

Farklı kargo firmalarına ait gönderilerin tek bir uygulama üzerinden takip edilebildiği kargo takip uygulaması. **9 kargo firması** desteklenir; farklı API formatları ortak bir yapıya dönüştürülür.

## Desteklenen Firmalar

Aras Kargo · Yurtiçi Kargo · MNG Kargo · PTT Kargo · Trendyol Express · Sürat Kargo · HepsiJet · UPS · Kolay Gelsin

## Ekran Görüntüleri

**Ana sayfa** — arama formu, demo numaraları ve arama geçmişi:

![Kargo Radar ana sayfa](docs/screenshot-home.png)

**Takip sonucu** — durum kartı, konum bilgisi ve emoji ikonlu timeline:

![Kargo Radar takip sonucu](docs/screenshot-tracking.png)

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

| Firma | Takip Numarası | Örnek Durum |
|-------|----------------|-------------|
| Aras Kargo | `ARS123456789` | Dağıtımda |
| Yurtiçi Kargo | `YRT987654321` | Dağıtımda |
| MNG Kargo | `MNG456789123` | Dağıtımda |
| Sürat Kargo | `7240436855704001` | Teslim edildi |
| PTT Kargo | `7340033913597705` | Teslim edildi |
| Trendyol Express | `7330035301373796` | Teslim edildi |
| HepsiJet | `HPS345678901` | Yolda |
| UPS | `UPS9876543210` | Dağıtım merkezinde |
| Kolay Gelsin | `KOL112233445` | Hazırlanıyor |
| Aras Kargo (sorun) | `ARS888777666` | Sorun oluştu |

## AfterShip Entegrasyonu

Gerçek kargo verileri için [AfterShip Tracking API](https://www.aftership.com/docs/tracking/quickstart/api-quick-start) kullanılır. Altyapı hazır; ortam değişkenleriyle aktifleştirilir.

### Kurulum Adımları

1. [AfterShip](https://www.aftership.com/) hesabı açın (Tracking API — Premium plan gerekir)
2. [API anahtarı](https://organization.automizely.com/api-keys) alın
3. Ortam değişkenlerini ayarlayın:

**Vercel** → Project → Settings → Environment Variables:

```env
NUXT_PUBLIC_USE_AFTERSHIP=true
AFTERSHIP_API_KEY=asat_xxxxxxxx
```

Yerel geliştirme için `.env` dosyasına aynı değişkenleri ekleyin.

4. Redeploy edin (Vercel) veya sunucuyu yeniden başlatın (yerel)

**Davranış:**
- Demo numaraları (`ARS123…`, `HPS345…` vb.) → mock veri (portfolyo demosu için)
- Diğer tüm numaralar → AfterShip üzerinden gerçek takip

### API Akışı

AfterShip quick start dokümantasyonuna uygun olarak:

1. `GET /trackings?tracking_numbers=` — mevcut kayıt aranır
2. `POST /couriers/detect` — kargo firması otomatik tespit edilir
3. `POST /trackings` — yeni takip kaydı oluşturulur
4. Yanıt `aftershipAdapter.ts` ile ortak formata dönüştürülür

- **Base URL:** `https://api.aftership.com/tracking/2026-07`
- **Kimlik doğrulama:** `as-api-key` header'ı
- **HTTP istemcisi:** `server/services/aftership.ts`

## Mimari

Uygulama, farklı kaynaklardan gelen verileri ortak `NormalizedShipment` formatına dönüştürür:

| Kaynak | Response Yapısı |
|--------|-----------------|
| Aras Kargo (mock) | `{ status, city, history[] }` |
| Yurtiçi Kargo (mock) | `{ current_status, location: { city }, movements[] }` |
| MNG Kargo (mock) | `{ data: { shipment, trackingDetails[] } }` |
| PTT Kargo (mock) | `{ sonuc: { takipNo, durumKodu, detaylar[] } }` |
| Trendyol Express (mock) | `{ shipment, timeline[] }` |
| Sürat Kargo (mock) | `{ response, statusHistory[] }` |
| HepsiJet (mock) | `{ current_status, location, movements[] }` |
| UPS (mock) | `{ trackResponse: { shipment, package, activity[] } }` |
| Kolay Gelsin (mock) | `{ data: { shipment, trackingDetails[] } }` |
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
