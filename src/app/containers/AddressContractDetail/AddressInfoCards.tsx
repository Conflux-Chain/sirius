import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DetailPageCard } from './DetailPageCard';
import { InfoImage } from './InfoImage';
import { useAccount } from 'utils/api';
import { TokenBalanceSelect } from './TokenBalanceSelect';
import { Text } from '../../components/Text/Loadable';
import { getUnitByCfxNum } from '../../../utils';
import { Tooltip } from '../../components/Tooltip/Loadable';
export function BalanceCard({ address }) {
  const { t } = useTranslation();
  const { data: accountInfo } = useAccount(address);
  return (
    <DetailPageCard
      title={
        <Tooltip text={t(translations.toolTip.address.balance)} placement="top">
          {t(translations.general.balance)}
        </Tooltip>
      }
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
          alt={t(translations.general.balance)}
          icon="/contract-address/balance.svg"
        />
      }
    />
  );
}

export function TokensCard({ address }) {
  const { t } = useTranslation();

  return (
    <DetailPageCard
      title={
        <Tooltip text={t(translations.toolTip.address.token)} placement="top">
          {t(translations.general.token)}
        </Tooltip>
      }
      content={<TokenBalanceSelect address={address} />}
      icon={
        <InfoImage
          color="#16DBCC"
          alt={t(translations.general.token)}
          icon="/contract-address/token.svg"
        />
      }
    />
  );
}

export function StorageStakingCard({ address }) {
  const { t } = useTranslation();
  const { data: accountInfo } = useAccount(address);
  return (
    <DetailPageCard
      title={
        <Tooltip
          text={t(translations.toolTip.address.storageCollateral)}
          placement="top"
        >
          {t(translations.general.storageStaking)}
        </Tooltip>
      }
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
          alt={t(translations.general.storageStaking)}
          icon="/contract-address/storage.svg"
        />
      }
    />
  );
}

export function NonceCard({ address }) {
  const { t } = useTranslation();
  const { data: accountInfo } = useAccount(address);

  return (
    <DetailPageCard
      title={
        <Tooltip text={t(translations.toolTip.address.nonce)} placement="top">
          {t(translations.general.nonce)}
        </Tooltip>
      }
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
          alt={t(translations.general.nonce)}
          icon="/contract-address/nonce.svg"
        />
      }
    />
  );
}
