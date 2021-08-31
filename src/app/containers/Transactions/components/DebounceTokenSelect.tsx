import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Select, Spin, Tag, Image } from '@jnoodle/antd';
import { SelectProps } from '@jnoodle/antd/es/select';
import debounce from 'lodash/debounce';
import styled, { createGlobalStyle } from 'styled-components/macro';
import { defaultTokenIcon } from '../../../../constants';
import { Text } from 'app/components/Text/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  reqTopStatistics,
  reqTokenListByName,
  reqTokenList,
} from 'utils/httpRequest';
import qs from 'query-string';
import { formatAddress } from 'utils/cfx';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import Info from '@zeit-ui/react-icons/info';

const { Option, OptGroup } = Select;

export interface TokenType {
  icon: string;
  name: string;
  address: string;
}

export interface DebounceTokenSelectProps<TokenType = any>
  extends Omit<SelectProps<TokenType>, 'options' | 'children'> {
  fetchOptions?: (search: string) => Promise<TokenType[]>;
  debounceTimeout?: number;
}

export async function getRecommendTokenList(): Promise<TokenType[]> {
  return reqTopStatistics({
    action: 'rank_contract_by_number_of_transfers',
    span: '7d',
  }).then(resp => {
    let result: Array<TokenType> = [];

    try {
      if (!resp.code) {
        result = resp.list.map(l => ({
          icon: l.tokenInfo.icon,
          name: l.tokenInfo.name,
          address: formatAddress(l.tokenInfo.address),
        }));
      }
    } catch (e) {}

    return result;
  });
}

const formatTokenList = resp => {
  let result: Array<TokenType> = [];

  try {
    // no 'code' from response data, use total for temp
    if (resp.total) {
      result = resp.list.map(l => ({
        icon: l.icon,
        name: l.name,
        address: formatAddress(l.address),
      }));
    }
  } catch (e) {}

  return result;
};

export async function getTokenListByName(name: string): Promise<TokenType[]> {
  return reqTokenListByName({
    name: name,
  }).then(formatTokenList);
}

export async function getTokenListByAdddress(
  tokenArray: Array<string>,
): Promise<TokenType[]> {
  return reqTokenList({
    addressArray: tokenArray,
  }).then(formatTokenList);
}

export function DebounceTokenSelect<
  TokenType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any
