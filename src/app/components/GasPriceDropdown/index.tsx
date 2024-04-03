import React, { useState, useEffect, useCallback } from 'react';
import { media } from 'styles/media';
import styled from 'styled-components';
import { Translation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { useGasPrice, defaultGasPriceBundle } from 'utils/hooks/useGlobal';
import { reqGasPrice } from 'utils/httpRequest';
import { useInterval } from 'react-use';

import { fromDripToGdrip } from 'utils';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';

import IconGas from 'images/icon-gas.svg';
import IconRefresh from 'images/refresh.svg';
import GasLow from 'images/gas-low.png';
import GasMedian from 'images/gas-median.png';
import GasHigh from 'images/gas-high.png';
import ArrowDown from 'images/arrowDown.svg';

const roundNumberWithSuffix = (value: string): string => {
  if (value === '< 0.001') return value;

  const numericPart = parseFloat(value);
  if (isNaN(numericPart)) {
    throw new Error('Invalid number');
  }

  const roundedNumber = Math.round(numericPart * 10) / 10;

  const suffix = value.replace(/[0-9.-]/g, '');

  const roundedString =
    roundedNumber % 1 === 0 ? roundedNumber : roundedNumber.toFixed(1);

  return roundedString + suffix;
};
const refreshGasPrice = {
  init: false,
};
export const GasPriceDropdown = () => {
  const [showModal, setShowModal] = useState(false);
  const [globalData = defaultGasPriceBundle, setGasPrice] = useGasPrice();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOutsideClick = useCallback(
    event => {
      if (showModal && !event.target.closest('.modal')) {
        setShowModal(false);
      }
    },
    [showModal],
  );

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    const res = await reqGasPrice();
    if (res) {
      setGasPrice(res);
    }
    setIsRefreshing(false);
  }, [setGasPrice]);

  useEffect(() => {
    if (!refreshGasPrice.init) {
      refreshGasPrice.init = true;
      refreshData();
    }
  }, [refreshData]);

  useInterval(() => {
    refreshData();
  }, 20000);

  useEffect(() => {
    if (showModal) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showModal, handleOutsideClick]);

  return (
    <GasDetail>
      <Trigger onClick={() => setShowModal(true)}>
        <SkeletonContainer shown={globalData.gasPriceInfo.tp50 === 0}>
          <img src={IconGas} alt="" />
          <span className="value">
            {roundNumberWithSuffix(
              fromDripToGdrip(globalData.gasPriceInfo.tp50, false, {
                precision: 1,
              }),
            )}
          </span>
          <span>Gdrip</span>
        </SkeletonContainer>
      </Trigger>
      {showModal && (
        <Modal className="modal modal-enter">
          <Title>
            <div>
              <Translation>
                {t => t(translations.gaspriceDropdown.blockHeight)}
              </Translation>
              :
              <SkeletonContainer shown={globalData.blockHeight === 0}>
                {globalData.blockHeight}
              </SkeletonContainer>
            </div>
            <img
              className={'refresh ' + (isRefreshing ? 'rotate-animation' : '')}
              src={IconRefresh}
              alt=""
              onClick={() => refreshData()}
            />
          </Title>
          <GasModuleWrapper>
            <GasModuleItem>
              <img src={GasLow} alt="" />
              <div className="gasLevel">
                <Translation>
                  {t => t(translations.gaspriceDropdown.low)}
                </Translation>
              </div>
              <div className="gasPrice low">
                <SkeletonContainer shown={globalData.gasPriceInfo.min === 0}>
                  {roundNumberWithSuffix(
                    fromDripToGdrip(globalData.gasPriceInfo.min, false, {
                      precision: 1,
                    }),
                  )}{' '}
                  Gdrip
                </SkeletonContainer>
              </div>
            </GasModuleItem>
            <GasModuleItem>
              <img src={GasMedian} alt="" />
              <div className="gasLevel">
                <Translation>
                  {t => t(translations.gaspriceDropdown.median)}
                </Translation>
              </div>
              <div className="gasPrice median">
                <SkeletonContainer shown={globalData.gasPriceInfo.tp50 === 0}>
                  {roundNumberWithSuffix(
                    fromDripToGdrip(globalData.gasPriceInfo.tp50, false, {
                      precision: 1,
                    }),
                  )}{' '}
                  Gdrip
                </SkeletonContainer>
              </div>
            </GasModuleItem>
            <GasModuleItem>
              <img src={GasHigh} alt="" />
              <div className="gasLevel">
                <Translation>
                  {t => t(translations.gaspriceDropdown.high)}
                </Translation>
              </div>
              <div className="gasPrice high">
                <SkeletonContainer shown={globalData.gasPriceInfo.max === 0}>
                  {roundNumberWithSuffix(
                    roundNumberWithSuffix(
                      fromDripToGdrip(globalData.gasPriceInfo.max, false, {
                        precision: 1,
                      }),
                    ),
                  )}{' '}
                  Gdrip
                </SkeletonContainer>
              </div>
            </GasModuleItem>
          </GasModuleWrapper>
          <GasMarketWrapper>
            <div className="gasPriceTitle">
              <div>
                <Translation>
                  {t => t(translations.gaspriceDropdown.market)}
                </Translation>
              </div>

              <div>
                <Translation>
                  {t => t(translations.gaspriceDropdown.latest60Blocks)}
                </Translation>
              </div>
            </div>
            <div className="mark markStart">
              <div>
                {roundNumberWithSuffix(
                  fromDripToGdrip(globalData.gasPriceMarket.tp25, false, {
                    precision: 1,
                  }),
                )}
              </div>
              <img src={ArrowDown} alt="?" />
            </div>
            <div className="mark markEnd">
              <div>
                {roundNumberWithSuffix(
                  fromDripToGdrip(globalData.gasPriceMarket.tp75, false, {
                    precision: 1,
                  }),
                )}
              </div>
              <img src={ArrowDown} alt="?" />
            </div>
            <div className="gasPriceLine">
              <div></div>
              <div className="active"></div>
              <div></div>
            </div>
            <div className="gasPriceMarketMid">
              <div>
                <div className="title">Min</div>
                <div className="left value">
                  {roundNumberWithSuffix(
                    fromDripToGdrip(globalData.gasPriceMarket.min, false, {
                      precision: 1,
                    }),
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="activeLine"></div>
                <div className="title">Mid</div>
                <div className="middle value active">
                  {roundNumberWithSuffix(
                    fromDripToGdrip(globalData.gasPriceMarket.tp50, false, {
                      precision: 1,
                    }),
                  )}
                </div>
              </div>
              <div>
                <div className="title">Max</div>
                <div className="rigth value">
                  {roundNumberWithSuffix(
                    fromDripToGdrip(globalData.gasPriceMarket.max, false, {
                      precision: 1,
                    }),
                  )}
                </div>
              </div>
            </div>
          </GasMarketWrapper>
        </Modal>
      )}
      {showModal && <div className="modal-background"></div>}
    </GasDetail>
  );
};
const GasMarketWrapper = styled.div`
  position: relative;
  .gasPriceTitle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    color: #424a71;
    font-weight: 500;
    div:last-child {
      color: #9b9eac;
      font-size: 12px;
    }
  }
  .mark {
    position: absolute;
    font-size: 10px;
    color: #9b9eac;
    margin-top: 8px;
    div {
      width: fit-content;
      transform: translateX(-50%);
    }
    img {
      margin-top: -8px;
      transform: translateX(-50%);
    }
  }
  .markStart {
    left: 25%;
  }
  .markEnd {
    left: 75%;
  }
  .gasPriceLine {
    margin-top: 32px;
    width: 100%;
    display: flex;
    gap: 2px;
    div {
      width: 25%;
      height: 8px;
      background: #f0f4f3;
    }
    div:nth-child(1) {
      border-radius: 4px 0 0 4px;
    }
    div:nth-child(3) {
      border-radius: 0 4px 4px 0;
    }
    .active {
      width: 50%;
      background: #1e3de4;
    }
  }
  .gasPriceMarketMid {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 4px;

    .relative {
      position: relative;
    }
    .activeLine {
      width: 1px;
      height: 12px;
      background: #1e3de4;
      position: absolute;
      margin-top: -10px;
      left: 50%;
    }
    .title {
      font-size: 12px;
      font-weight: 450;
      color: #9b9eac;
    }
    .value {
      font-size: 12px;
      font-weight: 500;
      color: #424a71;
    }
    .active {
      color: #1e3de4;
    }
    .left {
      text-align: left;
    }
    .middle {
      text-align: center;
    }
    .rigth {
      text-align: right;
    }
  }
`;

const GasDetail = styled.div`
  position: relative;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-enter {
    animation: fadeIn 0.35s ease-out forwards;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rotate-animation {
    animation: rotate 0.3s ease-out infinite;
  }

  .refresh:active {
    transform: scale(0.75);
  }
  .modal-background {
    display: none;
  }
  ${media.s} {
    .modal {
      position: fixed;
      width: 100%;
      top: 55px;
    }
    .modal-background {
      top: 60px;
      background-color: rgba(0, 0, 0, 0.5);
      position: fixed;
      left: 0;
      width: 100%;
      height: 920px;
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: -1;
    }
  }
`;

const Trigger = styled.div`
  display: flex;
  gap: 4px;
  color: #424a71;
  margin-left: 10px;
  cursor: pointer;
  font-weight: 500;
  .value {
    color: #1e3de4;
  }
`;

const Modal = styled.div`
  width: 400px;
  height: fit-content;
  background: #fff;
  position: absolute;
  right: 0;
  top: 35px;
  padding: 16px;
  z-index: 10;
  box-shadow: 8px 30px 80px 0px #707e9e3d;
`;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  div:first-child {
    display: flex;
    color: #20253a;
    font-size: 16px;
    font-weight: 500;
  }
  .blockHeight {
    min-width: 100px;
  }
`;
const GasModuleWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
`;
const GasModuleItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  background: #fafbfc;
  padding: 8px;
  img {
    width: 29.71px;
    height: 24.36px;
    margin-top: 5px;
  }
  .gasLevel {
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
    margin-top: 5px;
  }
  .gasPrice {
    font-size: 18px;
    margin-top: 4px;
    line-height: 20px;
    font-weight: 700;
    margin-top: 5px;
    text-align: center;
  }
  .low {
    color: #4ca960;
  }
  .median {
    color: #395bd4;
  }
  .high {
    color: #d74841;
  }
`;
