/**
 *
 * NFT Checker
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import { translations } from 'locales/i18n';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Col, Input, Pagination, Row, Spin, Tag } from '@jnoodle/antd';
import { useParams } from 'react-router-dom';
import { formatAddress } from 'utils/cfx';
import {
  NFTContractAddresses,
  NFTContractNames,
  NFTContracts,
} from '../../components/NFTPreview/NFTInfo';
import { getNFTBalances, getNFTTokens } from './utils';
import { NFTPreview } from '../../components/NFTPreview';

const { Search } = Input;

type NFTBalancesType = {
  type: string;
  address: string;
  name: any;
  balance: number;
};

export function NFTChecker() {
  const { address: routerAddress = '' } = useParams<{
    address?: string;
  }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';
  const [address, setAddress] = useState<string>(routerAddress);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [addressFormatError, setAddressFormatError] = useState<boolean>(false);
  const [currentNFTType, setCurrentNFTType] = useState<string>('');
  const [currentNFTOffset, setCurrentNFTOffset] = useState<number>(0);
  const defaultLimit = 12;
  const [currentNFTCount, setCurrentNFTCount] = useState<number>(0);
  const [displayTokenIds, setDisplayTokenIds] = useState<number[]>([]);
  const [NFTBalances, setNFTBalances] = useState<NFTBalancesType[]>([]);

  const handleNFTSearch = async () => {
    setLoading(true);
    const formattedAddress = formatAddress(address);
    if (formattedAddress && !formattedAddress.startsWith('invalid')) {
      setHasSearched(true);
      // get all supported nft balances
      const balances = await getNFTBalances(formattedAddress);
      // console.log('balances', balances);

      if (balances) {
        const _NFTBalances = Object.keys(NFTContracts)
          .map((n, i) => ({
            type: n,
            address: NFTContractAddresses[i],
            name: NFTContractNames[n],
            balance: balances[i],
          }))
          .filter(n => n.balance > 0);

        if (_NFTBalances && _NFTBalances.length > 0) {
          setNFTBalances(_NFTBalances);
          await selectTag(_NFTBalances[0]);
        } else {
          reset();
        }
      } else {
        reset();
      }
    } else {
      setAddressFormatError(true);
    }
    setLoading(false);
  };

  const reset = () => {
    setNFTBalances([]);
    setCurrentNFTType('');
    setCurrentNFTOffset(0);
    setCurrentNFTCount(0);
    setDisplayTokenIds([]);
  };

  const handleAddressChange = e => {
    setAddress(e.target.value.trim());
    setAddressFormatError(false);
  };

  const selectTag = async balanceObj => {
    // console.log('balanceObj', balanceObj);
    if (balanceObj) {
      setCurrentNFTType(balanceObj.type);
      setCurrentNFTOffset(0);
      setCurrentNFTCount(balanceObj.balance || 0);
      await getTokenIds({ contractAddress: balanceObj.address });
    }
  };

  // get token ids TODO cache
  const getTokenIds = async ({
    contractAddress,
    offset,
  }: {
    contractAddress?: string;
    offset?: number;
  }) => {
    setLoading(true);
    setDisplayTokenIds([]);
    const tokens = await getNFTTokens(
      contractAddress || NFTContracts[currentNFTType],
      formatAddress(address),
      (offset == null ? currentNFTOffset : offset) * defaultLimit,
      defaultLimit,
    );

    if (tokens && tokens.length > 1) {
      setDisplayTokenIds(tokens[1]);
    }
    setLoading(false);
  };

  const onPaginationChange = async (page: number) => {
    setCurrentNFTOffset(page - 1);
    await getTokenIds({ offset: page - 1 });
  };

  useEffect(() => {
    if (address) {
      (async () => {
        await handleNFTSearch();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>{t(translations.header.nftChecker)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.nftChecker.title)}</PageHeader>
      <StyledSubtitleWrapper>
        {t(translations.nftChecker.subtitle)}
      </StyledSubtitleWrapper>
      <SearchWrapper>
        <Search
          value={address}
          onChange={handleAddressChange}
          placeholder={t(translations.addressConverter.inputPlaceholder)}
          onSearch={async () => {
            await handleNFTSearch();
          }}
        />
        {addressFormatError ? (
          <div className="convert-address-error">
            {t(translations.nftChecker.incorrectFormat)}
          </div>
        ) : null}
      </SearchWrapper>
      <StyledResultWrapper>
        <Card>
          <Spin spinning={loading}>
            {NFTBalances && NFTBalances.length > 0 ? (
              <TagsWrapper>
                {NFTBalances.map((n: NFTBalancesType, i) => (
                  <Tag
                    className={currentNFTType === n.type ? 'current' : ''}
                    onClick={() =>
                      selectTag(
                        NFTBalances.find(
                          (b: NFTBalancesType) => b.type === n.type,
                        ),
                      )
                    }
                    key={i}
                  >{`${n.name[lang]} (${n.balance})`}</Tag>
                ))}
              </TagsWrapper>
            ) : null}
            <NFTWrapper>
              {!loading &&
              (!NFTBalances || NFTBalances.length === 0) &&
              hasSearched ? (
                <div className="nodata">
                  {t(translations.general.table.noData)}
                </div>
              ) : (
                <Row gutter={20}>
                  {displayTokenIds.map((id, i) => (
                    <Col xs={24} sm={12} lg={6} xl={4} key={i}>
                      <NFTPreview
                        contractAddress={NFTContracts[currentNFTType]}
                        tokenId={id}
                        type="card"
                      />
                    </Col>
                  ))}
                </Row>
              )}

              {currentNFTCount > defaultLimit ? (
                <Pagination
                  current={currentNFTOffset + 1}
                  defaultPageSize={defaultLimit}
                  total={currentNFTCount}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  onChange={async page => {
                    await onPaginationChange(page);
                  }}
                />
              ) : null}
            </NFTWrapper>
          </Spin>
        </Card>
      </StyledResultWrapper>
    </>
  );
}

const SearchWrapper = styled.div`
  margin-bottom: 24px;

  .ant-input-search {
    max-width: 500px;
  }

  .ant-input {
    border-radius: 16px !important;
    background: rgba(30, 61, 228, 0.04);
    border: none !important;
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

      .anticon {
        font-size: 18px;
        margin-bottom: 3px;
      }
    }
  }

  .convert-address-error {
    width: 100%;
    margin: 0.5714rem 0;
    font-size: 0.8571rem;
    color: #e64e4e;
    line-height: 1.1429rem;
    padding-left: 0.3571rem;

    ${media.s} {
      width: 100%;
    }
  }
`;

const StyledSubtitleWrapper = styled.div`
  color: #74798c;
  font-size: 1rem;
  line-height: 1.2857rem;
  margin: 1.1429rem 0 1.7143rem;
`;

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
  padding: 40px 0;
  min-height: 100px;

  .nodata {
    color: #74798c;
  }

  .ant-pagination {
    margin-top: 20px;
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
