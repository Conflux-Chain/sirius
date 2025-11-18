/**
 *
 * Header Search
 *
 */
import React, { useState } from 'react';
import styled from 'styled-components';

import { Translation, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useBreakpoint } from '@cfxjs/sirius-next-common/dist/utils/media';
import { useSearch } from 'utils/hooks/useSearch';
import { AutoComplete, Input, SelectProps, Image } from '@cfxjs/antd';
import { SearchIcon } from '@cfxjs/sirius-next-common/dist/components/SearchIcon';
import ClearIcon from 'images/clear.png';
import { ICON_DEFAULT_TOKEN } from 'utils/constants';
import _ from 'lodash';
import { fetchWithPrefix } from '@cfxjs/sirius-next-common/dist/utils/request';
import {
  isAccountAddress,
  isEpochNumber,
  isHash,
  isInnerContractAddress,
  isSpecialAddress,
} from 'utils';
import { getAddress, isValidENS, LogoENS } from 'utils/ens';
import verifiedIcon from 'images/nametag/verified.svg';
import warningIcon from 'images/nametag/warning.svg';

const { Search: SearchInput } = Input;

const TokenItemWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  img {
    width: 24px;
    height: 24px;
    margin-top: 4px;
    margin-right: 10px;
  }

  > span {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 12px;

    .title {
      font-size: 14px;
    }

    .nametag-status-icon {
      width: 16px;
      height: 16px;
      margin-top: -2px;
    }

    .address,
    .website {
      color: #6c6d75;
    }

    .holders {
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -11px;
    }

    .tag {
      color: #6c6d75;
      padding: 1px 5px;
      font-size: 12px;
      background-color: #f9f9f9;
      border: 1px solid #e8e8e8;
      border-radius: 3px;
    }
  }
