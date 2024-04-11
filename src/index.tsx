/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from 'serviceWorker';
import { RecoilRoot } from 'recoil';
import { completeDetect } from '@cfxjs/use-wallet-react/conflux/Fluent';
import 'sanitize.css/sanitize.css';
import '@cfxjs/antd/dist/@cfxjs/antd.css';
import 'sirius-next/packages/common/dist/uno.css';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

// Initialize languages
import 'locales/i18n';
import { IS_MAINNET, IS_TESTNET } from 'env';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

interface Props {
  Component: typeof App;
}
const ConnectedApp = ({ Component }: Props) => (
  <HelmetProvider>
    <RecoilRoot>
      <React.StrictMode>
        <Component />
      </React.StrictMode>
    </RecoilRoot>
  </HelmetProvider>
);

// const root = ReactDOM.createRoot(MOUNT_NODE);

// const render = (Component: typeof App) => {
//   root.render(<ConnectedApp Component={Component} />);
// };

const render = (Component: typeof App) => {
  ReactDOM.render(<ConnectedApp Component={Component} />, MOUNT_NODE);
};

if (module.hot) {
  // Hot reloadable translation json files and app
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./app', 'locales/i18n'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    Promise.all([completeDetect()]).then(() => {
      const App = require('./app').App;
      render(App);
    });
  });
}

Promise.all([completeDetect()]).then(() => {
  render(App);
});

const currentVersion = 'v2.17.0';

const brand = `
┌─┐┌─┐┌┐┌┌─┐┬  ┬ ┬─┐ ┬  ┌─┐┌─┐┌─┐┌┐┌ ${currentVersion}
│  │ ││││├┤ │  │ │┌┴┬┘  └─┐│  ├─┤│││
└─┘└─┘┘└┘└  ┴─┘└─┘┴ └─  └─┘└─┘┴ ┴┘└┘
 `;

if (IS_TESTNET) {
  console.log &&
    console.log(
      `%c 
${brand}
╔╦╗╔═╗╔═╗╔╦╗  ┌┐┌┌─┐┌┬┐
 ║ ║╣ ╚═╗ ║   │││├┤  │ 
 ╩ ╚═╝╚═╝ ╩   ┘└┘└─┘ ┴
`,
      'color:#e4310c;',
    );
} else if (IS_MAINNET) {
  console.log &&
    console.log(
      `%c 
${brand}
╔╦╗╔═╗╔╦╗╦ ╦╦ ╦╔═╗
 ║ ║╣  ║ ╠═╣╚╦╝╚═╗
 ╩ ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
`,
      'color:#1e3de4;',
    );
} else {
  console.log &&
    console.log(
      `%c 
${brand}
╔═╗╦═╗╦╦  ╦╔═╗╔╦╗╔═╗  ┌┐┌┌─┐┌┬┐
╠═╝╠╦╝║╚╗╔╝╠═╣ ║ ║╣   │││├┤  │ 
╩  ╩╚═╩ ╚╝ ╩ ╩ ╩ ╚═╝  ┘└┘└─┘ ┴
`,
      'color:#e4c01e;',
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://create-react-app.dev/docs/making-a-progressive-web-app/
// serviceWorker.register();
serviceWorker.unregister();
