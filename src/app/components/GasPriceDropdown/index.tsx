import React, { useState, useEffect, useCallback } from 'react';
import { media } from 'styles/media';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';

import { reqGasPrice } from 'utils/httpRequest';
import { fromDripToGdrip } from 'utils';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { translations } from 'locales/i18n';

import IconGas from 'images/icon-gas.svg';
import IconRefresh from 'images/refresh.svg';
import GasLow from 'images/gas-low.png';
import GasMedian from 'images/gas-median.png';
import GasHigh from 'images/gas-high.png';
import ArrowDown from 'images/arrowDown.svg';

interface GasPriceBundle {
  gasPriceInfo: {
    min: number;
    tp50: number;
    max: number;
  };
  gasPriceMarket: {
    min: number;
    tp25: number;
    tp50: number;
    tp75: number;
    max: number;
  };
  maxEpoch: number;
  minEpoch: number;
  maxTime: string;
  minTime: string;
  blockHeight: number;
}
export const GasPriceDropdown = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gasPriceBundle, setGasPriceBundle] = useState<GasPriceBundle>({
    gasPriceInfo: {
      min: 0,
      tp50: 0,
      max: 0,
    },
    gasPriceMarket: {
      min: 0,
      tp25: 0,
      tp50: 0,
      tp75: 0,
      max: 0,
    },
    maxEpoch: 0,
    minEpoch: 0,
    maxTime: '0',
    minTime: '0',
    blockHeight: 0,
  });

  const refreshData = async () => {
    setIsRefreshing(true);
    const res = await reqGasPrice();
    if (res) {
      setGasPriceBundle(res);
    }
    setIsRefreshing(false);
  };

  const handleOutsideClick = useCallback(
    event => {
      if (showModal && !event.target.closest('.modal')) {
        setShowModal(false);
      }
    },
    [showModal],
  );

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (showModal) {
      refreshData();
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showModal, handleOutsideClick]);

  return (
    <GasDetail>
      <Trigger onClick={() => setShowModal(true)}>
        <SkeletonContainer shown={gasPriceBundle.gasPriceInfo.tp50 === 0}>
          <img src={IconGas} alt="" />
          <span className="value">
            {fromDripToGdrip(gasPriceBundle.gasPriceInfo.tp50, false)}
          </span>
          <span>Gdrip</span>
        </SkeletonContainer>
      </Trigger>
      {showModal && (
        <Modal className="modal modal-enter">
          <Title>
            <div>
              {t(translations.block.blockHeight)}:
              <SkeletonContainer shown={gasPriceBundle.blockHeight === 0}>
                <div className="blockHeight">{gasPriceBundle.blockHeight}</div>
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
              <div className="gasLevel">Low</div>
              <div className="gasPrice low">
                <SkeletonContainer
                  shown={gasPriceBundle.gasPriceInfo.min === 0}
                >
                  {fromDripToGdrip(gasPriceBundle.gasPriceInfo.min, false)}{' '}
                  Gdrip
                </SkeletonContainer>
              </div>
            </GasModuleItem>
            <GasModuleItem>
              <img src={GasMedian} alt="" />
              <div className="gasLevel">Median</div>
              <div className="gasPrice median">
                <SkeletonContainer
                  shown={gasPriceBundle.gasPriceInfo.tp50 === 0}
                >
                  {fromDripToGdrip(gasPriceBundle.gasPriceInfo.tp50, false)}{' '}
                  Gdrip
                </SkeletonContainer>
              </div>
            </GasModuleItem>
            <GasModuleItem>
              <img src={GasHigh} alt="" />
              <div className="gasLevel">High</div>
              <div className="gasPrice high">
                <SkeletonContainer
                  shown={gasPriceBundle.gasPriceInfo.max === 0}
                >
                  {fromDripToGdrip(gasPriceBundle.gasPriceInfo.max, false)}{' '}
                  Gdrip
                </SkeletonContainer>
              </div>
            </GasModuleItem>
          </GasModuleWrapper>
          <GasMarketWrapper>
            <div className="gasPriceTitle">Gas Price Market</div>
            <div className="mark markStart">
              <div>
                {fromDripToGdrip(gasPriceBundle.gasPriceMarket.tp25, false)}
              </div>
              <img src={ArrowDown} alt="?" />
            </div>
            <div className="mark markEnd">
              <div>
                {fromDripToGdrip(gasPriceBundle.gasPriceMarket.tp75, false)}
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
                  {fromDripToGdrip(gasPriceBundle.gasPriceMarket.min, false)}
                </div>
              </div>
              <div className="relative">
                <div className="activeLine"></div>
                <div className="title">Mid</div>
                <div className="middle value active">
                  {fromDripToGdrip(gasPriceBundle.gasPriceMarket.tp50, false)}
                </div>
              </div>
              <div>
                <div className="title">Max</div>
                <div className="rigth value">
                  {fromDripToGdrip(gasPriceBundle.gasPriceMarket.max, false)}
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
    margin-top: 16px;
    color: #424a71;
    font-weight: 500;
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
    color: #17b38a;
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
