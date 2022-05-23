/**
 *
 * NFT Checker
 *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import { toThousands, isCurrentNetworkAddress, isAccountAddress } from 'utils';
import { Card } from 'app/components/Card';
import { Col, Pagination, Row, Spin, Tag } from '@cfxjs/antd';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { NFTPreview } from 'app/components/NFTPreview';
import { AddressContainer } from 'app/components/AddressContainer';
import { Empty } from 'app/components/Empty';
import {
  reqNFTBalance,
  reqNFTTokens,
  reqNFT1155Tokens,
} from 'utils/httpRequest';
import qs from 'query-string';

type NFTBalancesType = {
  type: string;
  contract: string;
  name: any;
  balance: number;
  index: number;
};

const defaultSelectedNFT = {
  type: '',
  contract: '',
  name: '',
  balance: 0,
  index: 0,
};

export function NFTAsset({
  contract = '',
  type = '',
}: {
  contract?: string;
  type?: string;
}) {
  const { address } = useParams<{
    address?: string;
  }>();
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { NFTAddress, skip = '0', limit = '12', ...others } = qs.parse(search);
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [NFTs, setNFTs] = useState<any[]>([]);
  const [NFTBalances, setNFTBalances] = useState<NFTBalancesType[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTBalancesType>({
    ...defaultSelectedNFT,
    contract,
    type,
  });
  const [total, setTotal] = useState(0);

  const pageSize = Number(limit);
  const page = Math.floor((Number(skip) || 0) / pageSize) + 1;

  const validateAddress = async function (address) {
    if (isCurrentNetworkAddress(address)) {
      if (isAccountAddress(address)) {
        return true;
      }
    }

    return false;
  };

  const handleNFTSearch = async () => {
    let NFTBalances: NFTBalancesType[] = [];
    let selectedNFT = {
      ...defaultSelectedNFT,
      contract,
      type,
    };
    let NFTs: any = {};
    let total = 0;

    setLoading(true);
    setHasSearched(true);

    if (contract) {
      if (type.includes('1155')) {
        NFTs = await reqNFT1155Tokens({
          query: {
            contractAddr: contract, // default NFT
            skip: skip,
            limit: limit,
          },
        });
      } else {
        NFTs = await reqNFTTokens({
          query: {
            contract: contract, // default NFT
            skip: skip,
            limit: limit,
          },
        });
      }

      // @ts-ignore
      total = NFTs.total;
    } else {
      if (await validateAddress(address)) {
        const data = await reqNFTBalance({
          query: {
            owner: address,
            limit: 10000,
          },
        });

        if (data.total) {
          NFTBalances = data.list.map((d, index) => ({
            ...d,
            index,
          }));

          selectedNFT = NFTBalances[0];

          if (NFTAddress) {
            selectedNFT = NFTBalances.filter(n => n.contract === NFTAddress)[0];
          }

          total = selectedNFT.balance;

          if (selectedNFT.type.includes('1155')) {
            NFTs = await reqNFT1155Tokens({
              query: {
                contractAddr: selectedNFT.contract, // default NFT
                userAddr: address,
                skip: skip,
                limit: limit,
              },
            });
          } else {
            NFTs = await reqNFTTokens({
              query: {
                owner: address,
                contract: selectedNFT.contract, // default NFT
                skip: skip,
                limit: limit,
              },
            });
          }
        }
      }
    }

    // @ts-ignore
    // NFTs = NFTs.list.map(n => n.tokenId);

    setNFTBalances(NFTBalances);
    setSelectedNFT(selectedNFT);
    setNFTs(NFTs.list);
    setTotal(total);
    setLoading(false);
  };

  const handlePaginationChange = (page, pageSize) => {
    history.push(
      qs.stringifyUrl({
        url: pathname,
        query: {
          ...others,
          NFTAddress: NFTAddress,
          skip: String((page - 1) * pageSize),
          limit: String(pageSize),
        },
      }),
    );
  };

  const handleNFTAddressChange = address => {
    setNFTs([]);
    history.push(
      qs.stringifyUrl({
        url: pathname,
        query: {
          ...others,
          NFTAddress: address,
          skip: '0',
          limit: limit,
        },
      }),
    );
  };

  useEffect(() => {
    handleNFTSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, NFTAddress, skip, limit, contract, type]);

  return (
    <StyledResultWrapper>
      <Card>
        <Spin spinning={loading}>
          {NFTBalances && NFTBalances.length > 0 ? (
            <TagsWrapper>
              {NFTBalances.map((n: NFTBalancesType) => {
                return (
                  <Tag
                    className={
                      selectedNFT.contract === n.contract ? 'current' : ''
                    }
                    onClick={() => handleNFTAddressChange(n.contract)}
                    key={n.contract}
                  >{`${n.name} (${toThousands(n.balance)})`}</Tag>
                );
              })}
            </TagsWrapper>
          ) : null}

          <NFTWrapper>
            <div className="total">
              {t(translations.blocks.tipCountBefore)} {toThousands(total)}{' '}
              {lang === 'zh' ? '个 ' : ''}
              {selectedNFT.name || ''} NFT{' '}
              <span>
                {t(translations.contract.address)}:{' '}
                <AddressContainer value={selectedNFT.contract} />
              </span>
            </div>

            {!loading && !NFTs.length ? (
              <div className="nodata">
                <Empty
                  show={true}
                  type="fluid"
                  noTitle={!hasSearched}
                  title={
                    !hasSearched ? t(translations.nftChecker.plzSearch) : null
                  }
                  description={
                    !hasSearched
                      ? t(translations.nftChecker.plzSearchDesc)
                      : null
                  }
                />
              </div>
            ) : (
              <Row gutter={20}>
                {NFTs.map(({ tokenId, amount, owner }) => (
                  <Col xs={24} sm={12} lg={6} xl={4} key={tokenId}>
                    <NFTPreview
                      contractAddress={selectedNFT?.contract}
                      tokenId={tokenId}
                      type="card"
                      amount={amount}
                      owner={owner}
                    />
                  </Col>
                ))}
              </Row>
            )}

            <Pagination
              hideOnSinglePage={true}
              current={page}
              defaultPageSize={pageSize}
              total={total}
              showSizeChanger={false}
              showQuickJumper={false}
              onChange={handlePaginationChange}
            />
          </NFTWrapper>
        </Spin>
      </Card>
    </StyledResultWrapper>
  );
}

const StyledResultWrapper = styled.div`
  margin-top: 1.7143rem;

  .convert-address-description {
    flex-direction: row;

    .left {
      width: 35.7143rem;
    }
  }
`;

const TagsWrapper = styled.div`
  padding: 10px 0 0;
  border-bottom: 1px solid #ebeced;

  .ant-tag {
    margin-bottom: 10px;
    background: rgba(30, 61, 228, 0.04);
    border-radius: 16px;
    border: none;
    padding: 3px 15px;
    cursor: pointer;

    &.current {
      color: #fff;
      background: rgba(30, 61, 228, 0.8);
    }
  }
`;

const NFTWrapper = styled.div`
  width: 100%;
  padding: 16px 0 40px;
  min-height: 500px;

  .nodata {
    margin-top: 100px;
    color: #74798c;
  }

  .total {
    color: #002257;
    margin-bottom: 14px;

    > span {
      float: right;

      ${media.m} {
        display: block;
        float: none;
      }
    }
  }

  .ant-pagination {
    margin-top: 10px;
    text-align: right;

    li {
      margin-bottom: 0;

      &:before {
        display: none;
      }

      .anticon {
        vertical-align: 1px;
      }
    }
  }

  .ant-col {
    padding-bottom: 20px;
  }
`;
