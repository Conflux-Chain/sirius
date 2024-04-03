import React, { useMemo } from 'react';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { Bookmark } from '@zeit-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { Text } from '../Text/Loadable';
import { getLabelInfo } from '../AddressContainer';
import { useENS } from 'utils/hooks/useENS';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

export const AddressLabel = ({ address }) => {
  const { t } = useTranslation();
  const [globalData = {}] = useGlobalData();
  const [ensMap] = useENS({
    address: [address],
  });

  const addressLabel = globalData[LOCALSTORAGE_KEYS_MAP.addressLabel][address];
  const addressLabelIcon = (
    <Text span hoverValue={t(translations.profile.tip.label)}>
      <Bookmark color="var(--theme-color-gray2)" size={16} />
    </Text>
  );

  const { label, icon } = useMemo(
    () => getLabelInfo(ensMap[address]?.name, 'ens'),
    [address, ensMap],
  );

  return (
    <>
      {label && (
        <>
          {' '}
          ({icon}
          {label})
        </>
      )}
      {addressLabel && (
        <>
          {' '}
          ({addressLabelIcon}
          {addressLabel})
        </>
      )}
    </>
  );
};
