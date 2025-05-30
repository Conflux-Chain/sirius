import { CFX, ENS_COINID_CONFLUX, NETWORK_ID } from 'utils/constants';
import CNSPublicResolverABI from '../contract/CNSPublicResolver.json';
import CNSRegistryABI from '../contract/CNSRegistry.json';
import { hash } from '@ensdomains/eth-ens-namehash';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { isZeroAddress } from 'utils';
import LogoENS from 'images/logo-cns.svg';
import ENV_CONFIG, { IS_ENS_ENABLED } from 'env';

const registry = CFX.Contract({
  address: ENV_CONFIG.ENV_ENS_REGISTRY_ADDRESS,
  abi: CNSRegistryABI,
});

const publicResolver = CFX.Contract({
  address: ENV_CONFIG.ENV_ENS_PUBLIC_RESOLVER_ADDRESS,
  abi: CNSPublicResolverABI,
});

// const reverseRegistry = CFX.Contract({
//   address: ENS_REVERSE_REGISTRAR_ADDRESS,
//   abi: CNSReverseRegistrarABI,
// });

function getResoverContract(address) {
  try {
    if (isZeroAddress(address)) {
      return publicResolver;
    } else {
      return CFX.Contract({
        abi: CNSPublicResolverABI,
        address: address,
      });
    }
  } catch (error) {
    console.log('getResoverContract error: ', error);
  }
}

export async function getAddress(name) {
  try {
    const nh = hash(name);
    const resolverAddr = await registry.resolver(nh);
    const resolverContract = getResoverContract(resolverAddr);
    const addr = await resolverContract.addr(nh, ENS_COINID_CONFLUX);

    return SDK.address.encodeCfxAddress(addr, NETWORK_ID);
  } catch (error) {
    console.log('getAddress error: ', error);
    return '';
  }
}

export function isValidENS(name: string) {
  return IS_ENS_ENABLED && /.*(\.web3|\.dao)$/i.test(name);
}

export { LogoENS };
