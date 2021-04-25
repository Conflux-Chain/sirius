import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TablePanel } from '../../components/TablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TipLabel } from '../../components/TabsTablePanel/Loadable';
import { PageHeader } from '../../components/PageHeader/Loadable';
import {
  accountColunms,
  utils as tableColumnsUtils,
} from '../../../utils/tableColumns';
import styled from 'styled-components/macro';
import { Select } from '../../components/Select';
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';
import { useAccounts } from '../../../utils/hooks/usePortal';
import { AddressContainer } from '../../components/AddressContainer/Loadable';
import { formatAddress } from '../../../utils/cfx';
import { monospaceFont } from '../../../styles/variable';
const { ContentWrapper } = tableColumnsUtils;

export function Accounts() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  // get portal selected address
  const [accounts] = useAccounts();

  const options = [
    {
      key: 'rank_address_by_total_cfx',
      name: t(translations.accounts.totalBalance),
      rowKey: 'value4',
    },
    {
      key: 'rank_address_by_cfx',
      name: t(translations.accounts.balance),
      rowKey: 'value2',
    },
    {
      key: 'rank_address_by_staking',
      name: t(translations.accounts.stakingBalance),
      rowKey: 'value3',
    },
  ];
  const location = useLocation();
  const history = useHistory();
  const { type: queryType } = queryString.parse(location.search);

  let queryNumber = '0';
  if (queryType) {
    const index = options.findIndex(o => o.key === queryType);
    if (index > -1) {
      queryNumber = String(index);
    }
  }

  const [number, setNumber] = useState(queryNumber);

  useEffect(() => {
    if (queryNumber !== number) {
      setNumber(queryNumber);
    }
  }, [queryNumber, number]);

  let columnsWidth = [1, 9, 4, 3, 3];
  let columns: ColumnsType = [
    accountColunms.rank,
    {
      ...accountColunms.address,
      render: (value, row: any) => (
        <AddressContainer
          value={value}
          alias={row.name}
          isFull={true}
          isMe={
            accounts && accounts.length > 0
              ? formatAddress(accounts[0]) === formatAddress(value)
              : false
          }
        />
      ),
    },
    {
      ...accountColunms.balance,
      title: <ContentWrapper right>{options[number].name}</ContentWrapper>,
      dataIndex: options[number].rowKey,
      key: options[number].rowKey,
    },
    accountColunms.percentage,
    accountColunms.count,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = t(translations.header.accounts);
  const url = `/stat/top-cfx-holder?type=${options[number].key}&limit=100`;

  const handleTypeChange = number => {
    history.push(
      queryString.stringifyUrl({
        url: location.pathname,
        query: {
          type: options[number].key,
        },
      }),
    );
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <PageHeader>{title}</PageHeader>
      <TipLabel
        total={100}
        left={t(translations.accounts.tipLeft, {
          type: options[number].name,
        })}
        right={t(translations.accounts.tipRight, {
          type: options[number].name,
        })}
      />
      <StyledTableWrapper>
        <StyledSelectWrapper isEn={isEn}>
          <span className="selectLabel">
            {t(translations.accounts.sortButtonBefore)}
          </span>
          <Select
            value={number}
            onChange={handleTypeChange}
            disableMatchWidth
            size="small"
            className="btnSelectContainer"
            variant="text"
          >
            {options.map((o, index) => {
              return (
                <Select.Option key={o.key} value={String(index)}>
                  {o.name}
                </Select.Option>
              );
            })}
          </Select>
          <span className="selectLabel">
            {t(translations.accounts.sortButtonAfter)}
          </span>
        </StyledSelectWrapper>

        <TablePanel
          table={{
            columns: columns,
            rowKey: 'base32address',
          }}
          pagination={false}
          url={url}
        />
      </StyledTableWrapper>
    </>
  );
}

const StyledTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.57rem;
  background-color: #fff;
  font-family: ${monospaceFont};
`;

const StyledSelectWrapper = styled.div<{
  isEn: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.8571rem 1.4286rem;
  position: relative;

  &:after {
    content: '';
    border-bottom: 0.0714rem solid #e8e9ea;
    position: absolute;
    bottom: 0;
    left: 1.4286rem;
    right: 1.4286rem;
  }

  .selectLabel {
    &:first-child {
      margin-right: 0.4286rem;
    }

    &:last-child {
      margin-left: ${props => (props.isEn ? '0' : '0.4286rem')};
    }
  }

  .select.btnSelectContainer .option.selected,
  .selectLabel {
    color: #8890a4;
    font-size: 0.8571rem;
    font-weight: normal;
  }

  .select.btnSelectContainer {
    background: rgba(30, 61, 228, 0.04);
    &:hover {
      background: rgba(30, 61, 228, 0.08);
    }
  }
`;
