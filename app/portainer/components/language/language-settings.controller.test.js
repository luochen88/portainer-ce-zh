import { describe, expect, it, vi, beforeEach } from 'vitest';

import LanguageSettingsController from './language-settings.controller';

const changeLanguage = vi.fn(() => Promise.resolve());
const getFixedT = vi.fn(() => (key) => key);
const notifySuccess = vi.fn();
const notifyError = vi.fn();

vi.mock('@/i18n', () => ({
  default: {
    language: 'zh-CN',
    changeLanguage,
    getFixedT,
  },
  DEFAULT_LANGUAGE: 'zh-CN',
  SUPPORTED_LANGUAGES: ['zh-CN', 'en'],
}));

vi.mock('@/portainer/services/notifications', () => ({
  notifySuccess,
  notifyError,
}));

function buildController() {
  const $window = {
    localStorage: { setItem: vi.fn() },
    location: { reload: vi.fn() },
  };
  const $async = (fn) => fn();
  const controller = new LanguageSettingsController($async, $window);
  controller.$onInit();

  return { controller, $window };
}

beforeEach(() => {
  vi.clearAllMocks();
  changeLanguage.mockResolvedValue();
  getFixedT.mockReturnValue((key) => key);
});

describe('LanguageSettingsController', () => {
  it('persists the selected language and reloads after a successful switch', async () => {
    const { controller, $window } = buildController();

    await controller.setLanguage('en');

    expect(changeLanguage).toHaveBeenCalledWith('en');
    expect($window.localStorage.setItem).toHaveBeenCalledWith('i18nextLng', 'en');
    expect(controller.state.language).toBe('en');
    expect(notifySuccess).toHaveBeenCalledWith('common.success', 'account.language.notifications.success');
    expect($window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload when language switching fails', async () => {
    const error = new Error('failed');
    changeLanguage.mockRejectedValueOnce(error);
    const { controller, $window } = buildController();

    await controller.setLanguage('en');

    expect($window.localStorage.setItem).not.toHaveBeenCalled();
    expect($window.location.reload).not.toHaveBeenCalled();
    expect(notifyError).toHaveBeenCalledWith('common.failure', error, 'account.language.notifications.failure');
  });
});
