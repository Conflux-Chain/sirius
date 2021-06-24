// get NFT cache info from localStorage
import { NFTContracts, NFTNames } from './NFTInfo';
import { cfx, formatAddress } from '../../../utils/cfx';
import { default as abi } from '../../../utils/contract/crc1155core.json';

export const getNFTCacheInfo = ({
  address,
  tokenId,
}: {
  address: string;
  tokenId: string | number;
}) => {
  const cacheKey = `${address}-${tokenId}`;
  const cachedNFT = localStorage.getItem(cacheKey);
  if (cachedNFT) {
    const cachedNFTObj = JSON.parse(cachedNFT);
    if (cachedNFTObj.timeout > +new Date()) {
      return cachedNFTObj;
    } else {
      localStorage.removeItem(cacheKey);
      return null;
    }
  }
  return null;
};

// set NFT cache info to localStorage
export const setNFTCacheInfo = ({
  address,
  tokenId,
  imageUri,
  imageName,
}: {
  address: string;
  tokenId: string | number;
  imageUri?: string;
  imageName?: any;
}) => {
  const cacheKey = `${address}-${tokenId}`;
  if (imageUri) {
    localStorage.removeItem(cacheKey);
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
  return null;
};

// get NFT name
export const getNFTName = async ({
  address,
  tokenId,
  meta,
}: {
  address: string;
  tokenId?: string | number;
  meta?: any;
}) => {
  try {
    switch (address) {
      case NFTContracts.confi:
        return NFTNames.confi[JSON.parse(meta).title.split('_')[0]];
      case NFTContracts.confiCard:
        return {
          zh: JSON.parse(meta.contents).name || null,
          en: JSON.parse(meta.contents).name || null,
        };
      case NFTContracts.conDragon:
        return {
          zh: JSON.parse(meta.contents).name || null,
          en: JSON.parse(meta.contents).name_en || null,
        };
      case NFTContracts.confluxGuardian:
        return {
          zh: '守护者勋章',
          en: 'Guardian',
        };
      case NFTContracts.ancientChineseGod:
      case NFTContracts.ancientChineseGodGenesis:
        const zhUri = JSON.parse(meta.contents).localization.uri.replace(
          '{locale}',
          'zh-cn',
        );
        const res = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(zhUri)}`,
        );
        const resJson = await res.json();
        return {
          zh: JSON.parse(resJson.contents).name || null,
          en: JSON.parse(meta.contents).name || null,
        };
      case NFTContracts.moonswapGenesis:
        return {
          zh: '创世 NFT',
          en: 'Genesis NFT',
        };
      case NFTContracts.conHero:
        return {
          zh: JSON.parse(meta.contents).name || null,
          en: JSON.parse(meta.contents).name_en || null,
        };
      case NFTContracts.conDragonStone:
        return {
          zh: '龙石',
          en: 'Dragon Stone NFT',
        };
      case NFTContracts.satoshiGift:
        return {
          zh: "Satoshi's gift",
          en: "Satoshi's gift",
        };
      case NFTContracts.shanhaijing:
        return {
          zh: JSON.parse(meta.contents).name || null,
          en: JSON.parse(meta.contents).name || null,
        };
      case NFTContracts.shanhaichingSeriesCard:
        return {
          zh: '山海经卡包',
          en: 'Shanhaiching Series Card Pack',
        };
      case NFTContracts.shuttleflowBscNft:
        return {
          zh: 'ShuttleFlow-BSC NFT',
          en: 'ShuttleFlow-BSC NFT',
        };
      case NFTContracts.crossChainNftGloryEdition:
        return {
          zh: '荣耀版跨链NFT',
          en: 'Cross-Chain NFT / Glory Edition',
        };
      case NFTContracts.happyBirthdayToConfi:
        return {
          zh: 'Happy Birthday to ConFi',
          en: 'Happy Birthday to ConFi',
        };
      case NFTContracts.TREAGenesisFeitian:
        return {
          zh: 'TREA 创世飞天',
          en: 'TREA Genesis Feitian',
        };
      case NFTContracts.OKExNft:
        return {
          zh: 'OKEx NFT',
          en: 'OKEx NFT',
        };
      // case NFTContracts.minerNft:
      //   return null;
      case NFTContracts.honorOfPractitioner:
        return {
          zh: '践行者计划',
          en: 'Honor of Practitioner',
        };
      case NFTContracts.confiOfSchrodinger:
        return {
          zh: '薛定谔的盒',
          en: 'Confi of Schrodinger',
        };
      case NFTContracts.threeKingdoms:
        return {
          zh: JSON.parse(meta.contents).name || null,
          en: JSON.parse(meta.contents).name || null,
        };
      default:
        // try get name by 1155 spec
        if (meta && meta.contents) {
          const metaContent = JSON.parse(meta.contents);
          let zh = metaContent.name || null;
          try {
            if (
              metaContent &&
              metaContent.localization &&
              metaContent.localization.uri
            ) {
              const zhUri = metaContent.localization.uri.replace(
                '{locale}',
                'zh-cn',
              );
              const res = await fetch(
                `https://api.allorigins.win/get?url=${encodeURIComponent(
                  zhUri,
                )}`,
              );
              const resJson = await res.json();
              zh = JSON.parse(resJson.contents).name || null;
            }
          } catch (e) {
            console.error(e);
          }
          return {
            zh,
            en: metaContent.name || null,
          };
        }
        return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export type NFTInfoType = {
  imageMinHeight: number;
  imageUri: string;
  imageName: any;
} | null;

const queryNFTImageInfo = async ({
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
}): Promise<NFTInfoType> => {
  const cachedNFTObj = getNFTCacheInfo({ address, tokenId });
  if (cachedNFTObj) {
    return {
      imageMinHeight: minHeight,
      imageUri: cachedNFTObj.imageUri,
      imageName: cachedNFTObj.imageName || '',
    };
  }

  try {
    const contract = await cfx.Contract({
      abi,
      address,
    });

    const res = await contract[method](tokenId);

    if (res) {
      if (needFetchJson) {
        // TODO replace cross origins service
        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            jsonUriFormatter
              ? jsonUriFormatter(res)
              : res.indexOf('{id}') > -1
              ? res.replace('{id}', Number(tokenId).toString(16))
              : res,
          )}`,
        );
        const data = await response.json();

        // get Name
        let imageNameObj = '';
        try {
          const nameObj = await getNFTName({
            address,
            tokenId,
            meta: data,
          });
          imageNameObj = nameObj;
        } catch (e) {
          console.error(e);
        }
        setNFTCacheInfo({
          address,
          tokenId,
          imageUri: imageUriFormatter
            ? imageUriFormatter(data)
            : JSON.parse(data.contents).image,
          imageName: imageNameObj,
        });

        return {
          imageMinHeight: minHeight,
          imageUri: imageUriFormatter
            ? imageUriFormatter(data)
            : JSON.parse(data.contents).image,
          imageName: imageNameObj || '',
        };
      } else {
        // get Name
        let imageNameObj = '';
        try {
          const nameObj = await getNFTName({ address, tokenId, meta: res });

          imageNameObj = nameObj;
        } catch (err) {
          console.error(err);
        }

        setNFTCacheInfo({
          address,
          tokenId,
          imageUri: imageUriFormatter ? imageUriFormatter(res) : res,
          imageName: imageNameObj,
        });

        return {
          imageMinHeight: minHeight,
          imageUri: imageUriFormatter ? imageUriFormatter(res) : res,
          imageName: imageNameObj || '',
        };
      }
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getNFTInfo = async ({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string | number;
}): Promise<NFTInfoType> => {
  const address = formatAddress(contractAddress) as string;
  switch (address) {
    case NFTContracts.confi:
      return await queryNFTImageInfo({
        address,
        tokenId,
        method: 'uris',
        needFetchJson: false,
        imageUriFormatter: res =>
          'http://cdn.tspace.online/image/finish/' + JSON.parse(res).url,
      });

    case NFTContracts.confiCard:
      return await queryNFTImageInfo({
        address,
        tokenId,
        minHeight: 328,
      });

    case NFTContracts.conDragon:
      return await queryNFTImageInfo({
        address: address,
        tokenId,
      });

    case NFTContracts.confluxGuardian:
      return {
        imageMinHeight: 200,
        imageUri: 'https://cdn.image.htlm8.top/guardian/nft.png',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.ancientChineseGod:
    case NFTContracts.ancientChineseGodGenesis:
      return await queryNFTImageInfo({
        address,
        tokenId,
        minHeight: 377,
        // jsonUriFormatter: res =>
        //   res.replace('{id}', Number(tokenId).toString(16)),
      });

    case NFTContracts.moonswapGenesis:
      return await queryNFTImageInfo({
        address: address,
        tokenId,
        minHeight: 150,
      });

    case NFTContracts.conHero:
      return await queryNFTImageInfo({
        address: address,
        tokenId,
        minHeight: 267,
      });

    case NFTContracts.conDragonStone:
      return {
        imageMinHeight: 200,
        imageUri: 'https://cdn.image.htlm8.top/dragon-stone/dragon-stone.png',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.satoshiGift:
      return {
        imageMinHeight: 282,
        imageUri: 'https://cdn.image.htlm8.top/pizza-day/nft.png',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.shanhaijing:
      return await queryNFTImageInfo({
        address: address,
        tokenId,
        minHeight: 267,
      });

    case NFTContracts.shanhaichingSeriesCard:
      return {
        imageMinHeight: 267,
        imageUri: 'https://metadata.boxnft.io/nftbox.gif',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.shuttleflowBscNft:
      return {
        imageMinHeight: 200,
        imageUri: 'https://cdn.image.htlm8.top/bsc-shuttleflow-nft/nft.png',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.crossChainNftGloryEdition:
      return {
        imageMinHeight: 200,
        imageUri: 'https://cdn.image.htlm8.top/flux-shuttleflow-nft/nft.jpg',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.happyBirthdayToConfi:
      return {
        imageMinHeight: 50,
        imageUri: 'https://cdn.image.htlm8.top/confi-birthday-nft/nft.png',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.TREAGenesisFeitian:
      return await queryNFTImageInfo({
        address: address,
        tokenId,
        method: 'uris',
        minHeight: 200,
        needFetchJson: false,
        imageUriFormatter: res => JSON.parse(res).image,
      });

    case NFTContracts.OKExNft:
      return {
        imageMinHeight: 200,
        imageUri:
          'https://cdn.image.htlm8.top/okex-listing-nft/okex-listing-nft.gif',
        imageName: await getNFTName({ address }),
      };

    // case NFTContracts.minerNft:
    //   return null;

    case NFTContracts.honorOfPractitioner:
      return {
        imageMinHeight: 288,
        imageUri: 'https://cdn.image.htlm8.top/practitioner/nft.png',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.confiOfSchrodinger:
      return {
        imageMinHeight: 150,
        imageUri: 'https://cj.yzbbanban.com/purplerr.jpeg',
        imageName: await getNFTName({ address }),
      };

    case NFTContracts.threeKingdoms:
      return await queryNFTImageInfo({
        address: address,
        tokenId,
        minHeight: 286,
      });

    default:
      // try get image and name by 1155 spec
      return await queryNFTImageInfo({
        address: address,
        tokenId,
      });
  }
};
