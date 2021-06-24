import scanUtilAbi from './scanUtilAbi';
import { cfx } from '../../../utils/cfx';
import { NFTContractAddresses } from '../../components/NFTPreview/NFTInfo';

export const scanUtilContractAddress =
  'cfx:acef1ym9m16fc94x29h0800k0ugnaj91sjjbm60hfh';

const contract = cfx.Contract({
  abi: scanUtilAbi,
  address: scanUtilContractAddress,
});

export const getNFTBalances = async (ownerAddress: string) => {
  try {
    const balances = await contract['getBalances(address,address[])'](
      ownerAddress,
      NFTContractAddresses,
    );

    return balances;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getNFTTokens = async (
  tokenAddress: string | undefined,
  ownerAddress: string,
  offset: number,
  limit: number,
) => {
  try {
    if (!tokenAddress) return null;

    const tokens = await contract['getTokens(address,address,uint256,uint256)'](
      tokenAddress,
      ownerAddress,
      offset,
      limit,
    );

    return tokens;
  } catch (e) {
    console.error(e);
    return null;
  }
};
