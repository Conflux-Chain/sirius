/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Switch,
  Route,
  BrowserRouter,
  Redirect,
  useLocation,
  withRouter,
} from 'react-router-dom';
import styled from 'styled-components/macro';
// import WebFontLoader from 'webfontloader';
import { SWRConfig } from 'swr';
import { CfxProvider, CssBaseline } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { GlobalStyle } from 'styles/global-styles';
import { TxnHistoryProvider } from 'utils/hooks/useTxnHistory';

import { Report } from './containers/Report';
import { Swap } from './containers/Swap';
import { Header } from './containers/Header';
import { Footer } from './containers/Footer/Loadable';
import { HomePage } from './containers/HomePage/Loadable';
import { Contract } from './containers/Contract/Loadable';
import { ContractDeployment } from './containers/ContractDeployment/Loadable';
import { Blocks } from './containers/Blocks/Loadable';
import { Transactions } from './containers/Transactions/Loadable';
import { CFXTransfers } from './containers/CFXTransfers/Loadable';
import { NotFoundPage } from './containers/NotFoundPage/Loadable';
import { NotFoundAddressPage } from './containers/NotFoundAddressPage/Loadable';
import { PackingPage } from './containers/PackingPage/Loadable';
import { Tokens } from './containers/Tokens/Loadable';
import { Accounts } from './containers/Accounts/Loadable';
import { Contracts } from './containers/Contracts/Loadable';
import { RegisteredContracts } from './containers/Contracts/Loadable';
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
import { BlocknumberCalc } from './containers/BlocknumberCalc/Loadable';
import { BroadcastTx } from './containers/BroadcastTx/Loadable';
import { CookieTip } from './components/CookieTip';
import { GlobalTip } from './components/GlobalTip';
import { Notices } from './containers/Notices/Loadable';
import { ChartDetail } from './containers/ChartDetail/Loadable';
import { useEffect } from 'react';
import { NetworkError } from './containers/NetworkError/Loadable';
import BigNumber from 'bignumber.js';

// WebFontLoader.load({
//   custom: {
//     families: ['Circular Std:n4,i4,n7,i7,n8,i8'],
//     urls: ['/font.css'],
//   },
// });

BigNumber.config({ EXPONENTIAL_AT: [-18, 34] });

export function App() {
  const { t } = useTranslation();

  function _ScrollToTop(props) {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return props.children;
  }

  const ScrollToTop = withRouter(_ScrollToTop);

  return (
    <TxnHistoryProvider
      value={{
        config: {
          // txn history record i18n handler
          convert: info => {
            try {
              let data = JSON.parse(info);
              if (data.code === '107') {
                return t(translations.connectWallet.notify.action[data.code], {
                  cfxValue: data.cfxValue,
                  wcfxValue: data.wcfxValue,
                });
              } else {
                return t(translations.connectWallet.notify.action[data.code], {
                  cfxValue: data.cfxValue,
                  wcfxValue: data.wcfxValue,
                });
              }
            } catch (e) {}
          },
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
          <CfxProvider
            theme={{
              breakpoints: {
                xs: {
                  min: '0',
                  max: '600px',
                },
                sm: {
                  min: '600px',
                  max: '1024px',
                },
                md: {
                  min: '1024px',
                  max: '1280px',
                },
                lg: {
                  min: '1280px',
                  max: '1440px',
                },
                xl: {
                  min: '1440px',
                  max: '10000px',
                },
              },
            }}
          >
            <CssBaseline />
            <Helmet titleTemplate="%s - ConfluxScan" defaultTitle="ConfluxScan">
              <meta
                name="description"
                content={t(translations.metadata.description)}
              />
            </Helmet>
            <Header />
            <Main>
              <ScrollToTop>
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Route
                    exact
                    path="/packing/:txHash"
                    component={PackingPage}
                  />
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
                    path="/registered-contracts"
                    component={RegisteredContracts}
                  />
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
                  {/* compatible for previous user bookmark */}
                  <Route
                    exact
                    path={[
                      '/blocks-and-transactions',
                      '/blockchain',
                      '/blockchain/blocks-and-transactions',
                    ]}
                    render={() => <Redirect to="/blockchain/blocks" />}
                  />
                  <Route exact path="/blockchain/blocks" component={Blocks} />
                  <Route
                    exact
                    path="/blockchain/transactions"
                    component={Transactions}
                  />
                  <Route
                    exact
                    path="/blockchain/cfx-transfers"
                    component={CFXTransfers}
                  />
                  <Route
                    exact
                    path="/blockchain/accounts"
                    component={Accounts}
                  />
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
                    path="/contract-deployment"
                    component={ContractDeployment}
                  />
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
                    path="/chart/:indicator"
                    component={ChartDetail}
                  />
                  <Route
                    exact
                    path="/statistics"
                    render={() => <Redirect to="/statistics/overview" />}
                  />
                  <Route
                    exact
                    path="/statistics/:statsType"
                    component={Statistics}
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
                  {/* Tools */}
                  <Route
                    exact
                    path={['/address-converter', '/address-converter/:address']}
                    component={AddressConverter}
                  />
                  <Route exact path="/push-tx" component={BroadcastTx} />
                  <Route
                    exact
                    path={['/block-countdown', '/block-countdown/:block']}
                    component={BlocknumberCalc}
                  />
                  <Route exact path="/swap" component={Swap} />
                  <Route exact path="/report" component={Report} />
                  <Route
                    exact
                    path={['/notices', '/notice', '/notice/:id']}
                    component={Notices}
                  />
                  <Route
                    exact
                    path={['/networkError', '/networkError/:network']}
                    component={NetworkError}
                  />
                  <Route component={NotFoundPage} />
                </Switch>
              </ScrollToTop>
            </Main>
            <Footer />
            <GlobalNotify />
            <GlobalStyle />
            <CookieTip />
            <GlobalTip tipKey="addressWarning" />
          </CfxProvider>
        </BrowserRouter>
      </SWRConfig>
    </TxnHistoryProvider>
  );
}

const Main = styled.div`
  box-sizing: border-box;
  position: relative;
  max-width: 1368px;
  margin: 0 auto;
  padding-top: 106px;
  padding-bottom: 20px;
  min-height: calc(100vh - 260px);

  ${media.xl} {
    padding-top: 106px;
    padding-left: 10px;
    padding-right: 10px;
  }

  ${media.m} {
    padding-top: 90px;
  }

  ${media.s} {
    padding: 100px 16px 32px;
    //min-height: calc(100vh - 254px);
  }
`;
