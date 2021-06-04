/**
 *
 * NFTPreview
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Popover } from '@jnoodle/antd';
import tokenIdNotFound from 'images/token/tokenIdNotFound.jpg';
import { default as abi } from 'utils/contract/crc1155core.json';
import { cfx, formatAddress } from '../../../utils/cfx';
import styled from 'styled-components';
import { Text } from '../Text/Loadable';
import { translations } from '../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import nftPreviewActive from 'images/token/nftPreviewActive2.svg';
import nftPreview from 'images/token/nftPreview2.svg';
import { NFTContracts, NFTNames } from './NFTInfo';

const cacheNFT = (
  {
    address,
    tokenId,
    imageUri,
    imageName,
  }: {
    address: string;
    tokenId: string | number;
    imageUri?: string;
    imageName?: any;
  },
  isWrite: boolean = false,
) => {
  const cacheKey = `${address}-${tokenId}`;
  if (isWrite && imageUri) {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        address,
        tokenId,
        imageUri,
        imageName,
        // cache 3 days
        timeout: +new Date() + 1000 * 60 * 60 * 24 * 3,
      }),
    );
    return null;
  }
  const cachedNFT = localStorage.getItem(cacheKey);
  if (cachedNFT) {
    const cachedNFTObj = JSON.parse(cachedNFT);
    if (cachedNFTObj.timeout > +new Date()) {
      console.log('cached', tokenId);
      return cachedNFTObj;
    } else {
      console.log('cache timeout', tokenId);
      localStorage.removeItem(cacheKey);
      return null;
    }
  }
  console.log('not cached', tokenId);
  return null;
};

export const NFTPreview = ({
  contractAddress,
  tokenId,
}: {
  contractAddress?: string;
  tokenId?: number | string;
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';
  const [imageUri, setImageUri] = useState('');
  const [imageMinHeight, setImageMinHeight] = useState(200);
  const [previewIcon, setPreviewIcon] = useState(nftPreview);
  const [imageName, setImageName] = useState('123');

  const getName = ({
    address,
    tokenId,
    meta,
  }: {
    address: string;
    tokenId: string | number;
    meta?: any;
  }) => {
    try {
      switch (address) {
        case NFTContracts.confi:
          return NFTNames.confi[JSON.parse(meta).title.split('_')[0]];
        default:
          return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const setImage = useCallback(
    ({
      address,
      tokenId,
      method = 'uri',
      minHeight = 200,
      needFetchJson = true,
      jsonUriFormatter,
      imageUriFormatter,
    }: {
      address: string;
      tokenId: string | number;
      method?: string;
      minHeight?: number;
      needFetchJson?: boolean;
      jsonUriFormatter?: any;
      imageUriFormatter?: any;
    }) => {
      console.log(`setImage`, {
        address,
        tokenId,
      });
      const cachedNFTObj = cacheNFT({ address, tokenId });
      if (cachedNFTObj) {
        setImageMinHeight(minHeight);
        setImageUri(cachedNFTObj.imageUri);
        if (cachedNFTObj.imageName) {
          setImageName(cachedNFTObj.imageName[lang]);
        }
        return;
      }

      const contract = cfx.Contract({
        abi,
        address,
      });
      contract[method](tokenId)
        .then(res => {
          console.log(res);
          if (res) {
            if (needFetchJson) {
              fetch(
                `https://api.allorigins.win/get?url=${encodeURIComponent(
                  jsonUriFormatter ? jsonUriFormatter(res) : res,
                )}`,
              )
                .then(response => response.json())
                .then(data => {
                  setImageMinHeight(minHeight);
                  setImageUri(
                    imageUriFormatter
                      ? imageUriFormatter(data)
                      : JSON.parse(data.contents).image,
                  );
                  const nameObj = getName({ address, tokenId, meta: data });
                  if (nameObj) setImageName(nameObj[lang]);
                  cacheNFT(
                    {
                      address,
                      tokenId,
                      imageUri: imageUriFormatter
                        ? imageUriFormatter(data)
                        : JSON.parse(data.contents).image,
                      imageName: nameObj,
                    },
                    true,
                  );
                })
                .catch(e => {
                  console.error(e);
                });
            } else {
              setImageMinHeight(minHeight);
              setImageUri(imageUriFormatter ? imageUriFormatter(res) : res);
              const nameObj = getName({ address, tokenId, meta: res });
              if (nameObj) setImageName(nameObj[lang]);
              cacheNFT(
                {
                  address,
                  tokenId,
                  imageUri: imageUriFormatter ? imageUriFormatter(res) : res,
                  imageName: nameObj,
                },
                true,
              );
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    [lang],
  );

  const getImageUri = useCallback(
    (contractAddress, tokenId) => {
      const formatContractAddress = formatAddress(contractAddress) as string;
      switch (formatContractAddress) {
        case NFTContracts.confi:
          setImage({
            address: formatContractAddress,
            tokenId,
            method: 'uris',
            needFetchJson: false,
            imageUriFormatter: res =>
              'http://cdn.tspace.online/image/finish/' + JSON.parse(res).url,
          });
          break;

        case NFTContracts.confiCard:
          setImage({
            address: formatContractAddress,
            tokenId,
            minHeight: 328,
          });
          break;

        case NFTContracts.conDragon:
          setImage({
            address: formatContractAddress,
            tokenId,
          });
          break;

        case NFTContracts.confluxGuardian:
          setImageMinHeight(200);
          setImageUri('https://cdn.image.htlm8.top/guardian/nft.png');
          break;

        case NFTContracts.ancientChineseGod:
          setImage({
            address: formatContractAddress,
            tokenId,
            minHeight: 377,
            jsonUriFormatter: res =>
              res.replace('{id}', Number(tokenId).toString(16)),
          });
          break;

        case NFTContracts.moonswapGenesis:
          setImage({
            address: formatContractAddress,
            tokenId,
            minHeight: 150,
          });
          break;

        case NFTContracts.conHero:
          setImage({
            address: formatContractAddress,
            tokenId,
            minHeight: 267,
          });
          break;

        case NFTContracts.conDragonStone:
          setImageMinHeight(200);
          setImageUri(
            'https://cdn.image.htlm8.top/dragon-stone/dragon-stone.png',
          );
          break;

        case NFTContracts.satoshiGift:
          setImageMinHeight(282);
          setImageUri('https://cdn.image.htlm8.top/pizza-day/nft.png');
          break;

        case NFTContracts.shanhaijing:
          setImage({
            address: formatContractAddress,
            tokenId,
            minHeight: 267,
          });
          break;

        case NFTContracts.shanhaichingSeriesCard:
          setImageMinHeight(267);
          setImageUri('https://metadata.boxnft.io/nftbox.gif');
          break;

        case NFTContracts.shuttleflowBscNft:
          setImageMinHeight(200);
          setImageUri(
            'https://cdn.image.htlm8.top/bsc-shuttleflow-nft/nft.png',
          );
          break;

        case NFTContracts.crossChainNftGloryEdition:
          setImageMinHeight(200);
          setImageUri(
            'https://cdn.image.htlm8.top/flux-shuttleflow-nft/nft.jpg',
          );
          break;

        case NFTContracts.happyBirthdayToConfi:
          setImageMinHeight(50);
          setImageUri('https://cdn.image.htlm8.top/confi-birthday-nft/nft.png');
          break;

        case NFTContracts.TREAGenesisFeitian:
          setImage({
            address: formatContractAddress,
            tokenId,
            method: 'uris',
            minHeight: 200,
            needFetchJson: false,
            imageUriFormatter: res => JSON.parse(res).image,
          });
          break;

        case NFTContracts.OKExNft:
          setImageMinHeight(200);
          setImageUri(
            'https://cdn.image.htlm8.top/okex-listing-nft/okex-listing-nft.gif',
          );
          break;

        case NFTContracts.minerNft:
          // TODO
          break;

        case NFTContracts.honorOfPractitioner:
          setImageMinHeight(288);
          setImageUri('https://cdn.image.htlm8.top/practitioner/nft.png');
          break;

        case NFTContracts.confiOfSchrodinger:
          setImageMinHeight(150);
          setImageUri('https://cj.yzbbanban.com/purplerr.jpeg');
          break;

        default:
          setImageMinHeight(200);
          break;
      }
    },
    [setImage],
  );

  useEffect(() => {
    if (contractAddress && tokenId) {
      getImageUri(contractAddress, tokenId);
    }
  }, [contractAddress, getImageUri, tokenId]);

  return contractAddress && tokenId && imageUri ? (
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
          {imageName && <div className="image-preview-name">{imageName}</div>}
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
  ) : null;
};

const PopoverWrapper = styled(Popover)`
  margin-left: 8px;
`;
