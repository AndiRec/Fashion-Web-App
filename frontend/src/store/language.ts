import { create } from "zustand";
import i18n, { LANGUAGE_STORAGE_KEY, type SupportedLanguage } from "@/lib/i18n";

interface LanguageState {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: (i18n.language as SupportedLanguage) || "en",
  setLanguage: (language) => {
    i18n.changeLanguage(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // localStorage unavailable — the choice just won't persist across visits.
    }
    set({ language });
  },
}));
