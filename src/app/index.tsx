/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import styled from 'styled-components/macro';
import { SWRConfig } from 'swr';

import { GlobalStyle } from 'styles/global-styles';

import { Header } from './containers/Header/index';
import { Footer } from './containers/Footer/Loadable';
import { HomePage } from './containers/HomePage/Loadable';
import { Contract } from './containers/Contract/Loadable';
import { BlocksAndTransactions } from './containers/BlocksAndTransactions/Loadable';
import { NotFoundPage } from './containers/NotFoundPage/Loadable';
import { PackingPage } from './containers/PackingPage/Loadable';
import { Tokens } from './containers/Tokens/Loadable';
import { Sponsor } from './containers/Sponsor/Loadable';
import { Chart } from './containers/Chart/Loadable';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { CfxProvider, CssBaseline } from '@cfxjs/react-ui';
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  custom: {
    families: ['Circular Std:n4,i4,n7,i7,n8,i8'],
    urls: ['/font.css'],
  },
});

export function App() {
  const { t } = useTranslation();
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        refreshInterval: 0,
      }}
    >
      <BrowserRouter>
        <CfxProvider>
          <CssBaseline />
          <Helmet titleTemplate="%s - ConfluxScan" defaultTitle="ConfluxScan">
            <meta
              name="description"
              content={t(translations.metadata.description)}
            />
          </Helmet>
          <Header />
          <Main>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/packing/:txHash" component={PackingPage} />
              <Route exact path="/contract" component={Contract} />
              <Route
                exact
                path="/contract/:contractAddress"
                component={Contract}
              />
              <Route
                exact
                path="/blocks-and-transactions"
                component={BlocksAndTransactions}
              />
              <Route exact path="/tokens" component={Tokens} />
              <Route exact path="/sponsor" component={Sponsor} />
              <Route path="/charts" component={Chart} />
              <Route component={NotFoundPage} />
            </Switch>
          </Main>
          <Footer />
          <GlobalStyle />
        </CfxProvider>
      </BrowserRouter>
    </SWRConfig>
  );
}

const Main = styled.div`
  position: relative;
  max-width: 73.1429rem;
  margin: 0 auto;
  padding-top: 5rem;
  min-height: calc(100vh - 21.2821rem);
  ${media.s} {
    padding: 4rem 1.1429rem 1.1429rem;
  }
`;
