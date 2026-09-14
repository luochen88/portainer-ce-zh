import { PropsWithChildren } from 'react';

import i18n, { mockT } from './i18next';

export function useTranslation() {
  return {
    t: mockT,
    i18n,
  };
}

export function Trans({ children }: PropsWithChildren<unknown>) {
  return <>{children}</>;
}

export const initReactI18next = {
  type: '3rdParty',
  init: vi.fn(),
};
