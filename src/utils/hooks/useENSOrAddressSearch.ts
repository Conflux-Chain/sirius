import React, { useState, useMemo, useEffect } from 'react';
import { isCurrentNetworkAddress, isZeroAddress } from 'utils';
import CNSUtil from '@web3identity/cns-util';
import { NETWORK_ID } from 'utils/constants';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';

export const useENSOrAddressSearch = value => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{
    type: '' | 'cns' | 'address' | 'noResult';
    msg?: string;
    name?: string; // cns
    address?: string;
  }>({
    type: '',
  });

  const cnsutil = useMemo(() => {
    return new CNSUtil({
      networkId: NETWORK_ID,
    });
  }, []);

  const errors = useMemo(() => {
    return {
      cns: t(translations.approval.errors.cns),
      address: t(translations.approval.errors.address),
      invalid: t(translations.approval.errors.invalidText),
    };
  }, [t]);

  useEffect(() => {
    async function main() {
      if (isCurrentNetworkAddress(value)) {
        let address = value;

        setLoading(true);

        const name = await cnsutil.name(address);

        if (name) {
          setData({
            type: 'address',
            address,
            name,
          });
        } else {
          setData({
            type: 'noResult',
            msg: errors.address,
          });
        }
      } else if (value.substr(-5) === '.web3' || value.substr(-4) === '.dao') {
        if (value.split('.').length === 2) {
          let name = value;

          setLoading(true);

          const data = await cnsutil.multicall([
            {
              method: 'address',
              args: [name],
            },
            {
              method: 'status',
              args: [name],
            },
          ]);

          // Valid, TooShort, Reserved, IllegalChar, Locked, Registered, SoldOut
          if (data[1] === 'Registered') {
            setData({
              type: 'cns',
              name,
              address: isZeroAddress(data[0]) ? '' : data[0],
            });
          } else {
            // not registered
            setData({
              type: 'noResult',
              msg: errors.cns,
            });
          }
        } else {
          // at present not support subdomain
          setData({
            type: 'noResult',
            msg: errors.cns,
          });
        }
      } else {
        setData({
          type: 'noResult',
          msg: errors.invalid,
        });
      }

      setLoading(false);
    }

    main().catch(console.log);
  }, [cnsutil, errors.address, errors.cns, errors.invalid, value]);

  return {
    ...data,
    loading,
  };
};
