import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  I18N_CONFIG_KEY,
  I18N_DEFAULT_LANGUAGE,
  I18N_LANGUAGES,
} from '@/i18n/config';
import { I18nProviderProps, type Language, type LanguageCode } from '@/i18n/types';
import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction';
import { IntlProvider } from 'react-intl';
import { getData, setData } from '@/lib/storage';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/vi';

const getInitialLanguage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');

  // Check if langParam matches a supported language in I18N_LANGUAGES
  if (langParam) {
    const matchedLanguage = I18N_LANGUAGES.find(
      (lang) => lang.code === langParam,
    );
    if (matchedLanguage) {
      setData(I18N_CONFIG_KEY, matchedLanguage);
      return matchedLanguage;
    }
  }

  const currentLang = getData(I18N_CONFIG_KEY) as Language | undefined;
  return currentLang ?? I18N_DEFAULT_LANGUAGE;
};

const initialProps: I18nProviderProps = {
  currentLanguage: getInitialLanguage(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeLanguage: (_: Language) => {},
  isRTL: () => false,
};

const TranslationsContext = createContext<I18nProviderProps>(initialProps);
const useLanguage = () => useContext(TranslationsContext);

const I18nProvider = ({ children }: PropsWithChildren) => {
  const [currentLanguageCode, setCurrentLanguageCode] = useState<LanguageCode>(
    initialProps.currentLanguage.code
  );

  const currentLanguage = 
    I18N_LANGUAGES.find((l) => l.code === currentLanguageCode) || 
    I18N_DEFAULT_LANGUAGE;

  const changeLanguage = (language: Language) => {
    setData(I18N_CONFIG_KEY, language);
    setCurrentLanguageCode(language.code);
  };

  const isRTL = () => {
    return currentLanguage.direction === 'rtl';
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', currentLanguage.direction);
    document.documentElement.setAttribute('lang', currentLanguage.code);
  }, [currentLanguage]);

  return (
    <TranslationsContext.Provider
      value={{
        isRTL,
        currentLanguage,
        changeLanguage,
      }}
    >
      <IntlProvider
        key={currentLanguage.code}
        messages={currentLanguage.messages}
        locale={currentLanguage.code}
        defaultLocale={I18N_DEFAULT_LANGUAGE.code}
      >
        <RadixDirectionProvider dir={currentLanguage.direction}>
          {children}
        </RadixDirectionProvider>
      </IntlProvider>
    </TranslationsContext.Provider>
  );
};

export { I18nProvider, useLanguage };
