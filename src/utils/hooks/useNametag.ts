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

  useEffect(() => {
    const fetchNametag = async () => {
      const addr = address.filter(a => !!a);
      if (addr.length) {
        const data = await reqNametag(addr);
        setNametag(data.map);
      }
    };

    fetchNametag().catch(console.log);
  }, [address]);

  return nametag;
};
