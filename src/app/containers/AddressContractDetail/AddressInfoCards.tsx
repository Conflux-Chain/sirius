import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DetailPageCard } from './DetailPageCard';
import { InfoImage } from './InfoImage';
import { useAccount } from 'utils/api';
import { TokenBalanceSelect } from './TokenBalanceSelect';
import { Text } from 'app/components/Text/Loadable';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { getUnitByCfxNum } from 'utils';
import { Tooltip } from 'app/components/Tooltip/Loadable';

// todo, need to refactor the request, and rewrite skeleton style
const skeletonStyle = { width: '7rem', height: '2.4rem' };

export function BalanceCard({ address }) {
  const { t } = useTranslation();
  const { data: accountInfo } = useAccount(address);
  const loading = accountInfo.balance === 'loading...';

  return (
    <DetailPageCard
      title={
        <Tooltip text={t(translations.toolTip.address.balance)} placement="top">
          {t(translations.general.balance)}
        </Tooltip>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <Text
            hoverValue={`${getUnitByCfxNum(accountInfo.balance, true).num} ${
              getUnitByCfxNum(accountInfo.balance, true).unit
            }`}
          >
            {getUnitByCfxNum(accountInfo.balance).num}
          </Text>
        </SkeletonContainer>
      }
      icon={
        <InfoImage
          color="#1e3de4"
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
  const loading = accountInfo.balance === 'loading...';

  return (
    <DetailPageCard
      title={
        <Text
          hoverValue={t(translations.toolTip.address.storageCollateral)}
          maxCount={10}
        >
          {t(translations.general.storageStaking)}
        </Text>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <Text
            hoverValue={`${
              getUnitByCfxNum(accountInfo.collateralForStorage, true).num
            } ${getUnitByCfxNum(accountInfo.collateralForStorage).unit}`}
          >
            {getUnitByCfxNum(accountInfo.collateralForStorage).num}
          </Text>
        </SkeletonContainer>
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
  const loading = accountInfo.balance === 'loading...';

  return (
    <DetailPageCard
      title={
        <Tooltip text={t(translations.toolTip.address.nonce)} placement="top">
          {t(translations.general.nonce)}
        </Tooltip>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <Text hoverValue={accountInfo.nonce}>{accountInfo.nonce}</Text>
        </SkeletonContainer>
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
