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

// TODO: find better way to test this
// jest.mock('react-router-dom', () => ({
//   useRouteMatch: () => ({ isExact: true }),
// }));

// so that i18next can detect lang in test env
window.document.cookie = 'react-18next=en';
