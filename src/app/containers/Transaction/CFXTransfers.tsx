import React, { memo } from 'react';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import iconInfo from 'images/info.svg';
import { fromDripToCfx } from '@cfxjs/sirius-next-common/dist/utils';
import { ContractNameItem, renderAddressWithNameMap } from './utils';
import lodash from 'lodash';

interface CfxTransferItem {
  from: string;
  to: string;
  value: string;
  type: string;
  transactionTraceIndex: number;
}

const From: React.FC<{
  item: CfxTransferItem;
  nameMap?: Record<string, ContractNameItem>;
}> = ({ item, nameMap }) => {
  const renderAddress = renderAddressWithNameMap(nameMap);
  return renderAddress(item.from, item, 'from', false);
};
const To: React.FC<{
  item: CfxTransferItem;
  nameMap?: Record<string, ContractNameItem>;
}> = ({ item, nameMap }) => {
  const renderAddress = renderAddressWithNameMap(nameMap);
  return renderAddress(item.to, item, 'to', false);
};
const Amount: React.FC<{ value: string }> = ({ value }) => {
  const amount = fromDripToCfx(value, true);
  return (
    <Text tag="span" hoverValue={`${amount} CFX`} style={{ whiteSpace: 'pre' }}>
      {' '}
      {amount}{' '}
    </Text>
  );
};

const TransferItem = ({
  item,
  nameMap,
}: {
  item: CfxTransferItem;
  nameMap?: Record<string, ContractNameItem>;
}) => {
  return (
    <TransferItemWrapper>
      <Trans i18nKey={translations.transaction.cfxTransferInfo}>
        Transfer <Amount value={item.value} /> CFX From
        <From item={item} nameMap={nameMap} /> To
        <To item={item} nameMap={nameMap} />
      </Trans>
    </TransferItemWrapper>
  );
};
export const CFXTransfers = memo(
  ({
    transfers,
    nameMap,
  }: {
    transfers?: {
      total: number;
      list: CfxTransferItem[];
    };
    nameMap?: Record<string, ContractNameItem>;
  }) => {
    const { t } = useTranslation();
    const { list = [], total = 0 } = transfers ?? {};
    if (list.length === 0) return null;
    return (
      <Description
        title={
          <>
            <span>
              {`${t(translations.transaction.internalTransactions)} ${
                total > 1 ? `(${total})` : ''
              }`}
            </span>
            <Tooltip
              title={t(translations.transaction.tipOfInternalTransactionsCount)}
            >
              <IconImg src={iconInfo} alt="warning-icon" />
            </Tooltip>
          </>
        }
      >
        {list.map((item, index) => (
          <TransferItem key={index} item={item} nameMap={nameMap} />
        ))}
      </Description>
    );
  },
  lodash.isEqual,
);

const IconImg = styled.img`
  width: 1.2857rem;
  margin-left: 0.3571rem;
  padding-right: 0.2857rem;
  margin-top: -0.2765rem;
`;

const TransferItemWrapper = styled.div`
  display: flex;
  align-items: center;
`;
