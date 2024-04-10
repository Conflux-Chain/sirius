/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Switch,
  Route,
  BrowserRouter,
  Redirect,
  useLocation,
  withRouter,
} from 'react-router-dom';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import WebFontLoader from 'webfontloader';
import { SWRConfig } from 'swr';
import { CfxProvider, CssBaseline } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { GlobalStyle } from 'styles/global-styles';
import { TxnHistoryProvider } from 'utils/hooks/useTxnHistory';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { reqProjectConfig } from 'utils/httpRequest';
import { NETWORK_ID, NETWORK_OPTIONS } from 'utils/constants';
import { formatAddress, isSimplyBase32Address, isAddress } from 'utils';
import MD5 from 'md5.js';
import lodash from 'lodash';
import { getClientVersion } from 'utils/rpcRequest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// pow pages
import { FCCFX } from './containers/FCCFX';
import { Swap } from './containers/Swap';
import { Header } from './containers/Header';
import { Footer } from './containers/Footer/Loadable';
import { HomePage } from './containers/HomePage/Loadable';
import { Contract } from './containers/Contract/Loadable';
import { ContractDeployment } from './containers/ContractDeployment/Loadable';
import { ContractVerification } from './containers/ContractVerification/Loadable';
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
import { Statistics } from './containers/Statistics/Loadable';
import { Transaction } from './containers/Transaction/Loadable';
import { Block } from './containers/Block/Loadable';
import { Epoch } from './containers/Epoch/Loadable';
import { AddressContractDetailPage } from './containers/AddressContractDetail/Loadable';
import { GlobalNotify } from './containers/GlobalNotify';
import { Search } from './containers/Search';
import { AddressConverter } from './containers/AddressConverter';
import Loading from 'app/components/Loading';
import { BlocknumberCalc } from './containers/BlocknumberCalc/Loadable';
import { BroadcastTx } from './containers/BroadcastTx/Loadable';
// import { CookieTip } from './components/CookieTip';
// import { GlobalTip } from './components/GlobalTip';
import { NetworkError } from './containers/NetworkError/Loadable';
import { BalanceChecker } from './containers/BalanceChecker/Loadable';
import { NFTChecker } from './containers/NFTChecker/Loadable';
import { CNS } from './containers/CNS/Loadable';
import { Approval } from './containers/Approval/Loadable';
import { NFTDetail } from './containers/NFTDetail/Loadable';
import ScanBenchmark from './containers/_Benchmark';
import {
  Chart,
  BlockTime,
  TPS,
  HashRate,
  Difficulty,
  TotalSupply,
  CirculatingSupply,
  Tx,
  CFXTransfer,
  TokenTransfer,
  CFXHolderAccounts,
  AccountGrowth,
  ActiveAccounts,
  Contracts as ContractsCharts,
} from './containers/Charts/pow/Loadable';

import {
  Chart as PoSChart,
  FinalizedInterval as PoSFinalizedInterval,
  DailyAccounts as PoSDailyAccounts,
  DailyStaking as PoSDailyStaking,
  DailyAPY as PoSDailyAPY,
  TotalReward as PoSTotalReward,
  DailyRewardRank as PoSDailyRewardRank,
  DailyDeposit as PoSDailyDeposit,
  DailyParticipation as PoSDailyParticipation,
  DailyRewardInfo as PoSDailyRewardInfo,
} from './containers/Charts/pos/Loadable';

import {
  Chart as CrossSpaceChart,
  DailyCFXTransfer as CrossSpaceDailyCFXTransfer,
  DailyCFXTransferCount as CrossSpaceDailyCFXTransferCount,
} from './containers/Charts/crossSpace/Loadable';

import {
  Chart as NFTChart,
  Assets as NFTAssets,
  Holders as NFTHolders,
  Contracts as NFTContracts,
  Transfers as NFTTransfers,
} from './containers/Charts/nft/Loadable';

