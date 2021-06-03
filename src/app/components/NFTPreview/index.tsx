/**
 *
 * NFTPreview
 *
 */
import React, { useState } from 'react';
import { Popover, Image } from '@jnoodle/antd';
import tokenIdNotFound from 'images/token/tokenIdNotFound.jpg';
import iconViewTxn from 'images/view-txn.png';
import { default as abi } from 'utils/contract/crc1155core.json';
import { cfx, formatAddress } from '../../../utils/cfx';

const crc1155Contracts = {
  confi: 'cfx:acc370g3s6d56ndcp8t6gyc657rhtp0fz6ytc8j9d2',
  conDragon: 'cfx:acb3fcbj8jantg52jbg66pc21jgj2ud02pj1v4hkwn',
  confluxGuardian: 'cfx:ach7c9fr2skv5fft98cygac0g93999z1refedecnn1',
  ancientChineseGod: 'cfx:acbp6r5kpgvz3pcxax557r2xrnk4rv9f02tpkng9ne',
  moonswapGenesis: 'cfx:ace6x5ckj2d47fzsfj5pvu8uejf6hkj2denccrga1x',
  conHero: 'cfx:acgjttbz35rukntbvnp6u6arx8rwwxekfyks00vr3n',
};

export const NFTPreview = ({
  contractAddress,
  tokenId,
}: {
  contractAddress?: string;
  tokenId?: number | string;
}) => {
  const [imageUri, setImageUri] = useState('');
  const [imageMinHeight, setImageMinHeight] = useState(200);

  const setImage = ({
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
              })
              .catch(e => {
                console.error(e);
              });
          } else {
            setImageMinHeight(minHeight);
            setImageUri(imageUriFormatter ? imageUriFormatter(res) : res);
          }
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  const getImageUri = (contractAddress, tokenId) => {
    const formatContractAddress = formatAddress(contractAddress) as string;
    switch (formatContractAddress) {
      case crc1155Contracts.confi:
        setImage({
          address: formatContractAddress,
          tokenId,
          method: 'uris',
          needFetchJson: false,
          imageUriFormatter: res =>
            'http://cdn.tspace.online/image/finish/' + JSON.parse(res).url,
        });
        break;

      case crc1155Contracts.conDragon:
        setImage({
          address: formatContractAddress,
          tokenId,
        });
        break;

      case crc1155Contracts.confluxGuardian:
        setImageMinHeight(200);
        setImageUri('https://cdn.image.htlm8.top/guardian/nft.png');
        break;

      case crc1155Contracts.ancientChineseGod:
        setImage({
          address: formatContractAddress,
          tokenId,
          minHeight: 377,
          jsonUriFormatter: res =>
            res.replace('{id}', Number(tokenId).toString(16)),
        });
        break;

      case crc1155Contracts.moonswapGenesis:
        setImage({
          address: formatContractAddress,
          tokenId,
          minHeight: 150,
        });
        break;

      case crc1155Contracts.conHero:
        setImage({
          address: formatContractAddress,
          tokenId,
          minHeight: 267,
        });
        break;

      default:
        setImageMinHeight(200);
        break;
    }
  };

  if (contractAddress && tokenId) {
    getImageUri(contractAddress, tokenId);
  }

  return contractAddress && tokenId && imageUri ? (
    <Popover
      placement="right"
      trigger="click"
      content={
        <Image
          width={200}
          style={{ minHeight: imageMinHeight }}
          src={imageUri}
          preview={true}
          fallback={tokenIdNotFound}
          alt={tokenId + ''}
        />
      }
    >
      <img
        src={iconViewTxn}
        alt="Preview"
        style={{ width: '1.4286rem', height: '1.4286rem', marginTop: -3 }}
      />
    </Popover>
  ) : null;
};
