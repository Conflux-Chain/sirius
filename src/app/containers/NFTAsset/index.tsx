/**
 *
 * NFT Checker
 *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { toThousands, isCurrentNetworkAddress } from 'utils';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Col, Pagination, Row, Tag } from '@cfxjs/antd';
import { Spin } from '@cfxjs/sirius-next-common/dist/components/Spin';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { NFTPreview } from 'app/components/NFTPreview';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { Empty } from '@cfxjs/sirius-next-common/dist/components/Empty';
import {
  reqNFTBalance,
  reqNFTTokens,
  reqNFT1155Tokens,
} from 'utils/httpRequest';
import qs from 'query-string';
import { TABLE_LIST_LIMIT } from 'utils/constants';

type NFTBalancesType = {
  contract: string;
  type: string;
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
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { NFTAddress, skip = '0', limit = '12', ...others } = qs.parse(search);
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
  const [listLimit, setListLimit] = useState(TABLE_LIST_LIMIT);

  const pageSize = Number(limit);
  const page = Math.floor((Number(skip) || 0) / pageSize) + 1;

  const validateAddress = async function (address) {
    if (isCurrentNetworkAddress(address)) {
      return true;
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
    let NFTs: any = {
      list: [],
      total: 0,
    };
    let total = 0;
    let listLimit = 0;

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
      listLimit = NFTs.listLimit;
    } else {
      if (await validateAddress(address)) {
        const data = await reqNFTBalance({
          query: {
            owner: address,
            limit: 100,
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
          listLimit = selectedNFT.balance;

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

    if (listLimit) {
      setListLimit(listLimit);
    }
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

  // 721 and 1155 show different tip
  let totalTip = '';
  let paginationTotal = total;
  const tip =
    translations.NFTAsset[
      (type || selectedNFT.type).includes('721') ? 'totalOf721' : 'totalOf1155'
    ];

  if (!listLimit || listLimit >= total) {
    totalTip = t(tip, {
      amount: toThousands(total),
    });
  } else {
    paginationTotal = listLimit;
    totalTip = `${t(tip, {
      amount: toThousands(listLimit),
    })} ${t(translations.NFTAsset.listLimit, {
      total: toThousands(total),
    })}`;
  }

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
              <>
                <div className="total">
                  {totalTip}
                  <span>
                    {t(translations.contract.address)}:{' '}
                    <CoreAddressContainer value={selectedNFT.contract} />
                  </span>
                </div>

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
              </>
            )}

            <Pagination
              hideOnSinglePage={true}
              current={page}
              defaultPageSize={pageSize}
              total={paginationTotal}
              pageSizeOptions={['12', '24', '60']}
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
