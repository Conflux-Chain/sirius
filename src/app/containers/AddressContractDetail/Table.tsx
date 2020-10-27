import React, { useMemo, useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import queryString from 'query-string';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DatePicker, Button, useClickAway } from '@cfxjs/react-ui';
import { Card } from 'app/components/Card/Loadable';
import { useLocation, useHistory } from 'react-router';
import {
  transactionColunms,
  tokenColunms,
  blockColunms,
} from 'utils/tableColumns';
import { StyledIconWrapper } from 'utils/tableColumns/token';
import { Link } from 'app/components/Link';
import { Text } from 'app/components/Text';
import { ColumnsType } from '../../components/TabsTablePanel';
import {
  TabLabel,
  TabsTablePanel,
} from '../../components/TabsTablePanel/Loadable';
import { isContractAddress, formatString } from 'utils';
import { useContract, useToken } from 'utils/api';
import { media, useBreakpoint } from 'styles/media';
import { Check } from '@geist-ui/react-icons';
import { defaultTokenIcon } from '../../../constants';

const AceEditorStyle = {
  width: '100%',
};

function ContractSourceCodeAbi({ sourceCode, abi }) {
  const { t } = useTranslation();

  const [isSourceCode, setIsSourceCode] = useState(true);

  return (
    <>
      <Card>
        <AceEditor
          readOnly
          style={AceEditorStyle}
          mode="solidity"
          theme="github"
          name="UNIQUE_ID_OF_DIV"
          setOptions={{
            showLineNumbers: true,
          }}
          showGutter={false}
          showPrintMargin={false}
          value={isSourceCode ? sourceCode : abi}
        />
      </Card>
      <ButtonWrapper>
        <Button
          className={clsx(isSourceCode && 'enabled', 'source-btn')}
          onClick={() => setIsSourceCode(true)}
        >
          {t(translations.contract.sourceCode)}
        </Button>
        <Button
          className={clsx(!isSourceCode && 'enabled', 'abi-btn')}
          onClick={() => setIsSourceCode(false)}
        >
          {t(translations.contract.abi)}
        </Button>
      </ButtonWrapper>
    </>
  );
}

const ButtonWrapper = styled.div`
  float: right;
  margin: 1.71rem 0;

  .btn {
    background: rgba(0, 84, 254, 0.04);
    color: #74798c;
  }
  .enabled.btn {
    color: #ffffff;
    background-color: #1e3de4;
  }

  .abi-btn.btn {
    margin-left: 0.57rem;
  }
`;

const DatePickerWithQuery = ({ onChange }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { minTimestamp, maxTimestamp } = queryString.parse(
    location.search || '',
  );
  const bp = useBreakpoint();
  let defaultDateRange = useMemo(
    () =>
      minTimestamp && maxTimestamp
        ? [
            minTimestamp && dayjs(new Date(parseInt(minTimestamp as string))),
            maxTimestamp && dayjs(new Date(parseInt(maxTimestamp as string))),
          ]
        : undefined,
    [minTimestamp, maxTimestamp],
  );
  const datePlaceholder = [
    t(translations.general.startDate),
    t(translations.general.endDate),
  ];
  return (
    <DatePickerWrap key="date-picker-wrap">
      {bp !== 's' && (
        <DatePicker.RangePicker
          // @ts-ignore
          defaultValue={defaultDateRange}
          color="primary"
          variant="solid"
          key="date-picker"
          // @ts-ignore
          placeholder={datePlaceholder}
          onChange={onChange}
        />
      )}
    </DatePickerWrap>
  );
};

const DatePickerWrap = styled.div`
  cursor: pointer;
  ${media.s} {
    position: absolute;
    z-index: 10;
    width: 2.67rem;
    height: 2.67rem;
    background-color: rgb(0, 84, 254, 0.04);
    left: 0;
    right: unset;
    .month-picker-icon {
      position: absolute;
      left: 0.92rem;
      top: 0.92rem;
    }

    .cfx-picker {
      background-color: #f5f6fa;
      opacity: 0;
      width: 2.67rem;
      height: 2.67rem;
    }
  }
`;

const TX_DIRECTION = ['all', 'outgoing', 'incoming'];

