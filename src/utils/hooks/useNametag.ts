import { useEffect, useState } from 'react';
import { reqNametag } from 'utils/httpRequest';

export interface Nametag {
  caution: 0 | 1;
  desc: string;
  labels: string[];
  nameTag: string;
  website: string;
}

export const useNametag = (address: string[]) => {
  const [nametag, setNametag] = useState<{
    [key: string]: Nametag;
  }>({});

  const dep = JSON.stringify(address);

  useEffect(() => {
    const fetchNametag = async () => {
      const addr = address.filter(a => !!a);
      if (addr.length) {
        const data = await reqNametag(addr);
        setNametag(data.map);
      }
    };

    fetchNametag().catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);

  return nametag;
};
