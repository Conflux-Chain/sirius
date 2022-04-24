import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import { Link } from 'app/components/Link/Loadable';
import { NFTPreview } from 'app/components/NFTPreview';
import styled from 'styled-components';
import { Row, Col, Collapse, Tooltip } from '@cfxjs/antd';
import { Description } from 'app/components/Description/Loadable';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { reqNFTDetail } from 'utils/httpRequest';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { useBreakpoint } from 'styles/media';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

import { formatTimeStamp } from 'utils';

import { TransferList } from './TransferList';
import { TransferModal } from './TransferModal';

import lodash from 'lodash';
// @ts-ignore
window.lodash = lodash;

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

export function NFTDetail(props) {
  const bp = useBreakpoint();
  const { t, i18n } = useTranslation();
  const { id, address } = useParams<{
    id: string;
    address: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);

    reqNFTDetail({
      query: { contractAddress: address, tokenId: id },
    })
      .then(({ data }) => {
        console.log('data: ', data);
        setData(data);
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address, id]);

  const tokenType = data.type?.replace('ERC', 'CRC');

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
            <NFTPreview contractAddress={address} tokenId={id} type="primary" />
          </Card>

          {bp !== 's' && (
            <TransferModal
              owner={data.owner}
              id={id}
              contractAddress={address}
              contractType={tokenType}
            ></TransferModal>
          )}
        </Col>
        <Col sm={24} md={16} style={{ width: '100%' }}>
          <Card style={{ padding: 0 }}>
            <Collapse defaultActiveKey={['details']} ghost>
              <Collapse.Panel
                header={t(translations.nftDetail.details)}
                key="details"
              >
                <Description title={t(translations.nftDetail.id)}>
                  <SkeletonContainer shown={loading}>{id}</SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.name)}>
                  <SkeletonContainer shown={loading}>
                    {i18n.language === 'zh-CN'
                      ? data.imageName?.zh
                      : data.imageName?.en}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.url)}>
                  <SkeletonContainer shown={loading}>
                    <div className="image-uri-container">
                      <Tooltip title={data.imageUri}>
                        <Link href={data.imageUri} className="image-uri">
                          {data.imageUri}
                        </Link>
                      </Tooltip>
                      <CopyButton copyText={data.imageUri} />
                    </div>
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.owner)}>
                  <SkeletonContainer shown={loading}>
                    <Link href={`/address/${data.owner}`}>{data.owner}</Link>{' '}
                    <CopyButton copyText={data.owner} />
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.type)}>
                  <SkeletonContainer shown={loading}>
                    {tokenType}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.address)}>
                  <SkeletonContainer shown={loading}>
                    <Link href={`/address/${address}`}>{address}</Link>{' '}
                    <CopyButton copyText={address} />
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.creator)}>
                  <SkeletonContainer shown={loading}>
                    <Link href={`/address/${data.creator}`}>
                      {data.creator}
                    </Link>{' '}
                    <CopyButton copyText={data.creator} />
                  </SkeletonContainer>
                </Description>
                <Description
                  title={t(translations.nftDetail.mintedTime)}
                  noBorder
                >
                  <SkeletonContainer shown={loading}>
                    {formatTimeStamp(data.mintTime, 'timezone')}
                  </SkeletonContainer>
                </Description>
              </Collapse.Panel>
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
              {data.detail?.metadata?.description && (
                <Collapse.Panel
                  header={t(translations.nftDetail.description)}
                  key="description"
                >
                  {data.detail?.metadata?.description}
                </Collapse.Panel>
              )}
            </Collapse>
          </Card>
        </Col>
      </Row>

      <StyledBottomWrapper>
        <TransferList type={data.type} address={address} id={id}></TransferList>
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
`;

const StyledBottomWrapper = styled.div`
  margin-top: 1.7143rem;
`;
