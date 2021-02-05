/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import WebFontLoader from 'webfontloader';
import { SWRConfig } from 'swr';
import { CfxProvider, CssBaseline } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { GlobalStyle } from 'styles/global-styles';
import { TxnHistoryProvider } from 'utils/hooks/useTxnHistory';

import { Header } from './containers/Header';
import { Footer } from './containers/Footer/Loadable';
import { HomePage } from './containers/HomePage/Loadable';
import { Contract } from './containers/Contract/Loadable';
import { BlocksAndTransactions } from './containers/BlocksAndTransactions/Loadable';
import { NotFoundPage } from './containers/NotFoundPage/Loadable';
import { NotFoundAddressPage } from './containers/NotFoundAddressPage/Loadable';
import { PackingPage } from './containers/PackingPage/Loadable';
import { Tokens } from './containers/Tokens/Loadable';
import { Accounts } from './containers/Accounts/Loadable';
import { Contracts } from './containers/Contracts/Loadable';
import { TokenDetail } from './containers/TokenDetail/Loadable';
import { Sponsor } from './containers/Sponsor/Loadable';
import { Chart } from './containers/Charts/Loadable';
import { Statistics } from './containers/Statistics/Loadable';
import { Transaction } from './containers/Transaction/Loadable';
import { Block } from './containers/Block/Loadable';
import { Epoch } from './containers/Epoch/Loadable';
import { AddressContractDetailPage } from './containers/AddressContractDetail/Loadable';
import { GlobalNotify } from './containers/GlobalNotify';
import { Search } from './containers/Search';
import { AddressConverter } from './containers/AddressConverter';
import { formatAddress, getGlobalShowHexAddress } from '../utils/cfx';

WebFontLoader.load({
  custom: {
    families: ['Circular Std:n4,i4,n7,i7,n8,i8'],
    urls: ['/font.css'],
  },
});

export function App() {
  const { t } = useTranslation();

  return (
    <TxnHistoryProvider
      value={{
        config: {
          // txn history record i18n handler
          convert: info => t(translations.txnAction[info]),
        },
      }}
    >
      <SWRConfig
        value={{
          // disable auto polling, reconnect or retry
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          refreshInterval: 0,
          shouldRetryOnError: false,
          errorRetryCount: 0,
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
                <Route
                  exact
                  path="/notfound/:contractAddress"
                  component={NotFoundAddressPage}
                />
                <Route exact path="/contract" component={Contract} />
                <Route
                  exact
                  path="/contract/:contractAddress"
                  render={(routeProps: any) => {
                    if (
                      routeProps.match.params.contractAddress &&
                      ((!getGlobalShowHexAddress() &&
                        routeProps.match.params.contractAddress.startsWith(
                          '0x',
                        )) ||
                        routeProps.match.params.contractAddress
                          .toLowerCase()
                          .indexOf('type.') > -1)
                    )
                      return (
                        <Redirect
                          to={`/contract/${formatAddress(
                            routeProps.match.params.contractAddress,
                          )}`}
                        />
                      );
                    return <Contract {...routeProps} />;
                  }}
                />
                <Route exact path="/contracts" component={Contracts} />
                <Route
                  exact
                  path="/token/:tokenAddress"
                  render={(routeProps: any) => {
                    if (
                      routeProps.match.params.tokenAddress &&
                      ((!getGlobalShowHexAddress() &&
                        routeProps.match.params.tokenAddress.startsWith(
                          '0x',
                        )) ||
                        routeProps.match.params.tokenAddress
                          .toLowerCase()
                          .indexOf('type.') > -1)
                    )
                      return (
                        <Redirect
                          to={`/token/${formatAddress(
                            routeProps.match.params.tokenAddress,
                          )}`}
                        />
                      );
                    return <TokenDetail {...routeProps} />;
                  }}
                />
                <Route
                  exact
                  path={['/blocks-and-transactions', '/blockchain']}
                  render={() => (
                    <Redirect to="/blockchain/blocks-and-transactions" />
                  )}
                />
                <Route
                  exact
                  path="/blockchain/blocks-and-transactions"
                  component={BlocksAndTransactions}
                />
                <Route exact path="/blockchain/accounts" component={Accounts} />
                <Route exact path="/tokens" component={Tokens} />
                <Route
                  exact
                  path="/tokens/:tokenType"
                  render={(routeProps: any) => {
                    if (routeProps.match.params.tokenType)
                      routeProps.match.params.tokenType = routeProps.match.params.tokenType.toUpperCase();
                    return <Tokens {...routeProps} />;
                  }}
                />
                <Route exact path="/sponsor" component={Sponsor} />
                <Route
                  exact
                  path="/sponsor/:contractAddress"
                  render={(routeProps: any) => {
                    if (
                      routeProps.match.params.contractAddress &&
                      ((!getGlobalShowHexAddress() &&
                        routeProps.match.params.contractAddress.startsWith(
                          '0x',
                        )) ||
                        routeProps.match.params.contractAddress
                          .toLowerCase()
                          .indexOf('type.') > -1)
                    )
                      return (
                        <Redirect
                          to={`/sponsor/${formatAddress(
                            routeProps.match.params.contractAddress,
                          )}`}
                        />
                      );
                    return <Sponsor {...routeProps} />;
                  }}
                />
                <Route path="/charts" component={Chart} />
                <Route
                  exact
                  path="/statistics"
                  render={() => <Redirect to="/statistics/transactions" />}
                />
                <Route
                  exact
                  path="/statistics/:statsType"
                  component={Statistics}
                />
                <Route
                  exact
                  path={['/address-converter', '/address-converter/:address']}
                  component={AddressConverter}
                />
                <Route
                  exact
                  path="/transaction/:hash"
                  component={Transaction}
                />
                <Route exact path="/block/:hash" component={Block} />
                <Route exact path="/epoch/:number" component={Epoch} />
                <Route
                  path="/address/:address"
                  render={(routeProps: any) => {
                    if (
                      routeProps.match.params.address &&
                      ((!getGlobalShowHexAddress() &&
                        routeProps.match.params.address.startsWith('0x')) ||
                        routeProps.match.params.address
                          .toLowerCase()
                          .indexOf('type.') > -1)
                    )
                      return (
                        <Redirect
                          to={`/address/${formatAddress(
                            routeProps.match.params.address,
                          )}`}
                        />
                      );
                    return <AddressContractDetailPage {...routeProps} />;
                  }}
                />
                <Route path="/search/:text" component={Search} />
                <Route component={NotFoundPage} />
              </Switch>
            </Main>
            <Footer />
            <GlobalNotify />
            <GlobalStyle />
          </CfxProvider>
        </BrowserRouter>
      </SWRConfig>
    </TxnHistoryProvider>
  );
}

const Main = styled.div`
  position: relative;
  max-width: 1024px;
  margin: 0 auto;
  padding-top: 70px;
  min-height: calc(100vh - 298px);
  ${media.s} {
    padding: 100px 16px 16px;
    min-height: calc(100vh - 254px);
  }
`;