const TxDirectionFilter = ({ onChange }) => {
  const location = useLocation();
  const { txType } = queryString.parse(location.search || '');
  const defaultDirection = TX_DIRECTION.indexOf(txType as string);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(
    defaultDirection === -1 ? 0 : defaultDirection,
  );
  useClickAway(dropdownRef, () => visible && setVisible(false));
  const { t } = useTranslation();

  const select = selected => {
    setSelected(selected);
    onChange && onChange(TX_DIRECTION[selected]);
    setVisible(false);
  };

  const opts = [
    translations.general.viewAll,
    translations.transaction.viewOutgoingTxns,
    translations.transaction.viewIncomingTxns,
  ].map((text, idx) => (
    <div
      key={idx}
      onClick={() => select(idx)}
      className={clsx('opt', selected === idx && 'selected')}
    >
      <span>{t(text)}</span>
      <Check />
    </div>
  ));

  return (
    <TxDirectionFilterWrap key="tx-filter-wrap">
      <Button
        key="tx-filter-button"
        color="secondary"
        variant="text"
        className="filter-button"
        onClick={() => setVisible(!visible)}
      >
        <img
          src={'/contract-address/dot-dot-dot.svg'}
          alt="transaction-direction-filter"
        />
      </Button>
      {visible && (
        <TxDirectionFilterDropdown key="tx-filter-dropdown" ref={dropdownRef}>
          {opts}
        </TxDirectionFilterDropdown>
      )}
    </TxDirectionFilterWrap>
  );
};

const TxDirectionFilterWrap = styled.div`
  margin-left: 0.57rem;
  position: relative;
  .btn.filter-button {
    background-color: rgba(0, 84, 254, 0.04);
    &:hover {
      background-color: #dfe8ff;
    }
    width: 3rem;
    min-width: 3rem;
    padding: 0;
    img {
      transform: translateY(-3px);
    }
  }

  ${media.s} {
    margin-left: unset;
  }
`;

const TxDirectionFilterDropdown = styled.div`
  position: absolute;
  right: 0;
  box-shadow: 0rem 0.43rem 1.14rem 0rem rgba(20, 27, 50, 0.08);
  border-radius: 0.14rem;
  background-color: white;
  width: max-content;
  margin-top: 0.86rem;
  z-index: 10;
  div.opt {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 1.57rem;
    padding: 0.29rem 1.14rem;
    color: #65709a;
    svg {
      visibility: hidden;
      margin-left: 0.5rem;
    }
    &.selected {
      background-color: #65709a;
      color: white;
      svg {
        visibility: visible;
      }
    }
  }
  ${media.s} {
    right: unset;
    left: 0;
  }
`;

