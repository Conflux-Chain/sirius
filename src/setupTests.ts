// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import 'jest-styled-components';

import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
fetchMock.dontMock();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => 'translated', i18n: { language: 'en' } }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

jest.mock('react-router-dom', () => ({
  useRouteMatch: () => ({ isExact: true }),
}));
