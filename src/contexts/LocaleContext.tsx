'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale } from '@/lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'ja',
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ja');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved === 'ja' || saved === 'en') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
