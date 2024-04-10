import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TipLabel } from 'app/components/TabsTablePanel/Loadable';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { accountColunms, utils as tableColumnsUtils } from 'utils/tableColumns';
import styled from 'styled-components';
import { Select } from 'app/components/Select';
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';
import { usePortal } from 'utils/hooks/usePortal';
import { AddressContainer } from 'app/components/AddressContainer/Loadable';
import { formatAddress } from 'utils';
import { monospaceFont } from 'styles/variable';
import { AccountWrapper } from 'utils/tableColumns/token';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

const { ContentWrapper } = tableColumnsUtils;

export function Accounts() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  // get portal selected address
  const { accounts } = usePortal();

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

  let columnsWidth = [2, 9, 4, 3, 3];
  let columns = [
    accountColunms.rank,
    {
      ...accountColunms.address,
      render: (value, row: any) => (
        <AccountWrapper>
          <AddressContainer
            value={value}
            alias={
              row.name ||
              (row.tokenInfo && row.tokenInfo.name ? row.tokenInfo.name : null)
            }
            isFull={true}
            isMe={
              accounts && accounts.length > 0
                ? formatAddress(accounts[0]) === formatAddress(value)
                : false
            }
          />
        </AccountWrapper>
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

  const handleDownloadItemClick = (e, index, count) => {
    if (index !== 0) {
      e.preventDefault();
      e.stopPropagation();

      window.open(
        `/stat/top-cfx-holder-csv?limit=${count}&skip=0&type=${options[number].key}`,
        '_blank',
      );
    }
  };

  const tableTitle = (
    <StyledTabelTitleWrapper>
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
      {/* not good, should be replace with real dropdown or refactor Select Component to support */}
      <StyledSelectWrapper isEn={false} className="download">
        <Select
          value={'0'}
          onChange={handleTypeChange}
          disableMatchWidth
          size="small"
          className="btnSelectContainer"
          variant="text"
          dropdownClassName="dropdown"
        >
          {[
            t(translations.accounts.downloadButtonText),
            '100',
            '500',
            '1000',
            '3000',
            '5000',
          ].map((o, index) => {
            return (
              <Select.Option
                key={o}
                value={String(index)}
                onClick={e => handleDownloadItemClick(e, index, o)}
              >
                {o}
              </Select.Option>
            );
          })}
        </Select>
      </StyledSelectWrapper>
    </StyledTabelTitleWrapper>
  );

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
        <TablePanelNew
          url={url}
          columns={columns}
          rowKey="base32address"
          pagination={false}
          title={tableTitle}
        ></TablePanelNew>
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

const StyledTabelTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledSelectWrapper = styled.div<{
  isEn: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;

  &:after {
    content: '';
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

  /* download button */
  &.download {
    margin-left: 0.7143rem;
  }
`;
