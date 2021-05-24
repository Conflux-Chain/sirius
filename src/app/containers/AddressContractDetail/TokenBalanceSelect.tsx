import React, { useRef } from 'react';
import styled from 'styled-components';
import { useAccountTokenList } from 'utils/api';
import { Description } from 'app/components/Description';
import { Card } from '../../components/Card';
import { ChevronUp } from '@zeit-ui/react-icons';
import { useClickAway, useToggle } from 'react-use';
import { media } from 'styles/media';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { defaultTokenIcon } from '../../../constants';
import { Link } from 'react-router-dom';
import { Text } from '../../components/Text';
import { formatBalance, formatNumber } from 'utils/index';
import { cfxTokenTypes } from '../../../utils/constants';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { getCurrencySymbol } from 'utils/constants';

const skeletonStyle = { width: '7rem', height: '2.5rem' };

export function TokenBalanceSelect({ address = '' } = {}) {
  const { data: tokensData } = useAccountTokenList(address, ['icon']);
  const tokens = tokensData?.list || [];
  const loading = tokensData?.loading;

  return (
    <SkeletonContainer shown={loading} style={skeletonStyle}>
      <Select>{tokens}</Select>
    </SkeletonContainer>
  );
}

function Select({ children = [] } = {}) {
  const { t } = useTranslation();
  const [expanded, toggle] = useToggle(false);
  const selectRef = useRef<HTMLDivElement>(null);
  useClickAway(selectRef, () => toggle(false));
  const tokenCount = children.length;

  const children20 = children
    .filter((c: any) => c && c.transferType === cfxTokenTypes.erc20)
    .map((t, idx) => <SelectItem key={idx} {...t} />);

  const children721 = children
    .filter((c: any) => c && c.transferType === cfxTokenTypes.erc721)
    .map((t, idx) => <SelectItem key={idx} {...t} />);

  return (
    <SelectWrapper ref={selectRef}>
      <SelectTokenBox onClick={() => tokenCount && toggle()}>
        <SelectTokenCount>{tokenCount}</SelectTokenCount>
        <SelectTokenDropdownIcon expanded={expanded}>
          <ChevronUp color="#7e8295" />
        </SelectTokenDropdownIcon>
        {expanded && (
          <SelectDropdown>
            <Card className="token-balance-select-content">
              <Title className="token-type">
                {t(translations.header.tokens20).replace('Tokens', 'Token')} (
                {children20.length})
              </Title>
              {children20}
              {children721.length > 0 ? (
                <Title className="token-type">
                  {t(translations.header.tokens721).replace('Tokens', 'Token')}{' '}
                  ({children721.length})
                </Title>
              ) : null}
              {children721}
            </Card>
          </SelectDropdown>
        )}
      </SelectTokenBox>
    </SelectWrapper>
  );
}

function SelectItem({
  icon,
  balance,
  price,
  name,
  symbol,
  address,
  decimals,
  transferType,
}) {
  const currencyUnit = getCurrencySymbol();
  const title = (
    <SelectItemTitle key="title">
      <SelectItemTokenIcon
        src={icon || defaultTokenIcon}
        alt={`${name} icon`}
      />
      <SelectItemTextTitle>
        <Link to={`/token/${address}`}>{name}</Link>
      </SelectItemTextTitle>
    </SelectItemTitle>
  );
  let decimal = decimals;
  if (transferType === cfxTokenTypes.erc721) {
    decimal = 0;
  }
  if (transferType === cfxTokenTypes.erc1155) {
    decimal = -1;
  }
  const content = (
    <SelectItemContent key="content">
      <SelectItemContentBalance key="balance">
        {transferType !== cfxTokenTypes.erc1155 ? (
          <Text
            hoverValue={formatBalance(balance, decimal, true) + ' ' + symbol}
          >
            {formatBalance(balance, decimal) + ' ' + symbol}
          </Text>
        ) : (
          '-'
        )}
      </SelectItemContentBalance>
      {transferType === cfxTokenTypes.erc20 ? (
        <SelectItemContentBalance key="price">
          <Text
            hoverValue={`1 ${symbol} ≈ ${currencyUnit}${
              price
                ? formatNumber(price || 0, {
                    withUnit: false,
                    precision: 2,
                    keepZero: true,
                  })
                : '--'
            }`}
          >
            {`${currencyUnit}${
              price
                ? formatNumber(
                    new BigNumber(price || 0)
                      .multipliedBy(
                        new BigNumber(
                          new BigNumber(balance).div(
                            new BigNumber(10).pow(decimals),
                          ),
                        ),
                      )
                      .toFixed(2),
                    {
                      withUnit: false,
                      precision: 2,
                      keepZero: true,
                    },
                  )
                : '--'
            }`}
          </Text>
        </SelectItemContentBalance>
      ) : null}
    </SelectItemContent>
  );
  return (
    <Description
      key={symbol}
      title={title}
      style={{
        flexDirection: 'row',
      }}
    >
      {content}
    </Description>
  );
}

const SelectWrapper = styled.div`
  font-size: 1rem;
`;
const SelectTokenBox = styled.div`
  position: relative;
  min-width: 9rem;
  height: 2.57rem;
  border-radius: 0.29rem;
  border: 0.07rem solid #e8e9ea;
  padding: 0.64rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  // ${media.s} {
  //   min-width: 6.67rem;
  //   height: 1.84rem;
  // }
`;
const SelectTokenCount = styled.div`
  font-size: 1.27rem;
  font-weight: 700;
`;
const SelectTokenDropdownIcon = styled.div<{ expanded: boolean }>`
  transform: ${props => (props.expanded ? 'unset' : 'rotate(180deg)')};
`;
const SelectDropdown = styled.div`
  z-index: 210;
  position: absolute;
  left: -1.5rem;
  top: 4.5rem;
  min-width: 400px;
  max-height: 400px;
  box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
  overflow-y: auto;

  .token-balance-select-content.card > .content {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    > .token-type:first-child {
      border-top: none;
    }
    > div:last-child {
      border-bottom: none;
    }
  }
  .left {
    width: 60% !important;
    line-height: 1.5;
    padding: 0.6rem 0;
  }
  .right {
    line-height: 1.5;
    padding: 0.6rem 0;
  }
  ${media.s} {
    top: 3.8rem;
    min-width: calc(100vw - 40px);
  }
`;

const SelectItemTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-weight: 500;
  height: 100%;
`;
const SelectItemTokenIcon = styled.img`
  margin-right: 0.86rem;
  width: 1rem;
  height: 1rem;
`;
const SelectItemTextTitle = styled.span`
  color: #2f3c3f;
`;
const SelectItemContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-weight: 400;
  font-size: 12px;
  height: 100%;
`;
const SelectItemContentBalance = styled.span``;

const Title = styled.div`
  display: block;
  font-size: 14px;
  color: #7e8598;
  font-weight: 500;
  border-bottom: 1px solid #e8e9ea;
  line-height: 3rem;
`;
