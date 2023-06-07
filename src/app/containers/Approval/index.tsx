import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import { PageHeader } from 'app/components/PageHeader';
import { Input, Row, Button, Switch } from '@cfxjs/antd';
import { useHistory, useLocation } from 'react-router-dom';
import { isCurrentNetworkAddress, isZeroAddress } from 'utils';
import CNSUtil from '@web3identity/cns-util';
import { NETWORK_ID } from 'utils/constants';
import qs from 'query-string';
import { Description } from 'app/components/Description/Loadable';
import { AddressContainer } from 'app/components/AddressContainer';
import { Card } from 'app/components/Card/Loadable';
import { NotFound } from './NotFound';
import { Link } from 'app/components/Link/Loadable';
import { Text } from 'app/components/Text/Loadable';
import { reqApprovals } from 'utils/httpRequest';
import { useENSOrAddressSearch } from 'utils/hooks/useENSOrAddressSearch';
import { isValidCfxAddress } from '@conflux-dev/conflux-address-js';
import { transactionColunms, tokenColunms } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useAge } from 'utils/hooks/useAge';
import { InfoIconWithTooltip } from 'app/components/InfoIconWithTooltip/Loadable';
import { Select } from 'app/components/Select';
import queryString from 'query-string';

const { Search } = Input;