>({
  fetchOptions = getTokenListByName,
  debounceTimeout = 800,
  value,
  ...props
}: DebounceTokenSelectProps) {
  const { t } = useTranslation();
  const { search } = useLocation();
  const [fetchingRecommend, setFetchingRecommend] = React.useState(false);
  const [fetchingSearch, setFetchingSearch] = React.useState(false);
  const [options, setOptions] = React.useState<Array<any>>([]); // @todo, use TokenType will throw error
  const [optionsRecommend, setOptionsRecommend] = React.useState<Array<any>>(
    [],
  ); // @todo, use TokenType will throw error
  const fetchRef = React.useRef(0);

  const query = qs.parse(search);
  const { token = [] } = query;

  const loadOptions = useCallback(
    (value: string, type?: string) => {
      const isLoadRecommend = type === 'recommend';

      if (value.trim().length > 1 || isLoadRecommend) {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;

        setFetchingSearch(true);
        setOptions([]);

        fetchOptions(value)
          .then(newOptions => {
            if (fetchId !== fetchRef.current) {
              // for fetch callback order
              return;
            }

            setOptions(newOptions);
          })
          .finally(() => {
            setFetchingSearch(false);
          });
      } else if (!value.trim().length) {
        setOptions([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchOptions],
  );

  // init recommend token list
  useEffect(() => {
    setFetchingRecommend(true);
    setOptionsRecommend([]);

    getRecommendTokenList()
      .then(data => {
        setOptionsRecommend(data as any);
      })
      .finally(() => {
        setFetchingRecommend(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // init default search token list
  useEffect(() => {
    if (token?.length) {
      setFetchingSearch(true);
      setOptions([]);

      getTokenListByAdddress(token as Array<string>)
        .then(data => {
          setOptions(data as any);
        })
        .finally(() => {
          setFetchingSearch(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debounceFetcher = React.useMemo(() => {
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, loadOptions]);

  // format tag label, add ... if too long
  const handleTagRender = props => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = event => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
      >
        {label[0]}
        <Text maxWidth="60px" hoverValue={label[1]} span>
          {label[1]}
        </Text>
      </Tag>
    );
  };

  return (
    <StyledTagWrapper>
      <Globalstyle />
      <Select<TokenType>
        filterOption={false}
        onSearch={debounceFetcher}
        tagRender={handleTagRender}
        loading={fetchingRecommend || fetchingSearch}
        value={(value || []).slice(0, 3)}
        {...props}
      >
        <OptGroup
          label={t(translations.general.advancedSearch.others.searchResult)}
        >
          {fetchingSearch ? (
            <Option value={'searchResult-loading'} key={'searchResult-loading'}>
              <Spin size="small" />
            </Option>
          ) : options.length ? (
            options.map(o => {
              return (
                <Option value={o.address} key={`search-${o.address}`}>
                  <Image
                    className="advanced-search-select-option-img"
                    src={o.icon || defaultTokenIcon}
                    fallback={defaultTokenIcon}
                    alt="token icon"
                  />
                  <span className="option-text">{o.name}</span>
                </Option>
              );
            })
          ) : (
            <Option
              className="advanced-search-select-option-nodata"
              value={'searchResult-empty'}
              key={'searchResult-empty'}
              disabled
            >
              {t(translations.general.advancedSearch.others.noData)}
            </Option>
          )}
        </OptGroup>
        <OptGroup
          label={
            <>
              {t(translations.general.advancedSearch.others.recommend)}
              <Tooltip
                className="download-csv-tooltip"
                text={t(
                  translations.general.advancedSearch.others.recommendTip,
                )}
                placement="top"
              >
                <StyledInfoIconWrapper>
                  <Info size={14} />
                </StyledInfoIconWrapper>
              </Tooltip>
            </>
          }
        >
          {fetchingRecommend ? (
            <Option value={'recommend-loading'} key={'recommend-loading'}>
              <Spin size="small" />
            </Option>
          ) : optionsRecommend.length ? (
            optionsRecommend.map(o => {
              return (
                <Option value={o.address} key={`recommend-${o.address}`}>
                  <Image
                    className="advanced-search-select-option-img"
                    src={o.icon || defaultTokenIcon}
                    fallback={defaultTokenIcon}
                    alt="token icon"
                  />
                  <span className="option-text">{o.name}</span>
                </Option>
              );
            })
          ) : (
            <Option
              className="advanced-search-select-option-nodata"
              value={'recommend-empty'}
              key={'recommend-empty'}
              disabled
            >
              {t(translations.general.advancedSearch.others.noData)}
            </Option>
          )}
        </OptGroup>
      </Select>
    </StyledTagWrapper>
  );
}

const Globalstyle = createGlobalStyle`
  .ant-select-item-option-content {
    display: flex;
    align-items: center;
  }

  .advanced-search-select-option-img {
    width: 1.1429rem;
    height: 1.1429rem;
    margin-right: 0.2857rem;
  }

  .advanced-search-select-option-nodata {
    cursor: inherit;
  }

  .ant-spin {
    display: flex;
  }
`;

const StyledTagWrapper = styled.span`
  .ant-tag {
    display: flex;
    align-items: center;
    margin-right: 0.2143rem;
    border-radius: 0.7143rem;
    background: #e8e9ea;
    padding: 0.0714rem 0.4286rem 0.0714rem 0.2143rem;
    border: none;
  }
`;

export const StyledInfoIconWrapper = styled.span`
  margin-left: 5px;
  cursor: pointer;
`;
