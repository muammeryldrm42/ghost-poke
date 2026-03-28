# 👻 Ghost Poke — Farcaster Mini App

Farcaster üzerinde çalışan bir **Mini App**. Kullanıcılar birbirini "hayalet gibi" dürtebilir. Warpcast / Base App içinde açılır, otomatik Farcaster auth, sıfır login friction.

## Özellikler

- 🔍 **Kullanıcı Arama** — Neynar API ile anlık Farcaster kullanıcı araması
- 👻 **Ghost Poke** — Birini dürt, cast olarak feed'e düşsün
- 🔥 **Streak Sistemi** — Aynı kişiyi art arda dürtersen haunting streak
- 🏆 **Leaderboard** — En çok dürten / en çok dürtülen
- 📬 **Gelen Kutusu** — Seni kim dürttü? + karşılık ver butonu
- 📱 **Haptic Feedback** — Poke'ta telefon titrer
- 🎨 **Cyberpunk UI** — Neon mor, dark mode, ghost animasyonlar

## Viral Döngü

```
A poke atar → cast feed'e düşer (mini app embed'li)
→ B görür, açar, karşılık verir → yeni cast
→ C, D, E görür → döngü devam eder
```

## Tech Stack

- **Next.js 15** (App Router) — Vercel deploy
- **@farcaster/miniapp-sdk** — Auth, composeCast, haptics
- **Neynar API** — Farcaster kullanıcı arama
- **Vercel KV** — Poke kayıtları, leaderboard, streak
- **Tailwind CSS** — Cyberpunk/neon theme

## Kurulum

### 1. Repo'yu kur

```bash
git clone <repo-url> ghost-poke
cd ghost-poke
npm install
```

### 2. Neynar API Key al

- https://dev.neynar.com adresinden kayıt ol
- API key'ini kopyala

### 3. Environment variables

`.env.local` dosyası oluştur:

```env
NEYNAR_API_KEY=your_neynar_api_key_here
NEXT_PUBLIC_URL=https://ghost-poke.vercel.app
```

### 4. Vercel KV ekle

- Vercel Dashboard → Storage → KV Store oluştur
- Otomatik olarak `KV_REST_API_URL` ve `KV_REST_API_TOKEN` env'leri eklenir

### 5. Lokal geliştirme

```bash
npm run dev
```

Mini App olarak test etmek için:
- ngrok veya cloudflared ile tunnel aç
- Farcaster Developer Tools → Embed tool'a URL'i yapıştır

### 6. Vercel'e deploy

```bash
npx vercel --prod
```

### 7. Farcaster Manifest

Deploy sonrası Farcaster Developer Tools'dan manifest'i oluştur:
1. https://farcaster.xyz/~/settings/developer-tools adresine git
2. Developer Mode'u aç
3. Manifest oluştur, `accountAssociation` değerlerini `.well-known/farcaster.json` route'una ekle

## Dosya Yapısı

```
app/
  page.tsx                          → Ana sayfa (SDK init + context)
  layout.tsx                        → Root layout + frame metadata
  globals.css                       → Tailwind + cyberpunk styles
  api/
    search/route.ts                 → Neynar user search proxy
    poke/route.ts                   → Poke kayıt + inbox
    leaderboard/route.ts            → Leaderboard data
  .well-known/farcaster.json/
    route.ts                        → Mini App manifest
components/
  GhostPokeApp.tsx                  → Ana uygulama shell
  SearchBar.tsx                     → Debounced arama + dropdown
  UserCard.tsx                      → Hedef kullanıcı kartı
  PokeButton.tsx                    → Neon glow poke butonu
  GhostAnimation.tsx                → Poke blast particle efekti
  Leaderboard.tsx                   → Sıralama tablosu
  PokeHistory.tsx                   → Gelen kutusu (inbox)
lib/
  neynar.ts                         → Neynar API client
  kv.ts                             → Vercel KV helpers
public/images/
  splash.png                        → 200x200 splash screen
  feed.png                          → 600x400 embed card (3:2)
  og.png                            → 1200x630 OG image
```

## Manifest Kurulumu

Deploy sonrası `app/.well-known/farcaster.json/route.ts` içindeki `accountAssociation` alanlarını Farcaster Developer Tools'tan aldığın değerlerle doldur. Bu adım olmadan mini app Farcaster'da index'lenmez.

## Notlar

- **Neynar API key** server-side route handler'da kalır, client'a sızmaz
- **Vercel KV** free tier poke kayıtları için yeterli (30k request/gün)
- **Splash/feed/og görselleri** placeholder — kendi tasarımlarınla değiştir
- Ghost level sistemi: Baby Boo → Whispering Shade → Haunting Ghost → Night Wraith → Shadow Specter → Phantom Lord

## License

MIT