export function Approval() {
  const { t } = useTranslation();
  const { search = '', pathname } = useLocation();
  const history = useHistory();
  const { text } = qs.parse(search);
  const [inputValue, setInputValue] = useState<string>(text as string);
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ageFormat, toggleAgeFormat] = useAge();

  const [list, setList] = useState<
    Array<{
      contract: string;
      hash: string;
      spender: string;
      spenderName: string;
      tokenInfo: {
        base32: string;
        decimals: number;
        iconUrl: string;
        name: string;
        symbol: string;
        type: string;
      };
      updatedAt: string;
      value: string;
    }>
  >([]);

  const options = [
    {
      key: 'all',
      name: t(translations.approval.select.all),
      rowKey: 'all',
    },
    {
      key: 'ERC20',
      name: t(translations.approval.select.ERC20),
      rowKey: 'ERC20',
    },
    {
      key: 'ERC721',
      name: t(translations.approval.select.ERC721),
      rowKey: 'ERC721',
    },
    {
      key: 'ERC1155',
      name: t(translations.approval.select.ERC1155),
      rowKey: 'ERC1155',
    },
  ];
  const location = useLocation();
  const { type: queryType } = queryString.parse(location.search);

  let queryNumber = '1';
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

  useEffect(() => {
    setMsg('');

    if (text) {
      if (
        isValidCfxAddress(text as string) &&
        isCurrentNetworkAddress(text as string)
      ) {
        setLoading(true);
        reqApprovals({
          query: {
            account: text,
            // tokenType: 'ERC20',
            tokenType: options[number].key,
          },
        })
          .then(d => {
            setList(d.list);
          })
          .catch(e => {
            console.log('request approvals error: ', e);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setMsg(t(translations.approval.errors.invalidAddress));
      }
    }
  }, [text, number, options, t]);

  const handleTypeChange = number => {
    history.push(
      queryString.stringifyUrl({
        url: location.pathname,
        query: {
          ...queryString.parse(location.search),
          type: options[number].key,
        },
      }),
    );
  };

  const handleSwitchChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
    history.push(
      queryString.stringifyUrl({
        url: location.pathname,
        query: {
          ...queryString.parse(location.search),
          viewAll: checked ? '1' : '0',
        },
      }),
    );
  };

  const handleChange = e => {
    const value = e.target.value.trim();

    setInputValue(value);
  };

  const handleSearch = useCallback(
    value => {
      history.push(`${pathname}?text=${value}`);
    },
    [history, pathname],
  );

  const handleRevoke = data => {
    console.log('handle revoke: ', data);
  };

  console.log('list: ', list);

  const getContent = () => {
    if (msg) {
      return <NotFound>{msg}</NotFound>;
    } else {
      const columns = [
        {
          ...transactionColunms.hash,
          dataIndex: 'hash',
          key: 'hash',
        },
        {
          ...tokenColunms.token,
          dataIndex: 'tokenInfo',
          key: 'tokenInfo',
        },
        {
          title: t(translations.approval.tokenType),
          dataIndex: 'tokenInfo',
          key: 'tokenInfo',
          width: 1,
          render: data => {
            return data.type;
          },
        },
        {
          title: t(translations.approval.amount),
          dataIndex: 'value',
          key: 'value',
          width: 1,
          render: data => {
            return data;
          },
        },
        {
          ...tokenColunms.contract(false),
          dataIndex: 'contract',
          key: 'contract',
        },
        {
          ...transactionColunms.age(ageFormat, toggleAgeFormat),
          dataIndex: 'updatedAt',
          key: 'updatedAt',
        },

        {
          title: t(translations.approval.operation),
          dataIndex: 'operation',
          key: 'operation',
          width: 1,
          render: (_, row) => {
            return (
              <Button size="small" onClick={() => handleRevoke(row)}>
                {t(translations.approval.revoke)}
              </Button>
            );
          },
        },
      ].map((item, i) => ({
        ...item,
        width: [3, 5, 3, 3, 3, 3, 3][i],
      }));

      return (
        <StyledContentWrapper>
          <div className="menuContainer">
            <InfoIconWithTooltip info={t(translations.approval.tips.view)}>
              {t(translations.approval.view)}
            </InfoIconWithTooltip>
            <Switch
              defaultChecked
              onChange={handleSwitchChange}
              size="small"
              className="switch"
            />
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
          </div>
          <TablePanelNew
            columns={columns}
            rowKey="hash"
            dataSource={list}
            loading={loading}
            pagination={false}
          ></TablePanelNew>
        </StyledContentWrapper>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>{t(translations.header.cns)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.approval.title)}</PageHeader>
      <StyledSubtitleWrapper>
        <span className="subtitle">{t(translations.approval.subtitle)}</span>
        <InfoIconWithTooltip
          info={t(translations.approval.tips.support)}
        ></InfoIconWithTooltip>
      </StyledSubtitleWrapper>
      <SearchWrapper>
        <Search
          value={inputValue}
          onChange={handleChange}
          onSearch={handleSearch}
          placeholder={t(translations.approval.inputPlaceholder)}
          loading={loading}
        />
      </SearchWrapper>
      {getContent()}
    </>
  );
}

const StyledContentWrapper = styled.div`
  position: relative;

  .menuContainer {
    position: absolute;
    right: 16px;
    top: 12px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
  }

  .switch {
    margin: 0 8px;
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

const SearchWrapper = styled.div`
  margin-bottom: 24px;

  .ant-input-search {
    max-width: 500px;
  }

  .ant-input {
    border-radius: 16px !important;
    background: rgba(30, 61, 228, 0.04);
    border: none !important;
    padding-right: 41px;
  }

  .ant-input-group-addon {
    background: transparent !important;
    left: -38px !important;
    z-index: 80;

    .ant-btn {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
      line-height: 1 !important;
      box-shadow: none !important;

      &:after {
        display: none !important;
      }

      &:before {
        background-color: transparent !important;
      }

      .anticon {
        font-size: 18px;
        margin-bottom: 3px;
      }
    }
  }

  /* .convert-address-error {
    width: 100%;
    margin: 0.5714rem 0;
    font-size: 0.8571rem;
    color: #e64e4e;
    line-height: 1.1429rem;
    padding-left: 0.3571rem;

    ${media.s} {
      width: 100%;
    }
  } */
`;

const StyledSubtitleWrapper = styled.div`
  color: #74798c;
  font-size: 1rem;
  line-height: 1.2857rem;
  margin: 1.1429rem 0 1.7143rem;
  display: flex;

  .subtitle {
    margin-right: 2px;
  }
`;
