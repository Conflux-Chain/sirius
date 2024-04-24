import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { Link } from 'sirius-next/packages/common/dist/components/Link';
import { NFTPreview } from 'app/components/NFTPreview';
import styled from 'styled-components';
import { Row, Col, Collapse, message, Typography } from '@cfxjs/antd';
import { Tooltip } from 'sirius-next/packages/common/dist/components/Tooltip';
import { Description } from 'sirius-next/packages/common/dist/components/Description';
import { CopyButton } from 'sirius-next/packages/common/dist/components/CopyButton';
import { reqNFTDetail, reqToken, reqRefreshMetadata } from 'utils/httpRequest';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { useBreakpoint } from 'styles/media';
import { InfoIconWithTooltip } from 'sirius-next/packages/common/dist/components/InfoIconWithTooltip';
import Button from 'sirius-next/packages/common/dist/components/Button';
import { usePlatform } from 'utils/hooks/usePlatform';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

import { formatTimeStamp, addIPFSGateway } from 'utils';

import { TransferAndHolders } from './TransferAndHolders';
import { TransferModal } from './TransferModal';

import { AddressContainer } from 'sirius-next/packages/common/dist/components/AddressContainer';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';

const { Text } = Typography;

const AceEditorStyle = {
  width: 'initial',
  backgroundColor: '#F8F9FB',
  opacity: 0.62,
  margin: '0.3571rem 0',
};

interface Props {
  type: string;
  address: string;
  decimals: number;
}

interface Query {
  accountAddress?: string;
  transactionHash?: string;
  tokenId?: string;
}

interface StringAttributes {
  trait_type: string;
  value: string;
}

interface NumberAttributes {
  trait_type: string;
  value: number;
  display_type: string;
}

const TraitPanel = ({ data = [] }: { data: Array<StringAttributes> }) => {
  return (
    <StyledTraitPanelWrapper>
      <Row gutter={[16, 16]} align="stretch">
        {data.map(d => (
          <Col span={6} key={d.trait_type}>
            <div className="container">
              <Text className="type" ellipsis={{ tooltip: d.trait_type }}>
                {d.trait_type}
              </Text>
              <Text className="value" ellipsis={{ tooltip: d.value }}>
                {d.value}
              </Text>
            </div>
          </Col>
        ))}
      </Row>
    </StyledTraitPanelWrapper>
  );
};

const DatePanel = ({ data = [] }: { data: Array<NumberAttributes> }) => {
  return (
    <StyledDatePanelWrapper>
      {data.map(d => {
        let date = '--';

        try {
          date = dayjs(d.value * 1000).format('YYYY-MM-DD HH:mm:ss');
        } catch (error) {}

        return (
          <div className="container" key={d.trait_type}>
            <span className="type">{d.trait_type}</span>
            <span className="value">{date}</span>
          </div>
        );
      })}
    </StyledDatePanelWrapper>
  );
};

const DescriptionPanel = ({ data = '' }) => {
  return <div>{data}</div>;
};

const StyledTraitPanelWrapper = styled.div`
  .container {
    border: 1px solid var(--theme-color-blue4);
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
    background-color: var(--theme-color-blue3);
    height: 100%;
  }

  .type {
    color: var(--theme-color-gray4);
    font-weight: 500;
    font-size: 12px;
    margin-bottom: 12px;
    width: 100%;
  }

  .value {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    width: 100%;
  }
`;
const StyledDatePanelWrapper = styled.div`
  .container {
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
      padding-bottom: 12px;
    }

    &:not(:first-child) {
      padding-top: 12px;
      border-top: 1px solid var(--theme-color-gray0);
    }
  }

  .type {
    font-size: 14px;
    color: var(--theme-color-gray4);
  }
  .value {
    font-size: 14px;
    font-weight: 450;
  }
`;

