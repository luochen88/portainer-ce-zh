let currentLanguage = 'en';

function replaceBetween(
  startIndex: number,
  endIndex: number,
  original: string,
  insertion: string
) {
  const result =
    original.substring(0, startIndex) +
    insertion +
    original.substring(endIndex);
  return result;
}

export function mockT(i18nKey: string, args?: Record<string, unknown>) {
  let key = i18nKey;

  while (key.includes('{{') && args) {
    const startIndex = key.indexOf('{{');
    const endIndex = key.indexOf('}}');

    const currentArg = key.substring(startIndex + 2, endIndex).trim();
    const value = args[currentArg];

    key = replaceBetween(startIndex, endIndex + 2, key, String(value ?? ''));
  }

  return key;
}

const i18n = {
  t: mockT,
  get language() {
    return currentLanguage;
  },
  changeLanguage: (language: string) => {
    currentLanguage = language;
    return Promise.resolve(language);
  },
  getFixedT: () => mockT,
  use: () => i18n,
  init: () => Promise.resolve(i18n),
};

export default i18n;
