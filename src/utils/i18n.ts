// Persian translations
export const translations = {
  fa: {
    welcome: "خوش آمدید",
    home: "خانه",
    discover: "کاوش",
    profile: "پروفایل",
    wallet: "کیف پول",
    coins: "سکه",
    loading: "در حال بارگیری...",
    error: "خطا",
    retry: "تلاش مجدد",
    purchase: "خرید",
    back: "بازگشت",
  },
  en: {
    welcome: "Welcome",
    home: "Home",
    discover: "Discover",
    profile: "Profile",
    wallet: "Wallet",
    coins: "Coins",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    purchase: "Purchase",
    back: "Back",
  },
};

export type TranslationKey = keyof typeof translations.fa;

export function getTranslation(
  key: TranslationKey,
  language: "fa" | "en" = "fa"
): string {
  return translations[language][key] || key;
}
