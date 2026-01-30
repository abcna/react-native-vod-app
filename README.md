# MyDrama - Persian Vertical VOD Platform 🎬

یک اپلیکیشن React Native شبیه TikTok برای تماشای سریال و فیلم‌های ایرانی. این پروژه برای پشتیبانی کامل RTL و فارسی از ابتدا طراحی شده است.

A React Native app like TikTok for watching Iranian series and films. Full RTL and Persian support from the start.

## ویژگی‌های اصلی | Key Features

- 🎬 **Vertical Video Feed** - موجود شامل مشاهده عمودی ویدیو با FlashList
- 🌍 **Full RTL Support** - پشتیبانی کامل فارسی و RTL
- 💰 **Wallet & Coins System** - سیستم کوین و کیف‌پول
- 🎨 **Professional Design** - طراحی حرفه‌ای با رنگ‌ها و فاصله‌گذاری متسق
- 🔐 **Secure Auth** - احراز هویت امن با expo-secure-store
- 🌐 **API Ready** - آماده اتصال به backend

## ساختار پروژه | Project Structure

```
mydrama/
├── src/
│   ├── assets/
│   │   ├── fonts/              # فایل‌های فونت (Vazir)
│   │   └── images/
│   ├── components/
│   ├── hooks/                  # useVideoPlayer, etc.
│   ├── navigation/
│   │   └── AppNavigator.tsx    # ناوبری اصلی
│   ├── screens/
│   │   └── Feed/
│   │       ├── FeedScreen.tsx
│   │       └── components/VideoItem.tsx
│   ├── services/
│   │   ├── video.service.ts
│   │   ├── payment.service.ts
│   │   └── auth.service.ts
│   ├── store/                  # Zustand stores
│   │   ├── usePlayerStore.ts
│   │   ├── useWalletStore.ts
│   │   └── useAuthStore.ts
│   ├── types/
│   │   └── models.d.ts         # TypeScript interfaces
│   ├── utils/
│   │   ├── i18n.ts             # Persian/English translations
│   │   └── formatters.ts
│   └── constants/
│       └── theme.ts            # Colors, spacing, etc.
├── App.tsx                     # Root entry (RTL + fonts)
├── app.json                    # Expo config
├── babel.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## نصب | Installation

```bash
npm install
npm start
```

سپس برای اجرا:

- `i` برای iOS
- `a` برای Android
- `w` برای Web
- `j` برای Expo Go

## تنظیمات اساسی | Essential Setup

### RTL

خود‌کار در `App.tsx`:

```tsx
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);
```

### فونت‌های فارسی | Persian Fonts

فایل‌های نمونه در `src/assets/fonts/` هستند. برای فونت‌های واقعی:

1. دانلود کنید: https://github.com/rastikerdar/vazir-font
2. منتقل کنید `.ttf` فایل‌ها به `src/assets/fonts/`
3. اپ خود‌کار بارگذاری می‌کند

## مدیریت وضعیت | State Management

### useWalletStore

```tsx
const { coins, addCoins, spendCoins } = useWalletStore();
spendCoins(50); // boolean: true = success, false = insufficient
```

### usePlayerStore

```tsx
const { currentEpisodeId, setEpisode } = usePlayerStore();
```

### useAuthStore

```tsx
const { userId, isLoggedIn, login, logout } = useAuthStore();
```

## API Services

تمام سرویس‌ها در `src/services/`:

- `video.service.ts` - دریافت سریال‌ها و ویدیوها
- `payment.service.ts` - خرید کوین
- `auth.service.ts` - ثبت‌نام و ورود

**تنظیم URL Backend:**

`src/services/*.ts` میں `API_BASE_URL` را تغییر دهید (خط 3-5):

```ts
const API_BASE_URL = "https://your-api.com";
```

## TypeScript Types

`src/types/models.d.ts` میں تعریف شده:

- `Series` - سریال
- `Episode` - قسمت
- `User` - کاربر
- `Transaction` - تراکنش
- `CoinPackage` - بسته کوین

## Theme & Colors

`src/constants/theme.ts`:

```tsx
colors.primary; // #6366F1 بنفش
colors.accent; // #EC4899 صورتی
colors.background; // #000000
colors.surface; // #1F2937
colors.text.primary; // #FFFFFF
```

## نکات مهم | Important Notes

- Path aliases: `@/` = `src/`
- RTL: بدون `left`/`right`، استفاده کنید `flexDirection`
- API: الگوهای try/catch در services، نه کامپوننت‌ها
- Fonts: بدون `.ttf` پسوند در `App.tsx`

## مراجع | References

- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Zustand](https://zustand-demo.pmnd.rs)
- [expo-av](https://docs.expo.dev/versions/latest/sdk/av)
- [FlashList](https://shopify.github.io/flash-list)

---

**Version:** 1.0.0  
**Last Updated:** January 2026
