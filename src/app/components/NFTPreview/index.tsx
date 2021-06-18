/**
 *
 * NFTPreview
 *
 */
import React, { useEffect, useState } from 'react';
import { Image, Popover } from '@jnoodle/antd';
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
  const [imageMinHeight, setImageMinHeight] = useState(200);
  const [previewIcon, setPreviewIcon] = useState(nftPreview);
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    if (contractAddress && tokenId) {
      (async () => {
        const info = await getNFTInfo({ contractAddress, tokenId });
        if (info) {
          console.log('info', info);
          setImageMinHeight(info.imageMinHeight);
          setImageUri(info.imageUri);
          setImageName(info.imageName ? info.imageName[lang] || '' : '');
        }
      })();
    }
  }, [contractAddress, tokenId, lang]);

  return contractAddress && tokenId && imageUri ? (
    type === 'preview' ? (
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
    ) : (
      <>image</>
    )
  ) : null;
};

const PopoverWrapper = styled(Popover)`
  margin-left: 8px;
`;
