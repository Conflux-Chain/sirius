/**
 *
 * NFTPreview
 *
 */
import React, { useEffect, useState } from 'react';
import { Popover, Image } from '@jnoodle/antd';
import tokenIdNotFound from 'images/token/tokenIdNotFound.jpg';
import iconViewTxn from 'images/view-txn.png';

export const NFTPreview = ({
  contractAddress,
  tokenId,
}: {
  contractAddress?: string;
  tokenId?: number | string;
}) => {
  const [imageUri, setImageUri] = useState('');

  const getImageUri = (contractAddress, tokenId) => {
    switch (contractAddress) {
      // Confi
      case '':
        break;

      default:
        break;
    }
    setImageUri(
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    );
  };

  useEffect(() => {
    if (contractAddress && tokenId) {
      getImageUri(contractAddress, tokenId);
    }
  }, [contractAddress, tokenId]);

  return contractAddress && tokenId && imageUri ? (
    <Popover
      placement="right"
      trigger="click"
      content={
        <Image
          width={200}
          src={imageUri}
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
