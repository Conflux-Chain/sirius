import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { Input, Button, Switch } from '@cfxjs/antd';
import { useHistory, useLocation } from 'react-router-dom';
import { isCurrentNetworkAddress, formatBalance } from 'utils';
import { NotFound } from './NotFound';
import { reqApprovals } from 'utils/httpRequest';
import { isValidCfxAddress } from '@conflux-dev/conflux-address-js';
import { transactionColunms, tokenColunms } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { InfoIconWithTooltip } from '@cfxjs/sirius-next-common/dist/components/InfoIconWithTooltip';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import queryString from 'query-string';
import { usePortal } from 'utils/hooks/usePortal';
import { abi as ERC20ABI } from 'utils/contract/ERC20.json';
import { abi as ERC721ABI } from 'utils/contract/ERC721.json';
import { abi as ERC1155ABI } from 'utils/contract/ERC1155.json';
import { NETWORK_ID } from 'utils/constants';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import BigNumber from 'bignumber.js';
import { NFTPreview } from 'app/components/NFTPreview/Loadable';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { useGlobalData } from 'utils/hooks/useGlobal';
import ENV_CONFIG from 'env';

const { Search } = Input;

export function Approval() {
  const { accounts, provider } = usePortal();
  const { t } = useTranslation();
  const [globalData, setGlobalData] = useGlobalData();
  const history = useHistory();
  const location = useLocation();
  const { type: queryType, viewAll, text } = queryString.parse(location.search);
  const [inputValue, setInputValue] = useState<string>(text as string);
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ageFormat, toggleAgeFormat] = useAge();
  const [txnStatusModal, setTxnStatusModal] = useState({
    show: false,
    hash: '',
    status: '',
    errorMessage: '',
  });

  const getContract = useCallback(
    (address: string, type: string) => {
      const CFX = new SDK.Conflux({
        url: ENV_CONFIG.ENV_RPC_SERVER,
        networkId: NETWORK_ID,
      });

      CFX.provider = provider;

      const typeMap = {
        CRC20: ERC20ABI,
        CRC721: ERC721ABI,
        CRC1155: ERC1155ABI,
        ERC20: ERC20ABI,
        ERC721: ERC721ABI,
        ERC1155: ERC1155ABI,
      };

      return CFX.Contract({
        abi: typeMap[type],
        address,
      });
    },
    [provider],
  );

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
      balance: string;
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

  useEffect(() => {
    setMsg('');

    if (text) {
      if (
        isValidCfxAddress(text as string) &&
        isCurrentNetworkAddress(text as string)
      ) {
        setLoading(true);

        const query: { account: string; tokenType?: string } = {
          account: text as string,
        };

        // protect invalid query string
        if (['1', '2', '3'].includes(number)) {
          query.tokenType = options[number].key;
        }

        // query approval list
        reqApprovals({
          query,
        })
          .then(d => {
            setList(
              d.list.map(l => ({
                ...l,
                tokenInfo: {
                  ...l.tokenInfo,
                  address: l.tokenInfo.base32,
                },
              })),
            );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, number]);

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

  const handleSearch = value => {
    history.push(`${location.pathname}?text=${value}`);
  };

  const handleRevoke = data => {
    setTxnStatusModal({
      ...txnStatusModal,
      show: true,
    });
    const contract = getContract(data.contract, data.tokenInfo.type);
    let tx;
    if (data.tokenInfo.type === 'CRC20' || data.tokenInfo.type === 'ERC20') {
      tx = contract
        .approve(data.spender, 0)
        .sendTransaction({ from: accounts[0] });
    } else if (
      data.tokenInfo.type === 'CRC721' ||
      data.tokenInfo.type === 'ERC721'
    ) {
      if (data.approvalType === 'ApprovalForAll') {
        // revoke all
        tx = contract.setApprovalForAll(data.spender, false).sendTransaction({
          from: accounts[0],
        });
      } else {
        // revoke single tokenId
        tx = contract
          // .approve(SDK.format.address(SDK.CONST.ZERO_ADDRESS_HEX, NETWORK_ID), data.value)
          .approve(SDK.CONST.ZERO_ADDRESS_HEX, data.value)
          .sendTransaction({ from: accounts[0] });
      }
    } else if (
      data.tokenInfo.type === 'CRC1155' ||
      data.tokenInfo.type === 'ERC1155'
    ) {
      tx = contract
        .setApprovalForAll(data.spender, false)
        .sendTransaction({ from: accounts[0] });
    }

    tx.then(hash => {
      setTxnStatusModal({
        ...txnStatusModal,
        show: true,
        hash,
      });
    }).catch(e => {
      setTxnStatusModal({
        ...txnStatusModal,
        show: true,
        status: 'error',
        errorMessage: e.code ? `${e.code} - ${e.message}` : e.message,
      });
    });
  };

  const handleTxnStatusClose = () => {
    // reset tx status modal state
    setTxnStatusModal({
      show: false,
      status: '',
      hash: '',
      errorMessage: '',
    });
  };

  const handleTxSuccess = () => {
    // force to refresh project
    setGlobalData({
      ...globalData,
      random: Math.random(),
    });
  };

  useEffect(() => {
    // initial search
    if (!text && accounts.length) {
      handleSearch(accounts[0]);
      setInputValue(accounts[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, text]);

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
          render: (value, row) => {
            let decimals = value.decimals;

            // default decimals
            if (!decimals) {
              if (row.tokenInfo.type === 'ERC20') {
                decimals = 18;
              } else {
                decimals = 0;
              }
            }

            return (
              <div>
                {tokenColunms.token.render(value)}
                {formatBalance(row.balance, decimals)} {value.symbol}
              </div>
            );
          },
        },
        {
          title: t(translations.approval.tokenType),
          dataIndex: 'tokenInfo',
          key: 'tokenInfo',
          width: 1,
          render: data => {
            return data.type.replace('ERC', 'CRC');
          },
        },
        {
          title: t(translations.approval.amount),
          dataIndex: 'value',
          key: 'value',
          width: 1,
          render: (value, row) => {
            const type = row.tokenInfo.type;
            let text: React.ReactNode = '';

            if (type === 'ERC20') {
              if (new BigNumber(2 ** 256 - 1).div(10).lt(value)) {
                return t(translations.approval.unlimited);
              } else {
                return value;
              }
            } else if (type === 'ERC1155') {
              text = t(translations.approval.unlimited);
            } else {
              if (row.approvalType === 'ApprovalForAll') {
                text = t(translations.approval.unlimited);
              } else {
                text = (
                  <>
                    <Link href={`/nft/${row.tokenInfo.address}/${row.value}`}>
                      #{row.value}
                    </Link>
                    <NFTPreview
                      contractAddress={row.tokenInfo.address}
                      tokenId={row.value}
                    ></NFTPreview>
                  </>
                );
              }
            }

            return text;
          },
        },
        {
          title: t(translations.approval.contract),
          dataIndex: 'contract',
          key: 'contract',
          width: 1,
          render: (_, row) => {
            return transactionColunms.to.render(
              row.spenderInfo?.contract?.address || row.spender,
              {
                contractInfo: {
                  verify: { result: 0 },
                  ...row.spenderInfo.contract,
                },
                tokenInfo: row.spenderInfo.token,
              },
            );
          },
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
            const disabled =
              !accounts.length ||
              accounts[0].toLowerCase() !== String(text).toLowerCase();

            return (
              <Button
                size="small"
                onClick={() => handleRevoke(row)}
                disabled={disabled}
              >
                {t(translations.approval.revoke)}
              </Button>
            );
          },
        },
      ].map((item, i) => ({
        ...item,
        width: [3, 5, 3, 3, 3, 3, 3][i],
      }));

      let l = list;
      if (viewAll === '0') {
        // filter out balance > 0
        l = list.filter(item => item.balance !== '0');
      }

      return (
        <StyledContentWrapper>
          <div className="menuContainer">
            <InfoIconWithTooltip info={t(translations.approval.tips.view)}>
              {t(translations.approval.view)}
            </InfoIconWithTooltip>
            <Switch
              checked={viewAll !== '0'}
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
            dataSource={l}
            loading={loading}
            pagination={false}
            scroll={{ x: 1300 }}
          ></TablePanelNew>
        </StyledContentWrapper>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>{t(translations.header.approval)}</title>
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

      <TxnStatusModal
        show={txnStatusModal.show}
        status={txnStatusModal.status}
        onClose={handleTxnStatusClose}
        hash={txnStatusModal.hash}
        onTxSuccess={handleTxSuccess}
        errorMessage={txnStatusModal.errorMessage}
      />
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
