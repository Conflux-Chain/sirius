import { useEffect } from 'react';
import { useGlobalENS } from 'utils/hooks/useGlobal';
import { reqENSInfo } from 'utils/httpRequest';
import { formatAddress } from '../index';

interface props {
  address: string[];
  config?: {
    abortable?: boolean;
    immediately?: boolean;
  };
}

export const useENS = ({
  address = [],
  config = {
    abortable: false,
    immediately: false,
  },
}: props) => {
  const fAddress = address.map(a => a && formatAddress(a));
  const [ens = {}, setENS] = useGlobalENS();

  useEffect(() => {
    let controller = new AbortController();

    reqENSInfo(fAddress, {
      signal: controller.signal,
      immediately: config.immediately,
    })
      .then(data => {
        // @ts-ignore
        if (data.length) {
          setENS(pENS => {
            return {
              ...pENS,
              // @ts-ignore
              ...data.reduce((prev, curr) => {
                prev[curr.address] = curr;
                return prev;
              }, {}),
            };
          });
        }
      })
      .catch(e => console.log('useENS query error: ', e));

    return () => {
      config.abortable && controller.abort();
    };
  }, [fAddress, config.abortable, config.immediately, setENS]);

  const list = fAddress.map(
    a =>
      ens[a] || {
        address: a,
        name: '',
        expired: 0,
      },
  );

  const map = list.reduce((prev, curr) => {
    prev[curr.address] = curr;
    return prev;
  }, {});

  return [map, list, setENS];
};
