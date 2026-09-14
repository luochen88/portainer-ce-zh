import { Trans, useTranslation } from 'react-i18next';

import { Alert } from '@@/Alert';

export function RBACAlert() {
  const { t } = useTranslation();
  return (
    <Alert color="warn" className="mb-4">
      <div className="flex flex-col">
        <p>{t('kubernetes.cluster.configure.rbacAlert.notEnabled')}</p>
        <p>{t('kubernetes.cluster.configure.rbacAlert.description')}</p>
        <p className="mb-0">
          <Trans
            i18nKey="kubernetes.cluster.configure.rbacAlert.enableInstructions"
            components={{
              apiServerLink: (
                <a
                  className="th-highcontrast:text-blue-4 th-dark:text-blue-7"
                  href="https://kubernetes.io/docs/concepts/overview/components/#kube-apiserver"
                  target="_blank"
                  rel="noreferrer"
                />
              ),
              authorizationMode: (
                <code className="bg-gray-4 box-decoration-clone th-highcontrast:bg-black th-dark:bg-black" />
              ),
              rbac: (
                <code className="bg-gray-4 th-highcontrast:bg-black th-dark:bg-black" />
              ),
              example: (
                <code className="bg-gray-4 box-decoration-clone th-highcontrast:bg-black th-dark:bg-black" />
              ),
            }}
          />
        </p>
      </div>
    </Alert>
  );
}
