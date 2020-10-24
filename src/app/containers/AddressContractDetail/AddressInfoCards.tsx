import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DetailPageCard } from './DetailPageCard';
import { InfoImage } from './InfoImage';
import { useAccount } from 'utils/api';
import { TokenBalanceSelect } from './TokenBalanceSelect';
import { Text } from '../../components/Text/Loadable';
import { getUnitByCfxNum } from '../../../utils';
export function BalanceCard({ address }) {
  const { t } = useTranslation();
  const title = t(translations.general.balance);
  const { data: accountInfo } = useAccount(address);
  return (
    <DetailPageCard
      title={title}
      content={
        accountInfo ? (
          <Text
            hoverValue={`${getUnitByCfxNum(accountInfo.balance, true).num} ${
              getUnitByCfxNum(accountInfo.balance, true).unit
            }`}
          >
            {getUnitByCfxNum(accountInfo.balance).num}
          </Text>
        ) : (
          ''
        )
      }
      icon={
        <InfoImage
          color="#0054FE"
          alt={title}
          icon="/contract-address/balance.svg"
        />
      }
    />
  );
}

export function TokensCard({ address }) {
  const { t } = useTranslation();
  const title = t(translations.general.token);

  return (
    <DetailPageCard
      title={title}
      content={<TokenBalanceSelect address={address} />}
      icon={
        <InfoImage
          color="#16DBCC"
          alt={title}
          icon="/contract-address/token.svg"
        />
      }
    />
  );
}

export function StorageStakingCard({ address }) {
  const { t } = useTranslation();
  const { data: accountInfo } = useAccount(address);
  const title = t(translations.general.storageStaking);
  return (
    <DetailPageCard
      title={title}
      content={
        accountInfo?.collateralForStorage ? (
          <Text
            hoverValue={`${
              getUnitByCfxNum(accountInfo.collateralForStorage, true).num
            } ${getUnitByCfxNum(accountInfo.collateralForStorage).unit}`}
          >
            {getUnitByCfxNum(accountInfo.collateralForStorage).num}
          </Text>
        ) : (
          ''
        )
      }
      icon={
        <InfoImage
          color="#FFBB37"
          alt={title}
          icon="/contract-address/storage.svg"
        />
      }
    />
  );
}

export function NonceCard({ address }) {
  const { t } = useTranslation();
  const { data: accountInfo } = useAccount(address);
  const title = t(translations.general.nonce);

  return (
    <DetailPageCard
      title={title}
      content={
        accountInfo ? (
          <Text hoverValue={accountInfo.transactionCount}>
            {accountInfo.transactionCount}
          </Text>
        ) : (
          ''
        )
      }
      icon={
        <InfoImage
          color="#FF82AC"
          alt={title}
          icon="/contract-address/nonce.svg"
        />
      }
    />
  );
}