export function Table({ address }) {
  const { t } = useTranslation();
  const loadingText = t(translations.general.loading);
  const bp = useBreakpoint();
  const location = useLocation();
  const history = useHistory();
  const queries = queryString.parse(location.search);
  const [filterVisible, setFilterVisible] = useState(
    queries?.tab !== 'contract',
  );
  const isContract = useMemo(() => isContractAddress(address), [address]);
  const [txFilterVisible, setTxFilterVisible] = useState(
    queries?.tab !== 'mined-blocks' &&
      queries?.tab !== 'transfers' &&
      !isContract,
  );

  const { data: contractInfo } = useContract(isContract && address, [
    'sourceCode',
    'abi',
  ]);
  const { data: tokenInfo } = useToken(address, ['name', 'icon']);

  useEffect(() => {
    history.replace(
      queryString.stringifyUrl({
        url: location.pathname,
        query: {
          accountAddress: address,
          ...queries,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.pathname, address, history]);

  const columnsTransactionsWidth = [4, 5, 4, 3, 4, 4, 5];
  const columnsTransactions: ColumnsType = [
    transactionColunms.hash,
    {
      ...tokenColunms.from,
      render: (value, row, index) => {
        let nameTag;
        if (value === address && tokenInfo && tokenInfo.name) {
          nameTag = tokenInfo.name;
        }
        return tokenColunms.from.render(value, row, index, {
          isToken: false,
          nameTag,
        });
      },
    },
    {
      ...tokenColunms.to,
      render: (value, row, index) => {
        let nameTag;
        if (value === address && tokenInfo && tokenInfo.name) {
          nameTag = tokenInfo.name;
        }
        return tokenColunms.to.render(value, row, index, {
          isToken: false,
          nameTag,
        });
      },
    },
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTransactionsWidth[i] }));

  const columnsTokensWidth = [3, 3, 3, 3, 4, 4];
  const columnsTokenTrasfers: ColumnsType = [
    tokenColunms.txnHash,
    {
      ...tokenColunms.from,
      render: (value, row, index) =>
        tokenColunms.from.render(value, row, index, {
          isToken: false,
        }),
    },
    {
      ...tokenColunms.to,
      render: (value, row, index) =>
        tokenColunms.to.render(value, row, index, {
          isToken: false,
        }),
    },
    tokenColunms.quantity,
    {
      ...tokenColunms.token,
      render: row => (
        <StyledIconWrapper>
          {row?.token
            ? [
                <img
                  key="img"
                  src={row?.token?.icon || defaultTokenIcon}
                  alt="token icon"
                />,
                <Link key="link" href={`/token/${row?.token?.address}`}>
                  <Text
                    span
                    hoverValue={`${row?.token?.name} (${row?.token?.symbol})`}
                  >
                    {formatString(
                      `${row?.token?.name} (${row?.token?.symbol})`,
                      'tag',
                    )}
                  </Text>
                </Link>,
              ]
            : loadingText}
        </StyledIconWrapper>
      ),
    },
    tokenColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTokensWidth[i] }));

  const columnsBlocksWidth = [4, 2, 3, 2, 3, 3, 3, 4];
  const columnsMinedBlocks: ColumnsType = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.hash,
    blockColunms.txns,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercent,
    blockColunms.age,
  ].map((item, i) => ({ ...item, width: columnsBlocksWidth[i] }));

  const tabs = [
    {
      value: 'transaction',
      label: (count: number) => {
        return (
          <>
            {t(translations.blocksAndTransactions.transactions)}
            <TabLabel count={count} />
          </>
        );
      },
      url: `/transaction?accountAddress=${address}`,
      pagination: true,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
    {
      value: 'transfers',
      label: (count: number) => {
        return (
          <>
            {t(translations.general.tokenTxns)}
            <TabLabel count={count} />
          </>
        );
      },
      pagination: true,
      url: `/transfer?accountAddress=${address}`,
      table: {
        columns: columnsTokenTrasfers,
        rowKey: row => `${row.transactionHash}${row.transactionLogIndex}`,
      },
    },
    isContract
      ? {
          value: 'contract-viewer',
          label: t(translations.token.contract),
          content: (
            <ContractSourceCodeAbi
              sourceCode={contractInfo?.sourceCode}
              abi={contractInfo?.abi}
            />
          ),
        }
      : {
          value: 'mined-blocks',
          hideTotalZero: true,
          pagination: true,
          label: (count: number) => {
            return (
              <>
                {t(translations.addressDetail.minedBlocks)}
                <TabLabel count={count} />
              </>
            );
          },

          url: `/block?miner=${address}`,
          table: {
            columns: columnsMinedBlocks,
            rowKey: 'hash',
          },
        },
  ];

  return (
    <TableWrap>
      {filterVisible && (
        <FilterWrap>
          {bp !== 's' && (
            <DatePickerWithQuery
              key="date-picker-query"
              onChange={dateQuery => {
                if (!dateQuery)
                  return history.push(
                    queryString.stringifyUrl({
                      url: location.pathname,
                      query: {
                        ...queries,
                        minTimestamp: undefined,
                        maxTimestamp: undefined,
                      },
                    }),
                  );

                let minTimestamp, maxTimestamp;
                if (Array.isArray(dateQuery) && dateQuery.length > 1) {
                  minTimestamp = Math.round(
                    new Date(dateQuery[0].toISOString()).getTime() / 1000,
                  );
                  maxTimestamp = Math.round(
                    new Date(dateQuery[1].toISOString()).getTime(),
                  );
                }

                if (typeof dateQuery?.toISOString === 'function') {
                  minTimestamp = new Date(
                    dateQuery.startOf('month').toISOString(),
                  ).getTime();
                  maxTimestamp = new Date(
                    dateQuery.endOf('month').toISOString(),
                  ).getTime();
                }

                if (
                  minTimestamp !== undefined &&
                  minTimestamp === queries.minTimestamp
                )
                  return;
                if (
                  maxTimestamp !== undefined &&
                  maxTimestamp === queries.maxTimestamp
                )
                  return;
                history.push(
                  queryString.stringifyUrl({
                    url: location.pathname,
                    query: {
                      ...queries,
                      minTimestamp,
                      maxTimestamp,
                    },
                  }),
                );
              }}
            />
          )}
          {txFilterVisible && (
            <TxDirectionFilter
              key="tx-filter"
              onChange={txType => {
                if (queries?.txType !== txType)
                  history.push(
                    queryString.stringifyUrl({
                      url: location.pathname,
                      query: {
                        ...queries,
                        txType,
                      },
                    }),
                  );
              }}
            />
          )}
        </FilterWrap>
      )}
      <TabsTablePanel
        key="table"
        tabs={tabs}
        onTabsChange={value => {
          if (value === 'transfers' || value === 'mined-blocks' || isContract)
            setTxFilterVisible(false);
          else setTxFilterVisible(true);
          if (value === 'contract-viewer') return setFilterVisible(false);
          setFilterVisible(true);
        }}
      />
    </TableWrap>
  );
}

const TableWrap = styled.div`
  position: relative;
`;

const FilterWrap = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;

  ${media.s} {
    flex-direction: column;
    right: unset;
    left: 0;
    top: 9.2rem;
    z-index: 10;
  }
`;