// pos pages
import { HomePage as posHomePage } from './containers/pos/HomePage/Loadable';
import { Accounts as posAccounts } from './containers/pos/Accounts/Loadable';
import { Committees as posCommittees } from './containers/pos/Committees/Loadable';
import { Committee as posCommittee } from './containers/pos/Committee/Loadable';
import { Account as posAccount } from './containers/pos/Account/Loadable';
import { Blocks as posBlocks } from './containers/pos/Blocks/Loadable';
import { Block as posBlock } from './containers/pos/Block/Loadable';
import { Transactions as posTransactions } from './containers/pos/Transactions/Loadable';
import { Transaction as posTransaction } from './containers/pos/Transaction/Loadable';
import { IncomingRank as posIncomingRank } from './containers/pos/IncomingRank/Loadable';

import { Profile } from './containers/Profile/Loadable';

import enUS from '@cfxjs/antd/lib/locale/en_US';
import zhCN from '@cfxjs/antd/lib/locale/zh_CN';
import moment from 'moment';
import { ConfigProvider } from '@cfxjs/antd';
import 'moment/locale/zh-cn';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

import ENV_CONFIG_LOCAL from 'env';
import { useEnv } from 'sirius-next/packages/common/dist/store/index';

// @ts-ignore
window.lodash = lodash;

// WebFontLoader.load({
//   custom: {
//     families: ['Circular Std:n4,i4,n7,i7,n8,i8'],
//     urls: ['/font.css'],
//   },
// });

dayjs.extend(utc);

WebFontLoader.load({
  custom: {
    families: ['Roboto Mono:n1,n2,n3,n4,n5,n6,n7'],
    urls: ['/fontmono.css'],
  },
});

BigNumber.config({ EXPONENTIAL_AT: [-18, 34] });

// @ts-ignore
window.recaptchaOptions = {
  useRecaptchaNet: true,
};

