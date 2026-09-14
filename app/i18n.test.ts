import { describe, expect, it, vi, beforeEach } from 'vitest';

const resources = {
  en: {
    translation: {
      common: { success: 'Success' },
      test: { fallbackOnly: 'English fallback', interpolation: 'Hello {{name}}' },
    },
  },
  'zh-CN': {
    translation: {
      common: { success: '成功' },
      test: { interpolation: '你好 {{name}}' },
    },
  },
};

vi.mock('i18next-http-backend', () => ({
  default: class BackendMock {
    static type = 'backend';

    type = 'backend';

    init() {}

    read(language: keyof typeof resources, namespace: 'translation', callback: (error: unknown, resource: unknown) => void) {
      callback(null, resources[language]?.[namespace] ?? {});
    }
  },
}));

vi.mock('i18next-browser-languagedetector', () => ({
  default: class LanguageDetectorMock {
    static type = 'languageDetector';

    type = 'languageDetector';

    init() {}

    detect() {
      return 'en';
    }

    cacheUserLanguage() {}
  },
}));

vi.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init() {},
  },
}));

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
});

describe('i18n', () => {
  it('defaults to Simplified Chinese when no stored preference exists', async () => {
    const { default: i18n } = await import('./i18n');
    await i18n.loadLanguages('zh-CN');

    expect(i18n.language).toBe('zh-CN');
    expect(i18n.t('common.success')).toBe('成功');
  });

  it('ignores unsupported stored language values', async () => {
    localStorage.setItem('i18nextLng', 'ko');

    const { default: i18n } = await import('./i18n');
    await i18n.loadLanguages('zh-CN');

    expect(i18n.language).toBe('zh-CN');
  });

  it('uses a supported English preference', async () => {
    localStorage.setItem('i18nextLng', 'en');

    const { default: i18n } = await import('./i18n');
    await i18n.loadLanguages('en');

    expect(i18n.language).toBe('en');
    expect(i18n.t('common.success')).toBe('Success');
  });

  it('falls back to English and preserves interpolation', async () => {
    const { default: i18n } = await import('./i18n');
    await i18n.loadLanguages(['zh-CN', 'en']);

    expect(i18n.t('test.fallbackOnly')).toBe('English fallback');
    expect(i18n.t('test.interpolation', { name: 'Portainer' })).toBe('你好 Portainer');
  });
});
