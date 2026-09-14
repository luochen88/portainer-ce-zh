import i18n, { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/i18n';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';

const LANGUAGE_OPTIONS = [
  { id: 'zh-CN', label: '简体中文', description: '默认简体中文界面' },
  { id: 'en', label: 'English', description: 'English interface' },
];

export default class LanguageSettingsController {
  /* @ngInject */
  constructor($async, $window) {
    this.$async = $async;
    this.$window = $window;

    this.setLanguage = this.setLanguage.bind(this);
  }

  setLanguage(language) {
    return this.$async(async () => {
      const t = i18n.getFixedT(language);

      try {
        await i18n.changeLanguage(language);
        this.$window.localStorage.setItem('i18nextLng', language);
        this.state.language = language;

        notifySuccess(t('common.success'), t('account.language.notifications.success'));
        this.$window.location.reload();
      } catch (err) {
        notifyError(t('common.failure'), err, t('account.language.notifications.failure'));
      }
    });
  }

  $onInit() {
    const language = SUPPORTED_LANGUAGES.includes(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;

    this.state = {
      language,
      availableLanguages: LANGUAGE_OPTIONS,
    };
  }
}
