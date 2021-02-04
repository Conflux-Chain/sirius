import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TablePanel } from '../../components/TablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TipLabel } from '../../components/TabsTablePanel/Loadable';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { accountColunms } from '../../../utils/tableColumns';
import styled from 'styled-components/macro';
import { Select } from '../../components/Select';
import { toThousands } from 'utils/';
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';

export function Accounts() {
  const { t } = useTranslation();
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

  let columnsWidth = [1, 7, 3, 3, 3];
  let columns: ColumnsType = [
    accountColunms.rank,
    accountColunms.address,
    {
      ...accountColunms.balance,
      title: options[number].name,
      dataIndex: options[number].rowKey,
      key: options[number].rowKey,
      render: value =>
        value === null ? '--' : `${toThousands(Number(value))} CFX`,
    },
    accountColunms.percentage,
    accountColunms.count,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = t(translations.header.accounts);
  const url = `/stat/top-cfx-holder?type=${options[number].key}&limit=100`;

  const handleTypeChange = number => {
    // setNumber(number);
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
      <StyledPageWrapper>
        <PageHeader>{title}</PageHeader>
        <TipLabel total={null} left={t(translations.accounts.tip)} />
        <StyledTableWrapper>
          <StyledSelectWrapper>
            <span className="selectLabel">
              {t(translations.accounts.sortButtonBefore)}
            </span>
            <Select
              value={number}
              onChange={handleTypeChange}
              disableMatchWidth
              size="small"
              className="btnSelectContainer"
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
      </StyledPageWrapper>
    </>
  );
}

const StyledPageWrapper = styled.div`
  padding: 2.2857rem 0;
`;

const StyledTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const StyledSelectWrapper = styled.div`
  align-self: flex-end;
  display: flex;
  align-items: center;
  padding: 20px 20px 0 20px;

  .selectLabel {
    color: #333;

    &:first-child {
      margin-right: 4px;
    }

    &:last-child {
      margin-left: 4px;
    }
  }

  .btnSelectContainer {
    /* margin: 0 4px; */
  }
`;
