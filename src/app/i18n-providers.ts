import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';

export class LanguageUrlDecoder {
  private static lang: string;
  private static baseUri: string;
  private static baseUrl: string;

  constructor() {
  }

  static get languageCode(): any {
    return LanguageUrlDecoder.lang;
  }

  static setLang = () => {
    LanguageUrlDecoder.lang = 'ar';
    LanguageUrlDecoder.baseUri = document.baseURI;
    LanguageUrlDecoder.baseUrl = document.URL;
    var diff = LanguageUrlDecoder.baseUrl.substr(LanguageUrlDecoder.baseUrl.indexOf(LanguageUrlDecoder.baseUri) + LanguageUrlDecoder.baseUri.length, LanguageUrlDecoder.baseUrl.length);
    var designatedLocale = diff.substr(0, 2);
    if (designatedLocale.toLocaleLowerCase() == 'ar' || designatedLocale.toLocaleLowerCase() == 'fr') {
      LanguageUrlDecoder.lang = designatedLocale;
    }
  }
}

export function getTranslationProviders(): Promise<Object[]> {

  LanguageUrlDecoder.setLang();
  const locale = LanguageUrlDecoder.languageCode;

  // return no providers if fail to get translation file for locale
  const noProviders: Object[] = [];

  // No locale or U.S. English: no translation providers
  if (!locale || locale === 'fr') {
    return Promise.resolve(noProviders);
  }

  // Ex: 'locale/messages.fr.xlf`
  const translationFile = `./locale/messages.${locale}.xlf`;

  return getTranslationsWithSystemJs(translationFile)
    .then( (translations: string ) => [
      { provide: TRANSLATIONS, useValue: translations },
      { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
      { provide: LOCALE_ID, useValue: locale }
    ])
    .catch(() => noProviders); // ignore if file not found
}

declare var System: any;

function getTranslationsWithSystemJs(file: string) {
  return System.import(file + '!text'); // relies on text plugin
}

