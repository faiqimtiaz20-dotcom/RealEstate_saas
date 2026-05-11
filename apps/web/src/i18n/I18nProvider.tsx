import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en from "@/i18n/locales/en.json";
import ptBR from "@/i18n/locales/pt-BR.json";

export type Locale = "pt-BR" | "en";

type Dict = Record<string, string>;

const dictionaries: Record<Locale, Dict> = {
  "pt-BR": ptBR as Dict,
  en: en as Dict,
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (key: string) => {
      return dictionaries[locale][key] ?? dictionaries.en[key] ?? dictionaries["pt-BR"][key] ?? key;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
