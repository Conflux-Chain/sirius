import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Spin, Row, Col, Pagination, Divider } from '@cfxjs/antd';
import { toThousands } from '../../../utils';
import { Empty } from '../../components/Empty';
import { translations } from '../../../locales/i18n';
import { NFTPreview } from '../../components/NFTPreview';
import styled from 'styled-components/macro';
import { media } from '../../../styles/media';
import { useTranslation } from 'react-i18next';
import { ScanEvent } from '../../../utils/gaConstants';
import { Select } from '../../components/Select';
import { trackEvent } from '../../../utils/ga';
import qs from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { reqNFTTokenIdsInTokenPage } from '../../../utils/httpRequest';

export const NFTs = ({ address }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { skip = '0', limit = '12' } = qs.parse(search);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [displayTokenIds, setDisplayTokenIds] = useState<number[]>([]);
  const [option, setOption] = useState('recentlyActive');
  const options = [
    {
      value: 'recentlyActive',
      name: t(translations.token.recentlyActive),
    },
    {
      value: 'newest',
      name: t(translations.token.newest),
    },
    {
      value: 'oldest',
      name: t(translations.token.oldest),
    },
  ];

  const pageSize = Number(limit);
  const page = Math.floor((Number(skip) || 0) / pageSize) + 1;

  const handleChangeOption = option => {
    if (option === 'recentlyActive') {
      trackEvent({
        category: ScanEvent.token.category,
        action: ScanEvent.token.action.recentlyActive,
        label: 'recentlyActive',
      });
      setOption('recentlyActive');
    } else if (option === 'newest') {
      trackEvent({
        category: ScanEvent.token.category,
        action: ScanEvent.token.action.recentlyActive,
        label: 'newest',
      });
      setOption('newest');
    } else {
      trackEvent({
        category: ScanEvent.token.category,
        action: ScanEvent.token.action.recentlyActive,
        label: 'oldest',
      });
      setOption('oldest');
    }
  };
  const handlePaginationChange = (page, pageSize) => {
    history.push(
      qs.stringifyUrl({
        url: pathname,
        query: {
          tab: 'NFT',
          skip: String((page - 1) * pageSize),
          limit: String(pageSize),
        },
      }),
    );
  };
  const getTokenIds = async () => {
    setLoading(true);
    setDisplayTokenIds([]);
    const { data } = await reqNFTTokenIdsInTokenPage({
      query: {
        contractAddress: address,
        limit,
        skip,
      },
    });
    const tokenIds = data.rows.reduce((oldArray, currentValue) => {
      oldArray.push(currentValue.tokenId);
      return oldArray;
    }, []);
    setDisplayTokenIds(tokenIds);
    setTotal(data.count);
    setLoading(false);
  };

  useEffect(() => {
    getTokenIds();
  }, [address, skip, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledResultWrapper>
      <Card>
        <Spin spinning={loading}>
          <NFTWrapper>
            {!loading && (!displayTokenIds || displayTokenIds.length === 0) ? (
              <div className="nodata">
                <Empty show={true} />
              </div>
            ) : (
              <>
                {total > 0 ? (
                  <HeaderWrapper>
                    <TotalWrapper>
                      {t(translations.token.total)}{' '}
                      <NumberWrapper>{toThousands(total)} </NumberWrapper>
                      {t(translations.token.tokens)}
                    </TotalWrapper>
                    <SelectWrapper>
                      <SortByWrapper>
                        {t(translations.token.sortBy)}
                      </SortByWrapper>
                      <Select
                        value={option}
                        onChange={handleChangeOption}
                        disableMatchWidth
                        size="small"
                        className="btnSelectContainer"
                        variant="text"
                      >
                        {options.map(o => {
                          return (
                            <Select.Option key={o.value} value={o.value}>
                              {o.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </SelectWrapper>
                  </HeaderWrapper>
                ) : null}
                <Divider />
                <Row gutter={20}>
                  {displayTokenIds.map((id, i) => (
                    <Col xs={24} sm={12} lg={6} xl={4} key={i}>
                      <NFTPreview
                        contractAddress={address}
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
};

const StyledResultWrapper = styled.div`
  margin-top: 1.7143rem;

  .convert-address-description {
    flex-direction: row;

    .left {
      width: 35.7143rem;
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

  .ant-divider-horizontal {
    margin: 12px 0 24px 0;
  }

  .ant-pagination {
    margin-top: 10px;
    text-align: right;

    li {
      margin-bottom: 0;

      &:before {
        display: none;
      }

      . anticon {
        vertical-align: 1px;
      }
    }
  }

  .ant-col {
    padding-bottom: 20px;
  }
`;
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 36px;
  color: #737682 !important;
`;
const TotalWrapper = styled.div``;
const NumberWrapper = styled.span`
  color: #1e3de4;
`;
const SelectWrapper = styled.span`
  //display: flex;
  // todo sort框以后再加进来
  display: none;
  align-items: center;
  width: 198px;

  div {
    font-size: 14px !important;
    color: #737682 !important;
  }
`;
const SortByWrapper = styled.span`
  line-height: 36px;
`;
