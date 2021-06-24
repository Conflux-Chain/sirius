/**
 *
 * NFTPreview
 *
 */
import React, { useEffect, useState } from 'react';
import { Image, Popover, Spin, Skeleton } from '@jnoodle/antd';
import tokenIdNotFound from 'images/token/tokenIdNotFound.jpg';
import styled from 'styled-components';
import { Text } from '../Text/Loadable';
import { translations } from '../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import nftPreviewActive from 'images/token/nftPreviewActive2.svg';
import nftPreview from 'images/token/nftPreview2.svg';
import { getNFTInfo } from './utils';

export const NFTPreview = ({
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

  useEffect(() => {
    if (contractAddress && tokenId) {
      setLoading(true);

      (async () => {
        const info = await getNFTInfo({ contractAddress, tokenId });

        if (info) {
          setImageMinHeight(info.imageMinHeight);
          setImageUri(info.imageUri || tokenIdNotFound);
          setImageName(info.imageName ? info.imageName[lang] || '' : '');
        }
      })();

      setLoading(false);
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
              <Image
                width={200}
                style={{ minHeight: imageMinHeight }}
                src={imageUri}
                preview={true}
                fallback={tokenIdNotFound}
                alt={tokenId + ''}
              />
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
      ) : null
    ) : (
      <NFTCard>
        <Spin spinning={loading || !imageUri}>
          {imageUri ? (
            <Image
              width={500}
              src={imageUri}
              preview={true}
              alt={tokenId + ''}
            />
          ) : (
            <Skeleton.Image />
          )}
          <div className="info">
            <div className="name">
              {imageName} <span>#{tokenId}</span>
            </div>
            <div className="id">
              {t(translations.nftChecker.tokenId)}: {tokenId}
            </div>
          </div>
        </Spin>
      </NFTCard>
    )
  ) : null;
};

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

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: cover;
      border-radius: 5px 5px 0 0;
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
      object-fit: cover;
      border-radius: 5px 5px 0 0;
    }
  }

  .info {
    padding: 8px 10px 10px;
    font-size: 12px;
    color: #002257;

    .name {
      margin-bottom: 6px;
      > span {
        font-size: 10px;
      }
    }

    .id {
      color: #74798c;
    }
  }
`;
