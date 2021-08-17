/**
 *
 * NFTPreview
 *
 */
import React, { useEffect, useState } from 'react';
import { Image, Popover, Skeleton, Spin } from '@jnoodle/antd';
import tokenIdNotFound from 'images/token/tokenIdNotFound.jpg';
import styled from 'styled-components';
import { Text } from '../Text/Loadable';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import nftPreviewActive from 'images/token/nftPreviewActive2.svg';
import nftPreview from 'images/token/nftPreview2.svg';
import nftInfo from 'images/info.svg';
import { reqNFTInfo } from 'utils/httpRequest';
import { Tooltip } from '@cfxjs/react-ui';
import NotFoundIcon from 'images/token/tokenIdNotFound.jpg';

const epiKProtocolKnowledgeBadge =
  'cfx:acev4c2s2ttu3jzxzsd4a2hrzsa4pfc3f6f199y5mk';

export const NFTPreview = React.memo(
  ({
    contractAddress,
    tokenId,
    type = 'preview',
  }: {
    contractAddress?: string;
    tokenId?: number | string;
    type?: 'preview' | 'card';
  }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language.includes('zh') ? 'zh' : 'en';
    const [imageUri, setImageUri] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageMinHeight, setImageMinHeight] = useState(200);
    const [previewIcon, setPreviewIcon] = useState(nftPreview);
    const [imageName, setImageName] = useState('');
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
      if (contractAddress && tokenId) {
        setLoading(true);

        reqNFTInfo({
          query: { contractAddress, tokenId },
        })
          .then(({ data }) => {
            if (data) {
              setImageMinHeight(data.imageMinHeight);
              if (data.imageUri) {
                setImageUri(data.imageUri);
              } else {
                setIsNotFound(true);
              }
              setImageName(data.imageName ? data.imageName[lang] || '' : '');
            } else {
              setIsNotFound(true);
            }
          })
          .catch(e => {
            console.log(e);
          })
          .finally(() => setLoading(false));
      }
    }, [contractAddress, tokenId, lang]);

    return contractAddress && tokenId ? (
      type === 'preview' ? (
        imageUri ? (
          <PopoverWrapper
            placement="right"
            trigger="click"
            overlayClassName="image-preview-popover"
            content={
              <>
                {contractAddress === epiKProtocolKnowledgeBadge ? (
                  <iframe
                    title={imageName}
                    width={200}
                    style={{ minHeight: imageMinHeight }}
                    src={imageUri}
                  />
                ) : (
                  <Image
                    width={200}
                    style={{ minHeight: imageMinHeight }}
                    src={imageUri}
                    preview={true}
                    fallback={tokenIdNotFound}
                    alt={tokenId + ''}
                  />
                )}
                {imageName ? (
                  <div className="image-preview-name">{imageName}</div>
                ) : null}
              </>
            }
            onVisibleChange={(visible: boolean) => {
              setPreviewIcon(visible ? nftPreviewActive : nftPreview);
            }}
          >
            <Text span hoverValue={t(translations.general.preview)}>
              <img
                src={previewIcon}
                alt="Preview"
                style={{ width: 17, height: 17, marginTop: -4 }}
              />
            </Text>
          </PopoverWrapper>
        ) : imageName ? (
          <Tooltip hoverable text={imageName} placement="top">
            <img src={nftInfo} alt="?" style={{ marginLeft: 4 }} />
          </Tooltip>
        ) : null
      ) : (
        <NFTCard>
          <Spin spinning={loading || (!imageUri && !isNotFound)}>
            {imageUri ? (
              contractAddress === epiKProtocolKnowledgeBadge ? (
                <div className="ant-image">
                  <iframe title={imageName} src={imageUri} />
                </div>
              ) : (
                <Image
                  width={500}
                  src={imageUri}
                  preview={true}
                  alt={tokenId + ''}
                />
              )
            ) : isNotFound ? (
              <Image width={500} src={NotFoundIcon} alt={'not found'} />
            ) : (
              <Skeleton.Image />
            )}
            <div className="info">
              <div className="name">{imageName}</div>
              <Tooltip text={tokenId} placement={'top-start'} hoverable>
                <div className="id">
                  {t(translations.nftChecker.tokenId)}:{tokenId}
                </div>
              </Tooltip>
            </div>
          </Spin>
        </NFTCard>
      )
    ) : null;
  },
);

const PopoverWrapper = styled(Popover)`
  margin-left: 8px;
`;

const NFTCard = styled.div`
  background-color: #fff;
  border: 1px solid #ebeced;
  border-radius: 5px;

  .ant-image {
    position: relative;
    width: 100%;
    max-width: 100%;
    padding-top: 100%;

    img,
    iframe {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: contain;
      border-radius: 5px 5px 0 0;
    }

    iframe {
      .album .btn {
        cursor: pointer;
      }
    }
  }

  .ant-skeleton {
    position: relative;
    width: 100%;
    max-width: 100%;
    padding-top: 100%;

    .ant-skeleton-image {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: contain;
      border-radius: 5px 5px 0 0;
    }
  }

  .info {
    padding: 8px 10px 10px;
    font-size: 12px;
    color: #002257;

    .name {
      height: 1em;
      margin-bottom: 6px;

      > span {
        font-size: 10px;
      }
    }

    .tooltip {
      width: 179px;

      .id {
        color: #74798c;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;