export function App() {
  const [globalData, setGlobalData] = useGlobalData();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh-cn' : 'en';
  const [loading, setLoading] = useState(true);
  const { SET_ENV_CONFIG } = useEnv();

  moment.locale(lang);
  dayjs.locale(lang);

  function _ScrollToTop(props) {
    const { pathname } = useLocation();
    useEffect(() => {
      // theme switch by change body classname, reflect to css variable defination
      // const classList = document.body.classList;
      // let prev = 'pow';
      // let next = 'pos';
      // if (pathname === '/') {
      //   prev = 'pos';
      //   next = 'pow';
      // }
      // if (classList.contains(prev)) {
      //   classList.replace(prev, next);
      // } else {
      //   classList.add(next);
      // }
      if (
        pathname !== '/pow-charts' &&
        pathname !== '/pos-charts' &&
        pathname !== '/cross-space-charts'
      ) {
        window.scrollTo(0, 0);
      }
    }, [pathname]);

    return props.children;
  }

  useEffect(() => {
    const key = LOCALSTORAGE_KEYS_MAP.addressLabel;
    const keyTx = LOCALSTORAGE_KEYS_MAP.txPrivateNote;
    const data = globalData || {};

    // address label
    if (!data[key]) {
      let dStr = localStorage.getItem(key);
      let d = {};

      if (dStr) {
        d = JSON.parse(dStr).reduce((prev, curr) => {
          return {
            ...prev,
            [curr.a]: curr.l,
          };
        }, {});
      }

      setGlobalData({
        ...globalData,
        [key]: d,
      });
    }

    // private tx note
    if (!data[keyTx]) {
      let dStrTx = localStorage.getItem(keyTx);
      let dTx = {};

      if (dStrTx) {
        dTx = JSON.parse(dStrTx).reduce((prev, curr) => {
          return {
            ...prev,
            [curr.h]: curr.n,
          };
        }, {});
      }

      setGlobalData({
        ...globalData,
        [keyTx]: dTx,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalData]);

  const ScrollToTop = withRouter(_ScrollToTop);

  useEffect(() => {
    setLoading(true);
    reqProjectConfig()
      .then(resp => {
        const networks = [...NETWORK_OPTIONS];
        if (networks.every(n => n.id !== resp?.networkId)) {
          networks.push({
            url: '',
            name: resp?.networkId,
            id: resp?.networkId,
          });
        }
        // @ts-ignore
        const networkId = resp?.networkId;
        // @ts-ignore
        const md5String = new MD5().update(JSON.stringify(resp)).digest('hex');

        if (
          NETWORK_ID !== networkId ||
          localStorage.getItem(LOCALSTORAGE_KEYS_MAP.reqProjectConfigMD5) !==
            md5String
        ) {
          localStorage.setItem(LOCALSTORAGE_KEYS_MAP.networkId, networkId);
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.reqProjectConfigMD5,
            md5String,
          );
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.contracts,
            JSON.stringify(
              // @ts-ignore
              resp?.contracts.reduce(
                (prev, curr) => ({
                  ...prev,
                  [curr.key]: curr.address,
                }),
                {},
              ),
            ),
          );
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.apis,
            JSON.stringify({
              openAPIHost: resp?.OPEN_API_URL,
              rpcHost: resp?.CONFURA_URL,
            }),
          );
          // contract name tag config, hide for temp
          // localStorage.setItem(
          //   LOCALSTORAGE_KEYS_MAP.contractNameTag,
          //   JSON.stringify(
          //     // @ts-ignore
          //     resp?.contracts.reduce(
          //       (prev, curr) => ({
          //         ...prev,
          //         [curr.address]: curr.name,
          //       }),
          //       {},
          //     ),
          //   ),
          // );
          window.location.reload();
        }

        setGlobalData({
          ...globalData,
          ...(resp as object),
          networks,
        });
      })
      .catch(e => {
        console.log('request frontend config error: ', e);
      })
      .finally(() => {
        setLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    SET_ENV_CONFIG(ENV_CONFIG_LOCAL);
    getClientVersion().then(v => {
      console.log('conflux-network-version:', v);
    });
  }, [SET_ENV_CONFIG]);

  return (
    <ConfigProvider locale={i18n.language.includes('zh') ? zhCN : enUS}>
      <TxnHistoryProvider
        value={{
          config: {
            // txn history record i18n handler
            convert: info => {
              try {
                let data = JSON.parse(info);
                return t(
                  translations.connectWallet.notify.action[data.code],
                  data,
                );
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
          {/* @ts-ignore */}
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
              <Helmet
                titleTemplate="%s - ConfluxScan"
                defaultTitle="ConfluxScan"
              >
                <meta
                  name="description"
                  content={t(translations.metadata.description)}
                />
              </Helmet>
              {loading ? (
                <StyledMaskWrapper>
                  {/* <Spin spinning={loading} tip="Welcome to ConfluxScan" /> */}
                  <Loading></Loading>
                </StyledMaskWrapper>
              ) : (
                <ScrollToTop>
                  <Header />
                  <Main key={lang}>
                    <>
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
                        {/* <Route exact path="/contract" component={Contract} /> */}
                        <Route
                          exact
                          path={[
                            '/contract-info/:contractAddress',
                            '/token-info/:contractAddress',
                          ]}
                          render={(routeProps: any) => {
                            const path = routeProps.match.path.match(
                              /(\/.*\/)/,
                            )[1];

                            const address =
                              routeProps.match.params.contractAddress;

                            if (isSimplyBase32Address(address)) {
                              return <Contract {...routeProps} />;
                            } else {
                              if (isAddress(address)) {
                                return (
                                  <Redirect
                                    to={`${path}${formatAddress(address)}`}
                                  />
                                );
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }
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
                            const address =
                              routeProps.match.params.tokenAddress;

                            if (isSimplyBase32Address(address)) {
                              return <TokenDetail {...routeProps} />;
                            } else {
                              if (isAddress(address)) {
                                return (
                                  <Redirect
                                    to={`/token/${formatAddress(address)}`}
                                  />
                                );
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }
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
                        <Route
                          exact
                          path="/blockchain/blocks"
                          component={Blocks}
                        />
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
                          path="/contract-verification"
                          component={ContractVerification}
                        />
                        <Route
                          exact
                          path="/sponsor/:contractAddress"
                          render={(routeProps: any) => {
                            const address =
                              routeProps.match.params.contractAddress;

                            if (isSimplyBase32Address(address)) {
                              return <Sponsor {...routeProps} />;
                            } else {
                              if (isAddress(address)) {
                                return (
                                  <Redirect
                                    to={`/sponsor/${formatAddress(address)}`}
                                  />
                                );
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }
                          }}
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
                        {/* Compatible with Etherscan */}
                        <Route exact path="/tx/:hash" component={Transaction} />
                        <Route exact path="/block/:hash" component={Block} />
                        <Route exact path="/epoch/:number" component={Epoch} />
                        <Route
                          path="/address/:address"
                          render={(routeProps: any) => {
                            const address = routeProps.match.params.address;

                            if (isSimplyBase32Address(address)) {
                              return (
                                <AddressContractDetailPage {...routeProps} />
                              );
                            } else {
                              if (isAddress(address)) {
                                return (
                                  <Redirect
                                    to={`/address/${formatAddress(address)}`}
                                  />
                                );
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }
                          }}
                        />
                        <Route path="/search/:text" component={Search} />
                        {/* Tools */}
                        <Route
                          exact
                          path={[
                            '/address-converter',
                            '/address-converter/:address',
                          ]}
                          component={AddressConverter}
                        />
                        <Route exact path="/push-tx" component={BroadcastTx} />
                        <Route
                          exact
                          path={['/block-countdown', '/block-countdown/:block']}
                          component={BlocknumberCalc}
                        />
                        <Route exact path="/swap" component={Swap} />
                        <Route
                          exact
                          path={['/networkError', '/networkError/:network']}
                          component={NetworkError}
                        />
                        <Route
                          exact
                          path="/balance-checker"
                          component={BalanceChecker}
                        />
                        <Route
                          exact
                          path={['/nft-checker', '/nft-checker/:address']}
                          render={(routeProps: any) => {
                            const address = routeProps.match.params.address;

                            if (
                              isSimplyBase32Address(address) ||
                              lodash.isNil(address)
                            ) {
                              return <NFTChecker {...routeProps} />;
                            } else {
                              if (isAddress(address)) {
                                return (
                                  <Redirect
                                    to={`/nft-checker/${formatAddress(
                                      address,
                                    )}`}
                                  />
                                );
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }
                          }}
                        />
                        <Route exact path={['/cns-search']} component={CNS} />
                        <Route
                          exact
                          path={['/approval']}
                          component={Approval}
                        />
                        <Route
                          exact
                          path="/_benchmark"
                          component={ScanBenchmark}
                        />
                        <Route exact path="/fccfx" component={FCCFX} />

                        <Route exact path="/pos" component={posHomePage} />
                        <Route
                          exact
                          path="/pos/accounts"
                          component={posAccounts}
                        />
                        <Route
                          exact
                          path="/pos/committees"
                          component={posCommittees}
                        />
                        <Route
                          exact
                          path="/pos/committees/:blockNumber"
                          component={posCommittee}
                        />
                        <Route exact path="/pos/blocks" component={posBlocks} />
                        <Route
                          exact
                          path="/pos/blocks/:hash"
                          component={posBlock}
                        />
                        <Route
                          exact
                          path="/pos/transactions"
                          component={posTransactions}
                        />
                        <Route
                          exact
                          path="/pos/transactions/:number"
                          component={posTransaction}
                        />
                        <Route
                          exact
                          path="/pos/incoming-rank"
                          component={posIncomingRank}
                        />
                        <Route
                          exact
                          path="/pos/accounts/:address"
                          component={posAccount}
                        />
                        <Route
                          exact
                          path="/nft/:address/:id"
                          component={NFTDetail}
                        />

                        <Route
                          exact
                          path="/cross-space-charts"
                          component={CrossSpaceChart}
                        />

                        <Route
                          exact
                          path="/cross-space-charts/daily-cfx-transfer"
                          component={CrossSpaceDailyCFXTransfer}
                        />

                        <Route
                          exact
                          path="/cross-space-charts/daily-cfx-transfer-count"
                          component={CrossSpaceDailyCFXTransferCount}
                        />

                        <Route exact path="/nft-charts" component={NFTChart} />

                        <Route
                          exact
                          path="/nft-charts/assets"
                          component={NFTAssets}
                        />

                        <Route
                          exact
                          path="/nft-charts/holders"
                          component={NFTHolders}
                        />

                        <Route
                          exact
                          path="/nft-charts/contracts"
                          component={NFTContracts}
                        />

                        <Route
                          exact
                          path="/nft-charts/transfers"
                          component={NFTTransfers}
                        />

                        <Route exact path="/pos-charts" component={PoSChart} />

                        <Route
                          exact
                          path="/pos-charts/finalized-interval"
                          component={PoSFinalizedInterval}
                        />

                        <Route
                          exact
                          path="/pos-charts/daily-accounts"
                          component={PoSDailyAccounts}
                        />

                        <Route
                          exact
                          path="/pos-charts/daily-staking"
                          component={PoSDailyStaking}
                        />

                        <Route
                          exact
                          path="/pos-charts/daily-apy"
                          component={PoSDailyAPY}
                        />

                        <Route
                          exact
                          path="/pos-charts/total-reward"
                          component={PoSTotalReward}
                        />

                        <Route
                          exact
                          path="/pos-charts/daily-reward-rank"
                          component={PoSDailyRewardRank}
                        />

                        <Route
                          exact
                          path="/pos-charts/daily-reward-info"
                          component={PoSDailyRewardInfo}
                        />

                        <Route
                          exact
                          path="/pos-charts/daily-deposit"
                          component={PoSDailyDeposit}
                        />

                        <Route
                          exact
                          path="/pos-charts/participation-rate"
                          component={PoSDailyParticipation}
                        />

                        <Route exact path="/pow-charts" component={Chart} />

                        <Route
                          exact
                          path="/pow-charts/blocktime"
                          component={BlockTime}
                        />

                        <Route exact path="/pow-charts/tps" component={TPS} />

                        <Route
                          exact
                          path="/pow-charts/hashrate"
                          component={HashRate}
                        />

                        <Route
                          exact
                          path="/pow-charts/difficulty"
                          component={Difficulty}
                        />

                        <Route
                          exact
                          path="/pow-charts/supply"
                          component={TotalSupply}
                        />

                        <Route
                          exact
                          path="/pow-charts/circulating"
                          component={CirculatingSupply}
                        />

                        <Route exact path="/pow-charts/tx" component={Tx} />

                        <Route
                          exact
                          path="/pow-charts/token-transfer"
                          component={TokenTransfer}
                        />

                        <Route
                          exact
                          path="/pow-charts/cfx-transfer"
                          component={CFXTransfer}
                        />

                        <Route
                          exact
                          path="/pow-charts/cfx-holder-accounts"
                          component={CFXHolderAccounts}
                        />

                        <Route
                          exact
                          path="/pow-charts/account-growth"
                          component={AccountGrowth}
                        />

                        <Route
                          exact
                          path="/pow-charts/active-accounts"
                          component={ActiveAccounts}
                        />

                        <Route
                          exact
                          path="/pow-charts/contracts"
                          component={ContractsCharts}
                        />

                        <Route exact path="/Profile" component={Profile} />

                        <Route component={NotFoundPage} />
                      </Switch>
                    </>
                  </Main>
                  <Footer />
                  <GlobalStyle />
                  {/* <CookieTip />
                  <GlobalTip tipKey="addressWarning" /> */}
                </ScrollToTop>
              )}
              <GlobalNotify />
            </CfxProvider>
          </BrowserRouter>
        </SWRConfig>
      </TxnHistoryProvider>
    </ConfigProvider>
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

const StyledMaskWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
