import React, { useState, useEffect, useCallback } from 'react';
import { media } from 'styles/media';
import styled from 'styled-components/macro';
import IconGas from 'images/icon-gas.svg';
import IconRefresh from 'images/refresh.svg';
import GasLow from 'images/gas-low.png';
import GasMedian from 'images/gas-median.png';
import GasHigh from 'images/gas-high.png';

export const GasPriceDropdown = () => {
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 3000);
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
        <img src={IconGas} alt="" />
        <span className="value">1000</span>
        <span>Gdrip</span>
      </Trigger>
      {showModal && (
        <Modal className="modal modal-enter">
          <Title>
            <div>Block Height: 85367685</div>
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
              <div className="gasPrice low">100 Grip</div>
            </GasModuleItem>
            <GasModuleItem>
              <img src={GasMedian} alt="" />
              <div className="gasLevel">Median</div>
              <div className="gasPrice median">120 Grip</div>
            </GasModuleItem>
            <GasModuleItem>
              <img src={GasHigh} alt="" />
              <div className="gasLevel">High</div>
              <div className="gasPrice high">150 Grip</div>
            </GasModuleItem>
          </GasModuleWrapper>
        </Modal>
      )}
    </GasDetail>
  );
};
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
  ${media.s} {
    .modal {
      position: fixed;
      width: 100%;
      top: 55px;
    }
  }
`;

const Trigger = styled.div`
  display: flex;
  gap: 4px;
  color: #424a71;
  margin-left: 10px;
  cursor: pointer;
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
    color: #20253a;
    font-size: 16px;
    font-weight: 500;
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
    width: 32px;
    height: 24px;
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
