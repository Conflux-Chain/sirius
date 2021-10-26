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
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { reqNFTBalances, reqNFTTokenIds } from 'utils/httpRequest';
import qs from 'query-string';

type NFTBalancesType = {
  type: string;
  address: string;
  name: any;
  balance: number;
  index: number;
};

const defaultSelectedNFT = {
  type: '',
  address: '',
  name: '',
  balance: 0,
  index: 0,
};

export function NFTAsset() {
  const { address } = useParams<{
    address?: string;
  }>();
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const {
    NFTAddress: outerNFTAddress,
    skip = '0',
    limit = '12',
    ...others
  } = qs.parse(search);
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';
  // const [address] = useState<string>(routerAddress);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const [displayTokenIds, setDisplayTokenIds] = useState<number[]>([]);
  const [NFTBalances, setNFTBalances] = useState<NFTBalancesType[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTBalancesType>(
    defaultSelectedNFT,
  );

  const pageSize = Number(limit);
  const page = Math.floor((Number(skip) || 0) / pageSize) + 1;
  const total = selectedNFT.balance;

  const validateAddress = (address, cb) => {
    if (isCurrentNetworkAddress(address)) {
      if (isAccountAddress(address)) {
        cb && cb();
      }
    }
  };

  const handleNFTSearch = async () => {
    validateAddress(address, async () => {
      // ga
      trackEvent({
        category: ScanEvent.function.category,
        action: ScanEvent.function.action.nftChecker,
        label: address,
      });

      try {
        setLoading(true);
        setHasSearched(true);

        const { data } = await reqNFTBalances({
          query: {
            ownerAddress: address,
          },
        });

        if (data && data.length > 0) {
          const NFTBalances = data.map((d, index) => ({
            ...d,
            index,
          }));
          let selectedNFT = NFTBalances[0];

          if (outerNFTAddress) {
            selectedNFT = NFTBalances.filter(
              n => n.address === outerNFTAddress,
            )[0];
          }

          const resp = await reqNFTTokenIds({
            query: {
              ownerAddress: address,
              contractAddress: selectedNFT.address, // default NFT
              skip: skip,
              limit: limit,
            },
          });

          setNFTBalances(NFTBalances);
          setSelectedNFT(selectedNFT);
          setDisplayTokenIds(resp.data[1]);
        } else {
          setNFTBalances([]);
          setSelectedNFT(defaultSelectedNFT);
          setDisplayTokenIds([]);
        }
      } catch (e) {}

      setLoading(false);
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    history.push(
      qs.stringifyUrl({
        url: pathname,
        query: {
          ...others,
          NFTAddress: outerNFTAddress,
          skip: String((page - 1) * pageSize),
          limit: String(pageSize),
        },
      }),
    );
  };

  const handleNFTAddressChange = address => {
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
    if (address) {
      handleNFTSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, outerNFTAddress, skip, limit]);

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
                      selectedNFT.address === n.address ? 'current' : ''
                    }
                    onClick={() => handleNFTAddressChange(n.address)}
                    key={n.address}
                  >{`${n.name[lang]} (${toThousands(n.balance)})`}</Tag>
                );
              })}
            </TagsWrapper>
          ) : null}
          <NFTWrapper>
            {!loading && !NFTBalances.length ? (
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
                {selectedNFT ? (
                  <div className="total">
                    {t(translations.blocks.tipCountBefore)} {toThousands(total)}{' '}
                    {lang === 'zh' ? '个 ' : ''}
                    {selectedNFT.name[lang] || ''} NFT{' '}
                    <span>
                      {selectedNFT.name[lang] || ''}{' '}
                      {t(translations.contract.address)}:{' '}
                      <AddressContainer value={selectedNFT.address} />
                    </span>
                  </div>
                ) : null}
                <Row gutter={20}>
                  {displayTokenIds.map(id => (
                    <Col xs={24} sm={12} lg={6} xl={4} key={id}>
                      <NFTPreview
                        contractAddress={selectedNFT?.address}
                        tokenId={id}
                        type="card"
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
