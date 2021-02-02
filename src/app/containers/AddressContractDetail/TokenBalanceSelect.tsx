import React, { ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { useAccountTokenList } from 'utils/api';
import { Description } from 'app/components/Description';
import { Card } from '../../components/Card';
import { ChevronUp } from '@zeit-ui/react-icons';
import { useToggle, useClickAway } from 'react-use';
import { media } from 'styles/media';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { defaultTokenIcon } from '../../../constants';
import { Link } from 'react-router-dom';
import { Text } from '../../components/Text';
import { formatBalance } from 'utils/index';
import { cfxTokenTypes } from '../../../utils/constants';

const skeletonStyle = { width: '7rem', height: '2.5rem' };

export function TokenBalanceSelect({ address = '' } = {}) {
  const { data: tokensData } = useAccountTokenList(address, ['icon']);
  const tokens = tokensData?.list || [];
  const loading = tokensData?.loading;

  const tokenItems = tokens.map((t, idx) => (
    <SelectItem key={idx} isLastOne={idx === tokens.length - 1} {...t} />
  ));

  return (
    <SkeletonContainer shown={loading} style={skeletonStyle}>
      <Select>{tokenItems}</Select>
    </SkeletonContainer>
  );
}

function Select({ children = [] } = {}) {
  const [expanded, toggle] = useToggle(false);
  const selectRef = useRef<HTMLDivElement>(null);
  useClickAway(selectRef, () => toggle(false));
  const tokenCount = children.length;
  const childrenWithDivider = children.reduce((acc, child) => {
    acc.push(child);
    return acc;
  }, [] as ReactNode[]);

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
              {childrenWithDivider}
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
  name,
  symbol,
  isLastOne,
  address,
  decimals,
  transferType,
}) {
  const title = (
    <SelectItemTitle key="title">
      <SelectItemTokenIcon
        src={icon || defaultTokenIcon}
        alt={`${name} icon`}
      />
      <SelectItemTextTitle>
        <Link to={`/token/${address}`}>{`${name} (${symbol})`}</Link>
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
    </SelectItemContent>
  );
  return (
    <Description
      key={symbol}
      title={title}
      style={{
        minWidth: 'unset',
        borderBottom: isLastOne ? 'unset' : undefined,
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
  min-width: 9rem;
  height: 2.57rem;
  border-radius: 0.29rem;
  border: 0.07rem solid #e8e9ea;
  padding: 0.64rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${media.s} {
    min-width: 6.67rem;
    height: 1.84rem;
  }
`;
const SelectTokenCount = styled.div`
  font-size: 1.27rem;
  font-weight: 700;
`;
const SelectTokenDropdownIcon = styled.div<{ expanded: boolean }>`
  transform: ${props => (props.expanded ? 'unset' : 'rotate(180deg)')};
`;
const SelectDropdown = styled.div`
  z-index: 100;
  position: absolute;
  margin-left: -2.1429rem;
  top: 8rem;
  .token-balance-select-content.card > .content {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  ${media.s} {
    top: 5rem;
    right: 5.5rem;
  }
`;

const SelectItemTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 500;
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
  flex-direction: row;
  align-items: center;
  font-weight: 500;
`;
const SelectItemContentBalance = styled.span``;
// const SelectItemContentSymbol = styled.span``;
