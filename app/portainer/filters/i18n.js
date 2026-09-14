import angular from 'angular';

import i18n from '@/i18n';

angular.module('portainer.app').filter('i18n', () => (key, options) => i18n.t(key, options));
