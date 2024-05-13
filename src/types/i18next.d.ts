import { translations } from '../locales/i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof translations;
    returnNull: false;
  }
  interface TFunction {
    <
      TKeys extends i18next.TFunctionKeys = string,
      TInterpolationMap extends object = i18next.StringMap
    >(
      key: TKeys,
      options?: i18next.TOptions<TInterpolationMap> | string,
    ): string;
  }
}
