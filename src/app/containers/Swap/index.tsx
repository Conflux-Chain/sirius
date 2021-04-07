import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { usePortal } from 'utils/hooks/usePortal';
import { abi } from 'utils/contract/wcfx.json';
import { ADDRESS_WCFX, NETWORK_ID } from 'utils/constants';
import { isSafeNumberOrNumericStringInput, formatNumber } from 'utils';
import { Card } from '../../components/Card/Loadable';
import styled from 'styled-components/macro';
import { ConnectButton } from '../../components/ConnectWallet';
import { Select } from '../../components/Select';
import { Input, Button } from '@cfxjs/react-ui';
import { Tooltip } from '../../components/Tooltip';

import imgSwapArrowDown from 'images/swap-arrow-down.png';
import imgInfo from 'images/info.svg';

const cfx = new Conflux({
  networkId: NETWORK_ID,
});
// @ts-ignore
cfx.provider = window.conflux;

const contract = cfx.Contract({
  address: ADDRESS_WCFX,
  abi,
});

interface SwapItemProps {
  type: string;
  selected: string;
  value: string;
  balance: string;
  onSelectChange: (value) => void;
  onInputChange: (value) => void;
}

const SwapItem = ({
  type,
  selected,
  value,
  balance,
  onInputChange,
  onSelectChange,
}: SwapItemProps) => {
  let title = 'From';
  let balanceTitle: React.ReactNode = 'Balance';
  let max: React.ReactNode = <span className="max">MAX</span>;

  if (type === 'to') {
    title = 'To';
    max = null;
  }

  if (selected === 'cfx' && type === 'from') {
    balanceTitle = (
      <>
        <Tooltip hoverable text={'xxxxxx'} placement="top">
          <span className="icon-container">
            <img src={imgInfo} alt="?" className="icon-info" />
          </span>
        </Tooltip>
        <span className="text">Available Balance</span>
      </>
    );
  }

  const handleInputChange = e => {
    let value = e.target.value;
    if (value === '' || isSafeNumberOrNumericStringInput(e.target.value)) {
      onInputChange(e.target.value);
    }
  };

  const b = formatNumber(new BigNumber(balance).div(1e18).toString(), {
    precision: 6,
  });

  return (
    <StyledSwapItemWrapper>
      <div className="top">
        <span className="left">{title}</span>
        <span className="right">
          {balanceTitle}: {b}
        </span>
      </div>
      <div className="bottom">
        <span className="left">
          <Input
            placeholder="0.0"
            value={value}
            size="small"
            onChange={handleInputChange}
          ></Input>
        </span>
        <span className="right">
          {max}
          <span className="select">
            <Select value={selected} size="small" onChange={onSelectChange}>
              <Select.Option value="cfx">cfx</Select.Option>
              <Select.Option value="wcfx">wcfx</Select.Option>
            </Select>
          </span>
        </span>
      </div>
    </StyledSwapItemWrapper>
  );
};

const StyledSwapItemWrapper = styled.div`
  width: 384px;
  height: 86px;
  border-radius: 4px;
  border: 1px solid #cccccc;
  padding: 16px;

  .top {
    display: flex;
    justify-content: space-between;
    color: #7e8598;
    line-height: 18px;

    .icon-container {
      cursor: pointer;

      .icon-info {
        margin-top: -4px;
      }
    }

    .text {
      margin-left: 5px;
    }

    .right {
      display: inline-flex;
      align-items: center;
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;

    .right {
      display: flex;
      align-items: center;

      .max {
        width: 51px;
        height: 20px;
        background: #fede1b;
        border-radius: 2px;
        display: inline-flex;
        justify-content: center;
        color: #65709a;
        cursor: pointer;
      }
    }
  }
`;

export function Swap() {
  const [wcfx, setWcfx] = useState('0');
  const {
    installed,
    accounts,
    connected,
    balances: { cfx },
  } = usePortal();
  const [fromToken, setFromToken] = useState({
    type: 'wcfx',
    value: '',
  });
  const [toToken, setToToken] = useState({
    type: 'cfx',
    value: '',
  });
  const balances = {
    cfx,
    wcfx,
  };

  useEffect(() => {
    if (installed && accounts.length) {
      contract.balanceOf(accounts[0]).then(data => {
        setWcfx(data.toString());
      });
    }

    // @ts-ignore
    // contract.abi
    //   .transfer(account, 10000000000000000000)
    //   .then(d => console.log(d))
    //   .catch(e => {
    //     console.log(e);
    //   });

    // // deposit 存款
    // const txnHash2 = contract
    //   .deposit()
    //   .sendTransaction({
    //     from: account,
    //     value: 3 * 1e18,
    //   })
    //   .then(console.log)
    //   .catch(console.log);
    // console.log(999, txnHash2);

    // // withdraw 取款
    // const txnHash2 = contract
    //   .withdraw(10 * 1e18)
    //   .sendTransaction({
    //     from: account,
    //   })
    //   .then(console.log)
    //   .catch(console.log);
    // console.log(999, txnHash2);
  }, [installed, accounts, connected]);

  const handleFromInputChange = value => {
    setFromToken({
      ...fromToken,
      value,
    });
  };

  const handleToInputChange = value => {
    setToToken({
      ...toToken,
      value,
    });
  };

  const handleFromSelectChange = value => {
    handleSwitch();
  };

  const handleToSelectChange = value => {
    handleSwitch();
  };

  const handleSwitch = () => {
    const toTokenCopy = toToken;
    setToToken(fromToken);
    setFromToken(toTokenCopy);
  };

  return (
    <StyledSwapWrapper>
      <Card className="card">
        <div className="body">
          <div className="title">Swap</div>
          <div className="content">
            <SwapItem
              balance={balances[fromToken.type]}
              value={fromToken.value}
              type="from"
              selected={fromToken.type}
              onInputChange={handleFromInputChange}
              onSelectChange={handleFromSelectChange}
            ></SwapItem>
            <div className="switch">
              <img
                alt="switch-icon"
                src={imgSwapArrowDown}
                onClick={handleSwitch}
              ></img>
            </div>
            <SwapItem
              balance={balances[toToken.type]}
              value={toToken.value}
              type="to"
              selected={toToken.type}
              onInputChange={handleToInputChange}
              onSelectChange={handleToSelectChange}
            ></SwapItem>
          </div>
        </div>
      </Card>
      <div className="button-container">
        <ConnectButton>
          <Button variant="solid" color="primary" size="small">
            Connect wallet
          </Button>
        </ConnectButton>
      </div>
    </StyledSwapWrapper>
  );
}

const StyledSwapWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 448px;
  margin: auto;

  .card.card {
    width: 448px;
    height: 330px;
    margin-top: 100px;
  }

  .body {
    padding: 20px 0 40px;

    .title {
      font-size: 18px;
      font-weight: 500;
      color: #3a3a3a;
      line-height: 26px;
    }
  }

  .content {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .switch {
      width: 24px;
      height: 24px;
      cursor: pointer;
      margin: 8px;
    }
  }

  .button-container {
    height: 80px;
    background: #eeeeee;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