export function NFTDetail(props) {
  const { isDapp } = usePlatform();
  const bp = useBreakpoint();
  const { t, i18n } = useTranslation();
  const { id, address } = useParams<{
    id: string;
    address: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [tokenInfo, setTokenInfo] = useState({
    name: '',
    symbol: '',
  });

  useEffect(() => {
    setLoading(true);

    reqNFTDetail({
      address,
      tokenId: id,
      formatServerError: (e: any, metadata) => {
        const data = e?.response?.result || {};
        if (metadata) {
          _.merge(data, {
            detail: {
              metadata,
            },
          });
        }
        return data;
      },
    })
      .then(data => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });

    reqToken({ address }).then(({ name, symbol }) => {
      setTokenInfo({
        name,
        symbol,
      });
    });
  }, [address, id]);

  const handleRefresh = useCallback(
    e => {
      reqRefreshMetadata({
        contractAddress: address,
        tokenId: id,
      }).then(() => {
        message.info(t(translations.nftDetail.refreshTip));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, id],
  );

  const tokenType = data.type?.replace('ERC', 'CRC');
  const name =
    i18n.language === 'zh-CN' ? data.imageName?.zh : data.imageName?.en;
  const { description = '', attributes = [] } = data.detail?.metadata || {};

  const {
    description: descrptionStr,
    dateTypeAttributes,
    stringTypeAttributes,
  } = useMemo(() => {
    let dateTypeAttributes: any = [],
      stringTypeAttributes: any = [];

    attributes
      ?.filter(a => a.trait_type !== undefined && a.value !== undefined)
      .forEach(a => {
        if (a.display_type === 'date') {
          dateTypeAttributes.push(a);
        } else if (a.display_type === undefined) {
          stringTypeAttributes.push(a);
        }
      });

    return {
      description,
      dateTypeAttributes,
      stringTypeAttributes,
    };
  }, [description, attributes]);

  const imgURL = addIPFSGateway(
    data.detail?.metadata?.image,
    data.imageGateway,
  );

  return (
    <StyledWrapper>
      <Helmet>
        <title>{t(translations.header.nftDetail)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.nftDetail.title)}</PageHeader>

      <Row gutter={[24, 24]}>
        <Col sm={24} md={8} style={{ width: '100%' }}>
          <Card style={{ padding: 0 }}>
            <NFTPreview
              contractAddress={address}
              tokenId={id}
              type="primary"
              enable3D={true}
              nftInfo={data}
            />
          </Card>

          {((bp !== 's' && bp !== 'm') || isDapp) && (
            <TransferModal
              id={id}
              contractAddress={address}
              contractType={tokenType}
            ></TransferModal>
          )}
        </Col>
        <Col sm={24} md={16} style={{ width: '100%' }}>
          <Card style={{ padding: 0 }}>
            <Button
              className="button-refresh"
              type="action"
              size="small"
              onClick={handleRefresh}
            >
              {t(translations.general.refresh)}
            </Button>
            <Collapse defaultActiveKey={['details', 'trait']} ghost>
              <Collapse.Panel
                header={t(translations.nftDetail.details)}
                key="details"
              >
                <Description title={t(translations.nftDetail.id)}>
                  <SkeletonContainer shown={loading}>
                    {id ? id : '--'}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.name)}>
                  <SkeletonContainer shown={loading}>
                    {name ? name : '--'}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.url)}>
                  <SkeletonContainer shown={loading}>
                    {imgURL ? (
                      <div className="image-uri-container">
                        <Tooltip title={imgURL}>
                          <Link href={imgURL} className="image-uri">
                            {imgURL}
                          </Link>
                        </Tooltip>
                        <CopyButton copyText={imgURL} />
                      </div>
                    ) : (
                      '--'
                    )}
                  </SkeletonContainer>
                </Description>
                {tokenType?.includes('721') && (
                  <Description title={t(translations.nftDetail.owner)}>
                    <SkeletonContainer shown={loading}>
                      {data.owner ? (
                        <>
                          <AddressContainer
                            value={data.owner}
                            isFull={true}
                          ></AddressContainer>{' '}
                          <CopyButton copyText={data.owner} />
                        </>
                      ) : (
                        '--'
                      )}
                    </SkeletonContainer>
                  </Description>
                )}
                <Description title={t(translations.nftDetail.type)}>
                  <SkeletonContainer shown={loading}>
                    {tokenType ? tokenType : '--'}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.address)}>
                  <SkeletonContainer shown={loading}>
                    {address ? (
                      <>
                        <Link href={`/token/${address}?tab=NFT`}>
                          <span
                            style={{
                              pointerEvents: 'none',
                            }}
                          >
                            <AddressContainer
                              value={address}
                              isFull={true}
                            ></AddressContainer>
                          </span>
                        </Link>{' '}
                        <CopyButton copyText={address} />
                      </>
                    ) : (
                      '--'
                    )}
                  </SkeletonContainer>
                </Description>
                <Description
                  title={
                    <InfoIconWithTooltip
                      info={t(translations.nftDetail.contractInfoTip)}
                    >
                      {t(translations.nftDetail.contractInfo)}
                    </InfoIconWithTooltip>
                  }
                >
                  <SkeletonContainer shown={loading}>
                    {`${tokenInfo.name ? tokenInfo.name : '--'} (${
                      tokenInfo.symbol ? tokenInfo.symbol : '--'
                    })`}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.creator)}>
                  <SkeletonContainer shown={loading}>
                    {data.creator ? (
                      <>
                        <AddressContainer
                          value={data.creator}
                          isFull={true}
                        ></AddressContainer>{' '}
                        <CopyButton copyText={data.creator} />
                      </>
                    ) : (
                      '--'
                    )}
                  </SkeletonContainer>
                </Description>
                <Description
                  title={t(translations.nftDetail.mintedTime)}
                  noBorder
                >
                  <SkeletonContainer shown={loading}>
                    {data.mintTime
                      ? formatTimeStamp(data.mintTime, 'timezone')
                      : '--'}
                  </SkeletonContainer>
                </Description>
              </Collapse.Panel>
              {!!stringTypeAttributes.length && (
                <Collapse.Panel
                  header={t(translations.nftDetail.trait, {
                    amount: stringTypeAttributes.length,
                  })}
                  key="trait"
                >
                  <TraitPanel data={stringTypeAttributes} />
                </Collapse.Panel>
              )}
              {!!dateTypeAttributes.length && (
                <Collapse.Panel
                  header={t(translations.nftDetail.datetime)}
                  key="date"
                >
                  <DatePanel data={dateTypeAttributes} />
                </Collapse.Panel>
              )}
              {!!descrptionStr && (
                <Collapse.Panel
                  header={t(translations.nftDetail.description)}
                  key="description"
                >
                  <DescriptionPanel data={descrptionStr} />
                </Collapse.Panel>
              )}
              {data.detail?.metadata && (
                <Collapse.Panel
                  header={t(translations.nftDetail.metadata)}
                  key="metadata"
                >
                  <AceEditor
                    style={AceEditorStyle}
                    mode="json"
                    theme="tomorrow"
                    name="inputdata_json"
                    setOptions={{
                      showLineNumbers: true,
                    }}
                    fontSize="1rem"
                    showGutter={false}
                    showPrintMargin={false}
                    value={JSON.stringify(data.detail?.metadata, null, 4)}
                    readOnly={true}
                    height="20.1429rem"
                    wrapEnabled={true}
                  />
                </Collapse.Panel>
              )}
            </Collapse>
          </Card>
        </Col>
      </Row>

      <StyledBottomWrapper>
        <TransferAndHolders
          type={data.type}
          address={address}
          id={id}
          loading={loading}
          key={data.type}
        />
      </StyledBottomWrapper>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  div.ant-collapse-header {
    display: flex;
    align-items: center;
  }

  .button-transfer {
    margin-top: 16px;
  }

  .image-uri-container {
    display: flex;
    align-items: center;
  }

  .link.image-uri {
    max-width: 350px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
  }

  .button-refresh {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 2;
  }

  .right {
    overflow: auto;
  }
`;

const StyledBottomWrapper = styled.div`
  margin-top: 1.7143rem;
`;