`;

// type is one of: token, contract, ens
const searchResult = (list: any[], notAvailable = '-', type = 'token') => {
  if (type === 'ens') {
    return list.map(l => ({
      key: `ens-${l.address}`,
      value: `ens-${l.address}`,
      type,
      label: l.address ? (
        <TokenItemWrapper
          onClick={() => {
            window.location.href = `/address/${l.address}`;
          }}
        >
          <Image
            preview={false}
            src={LogoENS}
            fallback={ICON_DEFAULT_TOKEN}
            alt="ens icon"
          />
          <span>
            <div className="title">
              {l.name}{' '}
              <span className="tag">
                <Translation>
                  {t => t(translations.header.search.ens)}
                </Translation>
              </span>
            </div>
            <div className="address">{l.address}</div>
          </span>
        </TokenItemWrapper>
      ) : (
        <span>
          <Translation>{t => t(translations.general.noResult)}</Translation>
        </span>
      ),
    }));
  } else if (type === 'nametag') {
    return list.map(l => ({
      key: `nametag-${l.address}`,
      value: `nametag-${l.address}`,
      type,
      label: l.address ? (
        <TokenItemWrapper
          onClick={() => {
            window.location.href = `/address/${l.address}`;
          }}
        >
          <span>
            <div className="title">
              {l.nameTag}{' '}
              <img
                className="nametag-status-icon"
                src={l.caution ? warningIcon : verifiedIcon}
                alt="status-icon"
              ></img>
            </div>
            <div className="address">{l.address}</div>
          </span>
        </TokenItemWrapper>
      ) : (
        <span>
          <Translation>{t => t(translations.general.noResult)}</Translation>
        </span>
      ),
    }));
  } else {
    return list.map(l => {
      const token = {
        ...l,
        icon: l.iconUrl || ICON_DEFAULT_TOKEN,
        name: l.name || notAvailable,
      };
      const isOfficialVerified = l.securityAudit?.officialLabels?.some(
        i => i === 'Verified',
      );

      return {
        key: `${type}-${token.address}`,
        // add type prefix for duplicate value with different type
        value: `${type}-${token.address}`,
        type,
        label: (
          <TokenItemWrapper
            onClick={() => {
              window.location.href = `/${
                type === 'token' ? 'token' : 'address'
              }/${token.address}`;
            }}
          >
            {type === 'token' && (
              <Image
                preview={false}
                src={token?.iconUrl || ICON_DEFAULT_TOKEN}
                fallback={ICON_DEFAULT_TOKEN}
                alt="token icon"
              />
            )}
            <span>
              <Translation>
                {t => (
                  <>
                    <div className="title">
                      {token?.name}
                      {token?.symbol ? ` (${token.symbol}) ` : ' '}
                      {token?.transferType && (
                        <span className="tag">
                          {token?.transferType.replace('ERC', 'CRC')}
                        </span>
                      )}
                      {isOfficialVerified && (
                        <img
                          src={verifiedIcon}
                          style={{
                            marginTop: '0',
                            marginRight: '0',
                            marginLeft: '8px',
                            width: '16px',
                            height: '16px',
                          }}
                          alt="status-icon"
                        ></img>
                      )}
                    </div>
                    {token?.address ? (
                      <div className="address">{token?.address}</div>
                    ) : null}
                    {/*{token?.website ? (*/}
                    {/*  <div className="website">{token?.website}</div>*/}
                    {/*) : null}*/}
                    {token?.holderCount ? (
                      <div className="holders">
                        {token?.holderCount}{' '}
                        {t(translations.tokens.table.holders)}
                      </div>
                    ) : null}
                  </>
                )}
              </Translation>
            </span>
          </TokenItemWrapper>
        ),
      };
    });
  }
};

let controller = new AbortController();

export const Search = () => {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const [, setSearch] = useSearch();
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState('');

  const notAvailable = t(translations.general.notAvailable);

  const handleSearch = (value: string) => {
    if (
      value &&
      value.length > 1 &&
      !(
        value === '0x0' ||
        isAccountAddress(value) ||
        // isCoreContractAddress(value) ||
        isInnerContractAddress(value) ||
        isSpecialAddress(value) ||
        isEpochNumber(value) ||
        isHash(value)
      )
    ) {
      if (isValidENS(value)) {
        // demo Oahu11250001.Web3
        getAddress(value)
          .then(address => {
            setOptions([
              {
                label: (
                  <LabelWrapper>
                    {t(translations.header.search.ens)}
                  </LabelWrapper>
                ),
                options: searchResult(
                  [
                    {
                      address,
                      name: value,
                    },
                  ],
                  notAvailable,
                  'ens',
                ),
              },
            ]);
          })
          .catch(e => console.log(e));
      } else {
        // abort pre search
        controller.abort();
        controller = new AbortController();

        fetchWithPrefix('/stat/tokens/name?name=' + value, {
          signal: controller.signal,
        })
          .then((res: any) => {
            if (res) {
              const options: any = [];
              if (res.list && res.list.length > 0)
                options.push({
                  label: (
                    <LabelWrapper>
                      {t(translations.header.search.tokens)}
                    </LabelWrapper>
                  ),
                  options: searchResult(res.list, notAvailable, 'token'),
                });
              if (res.contractList && res.contractList.length > 0)
                options.push({
                  label: (
                    <LabelWrapper>
                      {t(translations.header.search.contracts)}
                      {res.contractList.length > 10
                        ? ` (${t(translations.header.search.contractsTip)})`
                        : null}
                    </LabelWrapper>
                  ),
                  options: searchResult(
                    res.contractList.length > 10
                      ? res.contractList.slice(0, 10)
                      : res.contractList,
                    notAvailable,
                    'contract',
                  ),
                });
              if (res.eoaList && res.eoaList.length > 0)
                options.push({
                  label: (
                    <LabelWrapper>
                      {t(translations.header.search.nametag)}
                    </LabelWrapper>
                  ),
                  options: searchResult(
                    res.eoaList.length > 10
                      ? res.eoaList.slice(0, 10)
                      : res.eoaList,
                    notAvailable,
                    'nametag',
                  ),
                });
              setOptions(options);
            } else {
              setOptions([]);
            }
          })
          .catch(e => {
            if (e.name !== 'AbortError') {
              console.error(e);
            }
          });
      }
    } else {
      setOptions([]);
    }
  };

  const onSelect = (value: string, option?: any) => {
    if (option && option.type) {
      const address = value.replace(option.type + '-', '');
      setAutoCompleteValue('');
      // @ts-ignore
      window.location =
        window.location.origin +
        `/${option.type === 'token' ? 'token' : 'address'}/${address}`;
    } else {
      setSearch(value);
      setAutoCompleteValue('');
    }
  };

  return (
    <Container className="header-search-container">
      <AutoComplete
        style={{
          width: '100%',
        }}
        options={options}
        value={autoCompleteValue}
        onChange={v => {
          setAutoCompleteValue(v);
        }}
        // open={true}
        onSelect={onSelect}
        onSearch={_.debounce(handleSearch, 500)}
        dropdownClassName="header-search-dropdown"
      >
        <SearchInput
          allowClear
          onSearch={value => {
            onSelect(value);
          }}
          placeholder={
            bp === 's'
              ? t(translations.header.searchPlaceHolderMobile)
              : t(translations.header.searchPlaceHolder)
          }
          enterButton={<SearchIcon color="#fff" />}
          className="autocomplete-search-input"
        />
      </AutoComplete>
    </Container>
  );
};

const LabelWrapper = styled.div`
  background-color: #f9f9f9;
  border-radius: 3px;
  padding: 3px 10px;
  color: #1a1a1a;
`;

const Container = styled.div`
  flex-grow: 1;
  padding: 0 1.5rem;

  .autocomplete-search-input {
    .ant-input-affix-wrapper,
    input {
      background-color: var(--theme-color-gray1);
    }

    .ant-input-search-button {
      background-color: var(--theme-color-blue0);

      &:hover {
        background-color: var(--theme-color-blue2);
        /* opacity: 0.85; */
      }
    }
  }

  // override antd style
  .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
    border-radius: 16px;
  }

  .ant-input-affix-wrapper {
    border-color: #b6bad2;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 12px;
    color: #333;
    box-shadow: none !important;
    &:hover,
    &:focus {
      border-color: #424a71;
      box-shadow: none !important;
    }
  }
  .ant-input-affix-wrapper-focused {
    border-color: #424a71;
  }

  .ant-input {
    &::placeholder {
      color: rgba(51, 51, 51, 0.6);
    }
    &:hover,
    &:focus {
      border-color: #424a71;
    }
  }

  .ant-input-group-addon {
    position: absolute;
    right: 50px;
    top: 0;
    left: auto !important;
    width: 0;
  }

  .ant-input-search-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: #424a71;
    border-radius: 16px !important;
    width: 50px;
    z-index: 5;

    &:hover {
      border: none;
      outline: none;
      background: #68719c;
    }
    svg {
      fill: #fff;
    }
  }
  .ant-input-suffix {
    margin-right: 40px;
    border: none;

    .ant-input-clear-icon-hidden {
      display: none;
    }

    .anticon {
      width: 24px;
      height: 100%;
      background: url(${ClearIcon}) no-repeat center center;
      background-size: 16px 16px;
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
      svg {
        display: none;
      }
    }
  }
`;
