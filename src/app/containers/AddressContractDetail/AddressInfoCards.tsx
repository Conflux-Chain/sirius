import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@cfxjs/sirius-next-common/dist/utils/media';
import { translations } from 'locales/i18n';
import { DetailPageCard } from './DetailPageCard';
import { InfoImage } from './InfoImage';
import { TokenBalanceSelect } from './TokenBalanceSelect';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { formatNumber, processSponsorStorage } from 'utils';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import imgBalance from 'images/contract-address/balance.svg';
import imgToken from 'images/contract-address/token.svg';
import imgStorage from 'images/contract-address/storage.svg';
import imgNonce from 'images/contract-address/nonce.svg';
import SponsorStorage from 'app/components/SponsorStorage/Loadable';
import BigNumber from 'bignumber.js';
import { fromDripToCfx } from '@cfxjs/sirius-next-common/dist/utils';

// todo, need to refactor the request, and rewrite skeleton style
const skeletonStyle = { width: '7rem', height: '2.4rem' };

export function BalanceCard({ accountInfo }) {
  const { t } = useTranslation();
  // const { data: accountInfo } = useAccount(address);
  const loading = accountInfo.balance === t(translations.general.loading);

  return (
    <DetailPageCard
      title={
        <Tooltip title={t(translations.toolTip.address.balance)}>
          {t(translations.general.balance)}
        </Tooltip>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <Text hoverValue={`${fromDripToCfx(accountInfo.balance, true)} CFX`}>
            {fromDripToCfx(accountInfo.balance)}
          </Text>
        </SkeletonContainer>
      }
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
        >
          <rect opacity="0.08" width="60" height="60" rx="6" fill="#60BBF9" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21.8334 23H39.1667C39.6278 23 40 23.3677 40 23.8234V26.9444H35.7078C34.0267 26.9444 32.6656 28.2889 32.6656 29.9444C32.6656 31.5989 34.0267 32.9422 35.7078 32.9422H39.9978V36.0644C39.9978 36.5189 39.6256 36.8866 39.1656 36.8866H21.8334C21.3722 36.8866 21 36.5189 21 36.0644V23.8222C21 23.3678 21.3722 23 21.8334 23ZM35.71 31.71C34.7178 31.71 33.9178 30.9189 33.9178 29.9433C33.9178 28.9667 34.7189 28.1767 35.71 28.1767C36.7011 28.1767 37.5022 28.9667 37.5022 29.9433C37.5022 30.9189 36.6989 31.71 35.71 31.71Z"
            fill="#60BBF9"
          />
        </svg>
      }
    />
  );
}

export function TokensCard({ address }) {
  const { t } = useTranslation();

  return (
    <DetailPageCard
      title={
        <Tooltip title={t(translations.toolTip.address.token)}>
          {t(translations.general.token)}
        </Tooltip>
      }
      content={<TokenBalanceSelect address={address} />}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
        >
          <rect opacity="0.1" width="60" height="60" rx="6" fill="#B69FF8" />
          <path
            d="M21 26.1818C21 27.9636 25.0091 29.3636 30 29.3636C34.9909 29.3636 39 27.9 39 26.1818C39 24.4 34.9909 23 30 23C25.0091 23 21 24.4636 21 26.1818Z"
            fill="#B69FF8"
          />
          <path
            d="M30 30.8274C26.1545 30.8274 22.9636 30.0001 21.5727 28.791C21.1636 29.2365 21 29.5547 21 29.9365C21 31.6547 25.0091 33.1183 30 33.1183C34.9909 33.1183 39 31.7183 39 29.9365C39 29.491 38.7546 29.1728 38.4273 28.791C37.0364 29.9365 33.8455 30.8274 30 30.8274H30Z"
            fill="#B69FF8"
          />
          <path
            d="M21.5727 32.6091C21.1636 32.9273 21 33.3728 21 33.7546C21 35.4728 25.0091 36.9364 30 36.9364C34.9909 36.9364 39 35.5364 39 33.7546C39 33.3091 38.7546 32.9909 38.4273 32.6091C37.0364 33.7546 33.8455 34.6455 30 34.6455C26.0727 34.6455 22.9636 33.8182 21.5727 32.6091H21.5727Z"
            fill="#B69FF8"
          />
        </svg>
      }
    />
  );
}

export function StorageStakingCard({ accountInfo }) {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const loading = accountInfo.balance === t(translations.general.loading);

  const { storageQuota, storageUsed } =
    accountInfo.collateralForStorageInfo || {};
  const total = useMemo(
    () =>
      processSponsorStorage(
        storageUsed?.storagePoint,
        new BigNumber(storageUsed?.storageCollateral || 0).div(1e18).toString(),
      ).total,
    [storageUsed],
  );

  return (
    <DetailPageCard
      title={
        <Text
          hoverValue={t(translations.toolTip.address.storageCollateral)}
          maxCount={bp === 's' ? 10 : undefined}
        >
          {t(translations.general.storageStaking)}
        </Text>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <SponsorStorage
            storageUsed={{
              point: storageUsed?.storagePoint,
              collateral: new BigNumber(storageUsed?.storageCollateral || 0)
                .div(1e18)
                .toString(),
            }}
            storageQuota={
              accountInfo.sourceCode !== undefined
                ? {
                    point: storageQuota?.storagePoint,
                    collateral: new BigNumber(
                      storageQuota?.storageCollateral || 0,
                    )
                      .div(1e18)
                      .toString(),
                  }
                : null
            }
          >
            <span className="used">
              {formatNumber(total, {
                withUnit: false,
              })}{' '}
              KB
            </span>
          </SponsorStorage>
        </SkeletonContainer>
      }
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
        >
          <rect opacity="0.08" width="60" height="60" rx="6" fill="#FE8D59" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M38.8964 24.4826L35.7974 23.1995L26.0469 27.4719V30.2144L24.3462 29.5094V26.7668L34.0968 22.4945L30.8163 21.1338C30.3045 20.9554 29.7408 20.9554 29.229 21.1338L21.164 24.4826C20.4821 24.8038 20.0376 25.4418 20 26.1535V33.9933C20.0454 34.7163 20.5087 35.3591 21.2094 35.6712L29.2517 38.879C29.7408 39.0403 30.2743 39.0403 30.7634 38.879L38.8057 35.6712C39.4995 35.3541 39.956 34.7127 40 33.9933V26.1535C39.9745 25.4538 39.555 24.8186 38.8964 24.4826ZM34.4297 31.0089V30.1206C34.425 29.6288 34.7172 29.1763 35.1856 28.9503C35.6089 28.7952 35.9566 29.0631 35.9415 29.5566V30.452L34.4297 31.0089ZM34.9887 33.2509C34.7619 33.2368 34.6032 33.0535 34.6032 32.7574C34.5878 32.3737 34.8158 32.0174 35.1852 31.8479C35.5027 31.7351 35.7596 31.9396 35.7596 32.3132C35.7527 32.6085 35.6128 32.8875 35.3742 33.0817V34.0335L34.9887 34.1674V33.2509ZM37.1202 34.7526C37.3584 34.6416 37.5101 34.4157 37.5132 34.1674L37.5132 30.3392C37.5132 30.0924 37.3318 29.9514 37.1202 30.0289L36.5382 30.2405V29.3451C36.5382 28.485 35.941 28.0056 35.1852 28.2805C34.3578 28.674 33.8356 29.4659 33.8322 30.3321V31.2204L33.2578 31.4319C33.0254 31.5431 32.8794 31.7664 32.8798 32.0101V35.796C32.8798 36.0428 33.0537 36.1838 33.2578 36.1062L37.1202 34.7526Z"
            fill="#FE8D59"
          />
        </svg>
      }
    />
  );
}

export function NonceCard({ accountInfo }) {
  const { t } = useTranslation();
  // const { data: accountInfo } = useAccount(address);
  const loading = accountInfo.balance === t(translations.general.loading);

  return (
    <DetailPageCard
      title={
        <Tooltip title={t(translations.toolTip.address.nonce)}>
          {t(translations.general.nonce)}
        </Tooltip>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <Text hoverValue={accountInfo.nonce}>{accountInfo.nonce}</Text>
        </SkeletonContainer>
      }
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
        >
          <rect opacity="0.1" width="60" height="60" rx="6" fill="#E06C75" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M26.871 25.0645C26.871 25.5806 26.4516 26 25.9355 26C25.4194 26 25 25.5806 25 25.0645V21.9355C25 21.4194 25.4194 21 25.9355 21C26.4516 21 26.871 21.4194 26.871 21.9355V25.0645ZM35 25.0645C35 25.5806 34.5806 26 34.0645 26C33.5484 26 33.129 25.5806 33.129 25.0645V21.9355C33.129 21.4194 33.5484 21 34.0645 21C34.5806 21 35 21.4194 35 21.9355V25.0645Z"
            fill="#E06C75"
          />
          <path
            d="M24.4512 23.4839C24.419 23.6127 24.4189 23.7095 24.4189 23.8062V25.0649C24.4192 25.9035 25.0969 26.6128 25.9678 26.6128C26.8063 26.6128 27.5164 25.9357 27.5166 25.0649V23.8062C27.5166 23.6773 27.5156 23.5806 27.4834 23.4839H32.5488C32.5166 23.6128 32.5166 23.7095 32.5166 23.8062V25.0972C32.5168 25.9357 33.1937 26.645 34.0645 26.645C34.903 26.645 35.6131 25.968 35.6133 25.0972V23.8384C35.6133 23.7096 35.6133 23.6128 35.5811 23.5161H38.7422C39.4517 23.5162 39.9999 24.0645 40 24.7417V37.7417C40 38.4513 39.4195 39.0004 38.7422 39.0005H21.2578C20.5483 39.0004 20 38.4513 20 37.7417V24.7417C20.0001 24.0645 20.5483 23.5163 21.2578 23.4839H24.4512ZM24 29.0005V35.0005H25.7139V29.0005H24ZM29.0283 29.0005C28.4374 29.0006 27.9375 29.1982 27.5283 29.604C27.1194 30.0097 26.9142 30.4921 26.9141 31.0513C26.9142 31.7859 27.2554 32.3679 27.9258 32.7847L28.6992 31.4468C28.5971 31.3482 28.5402 31.2381 28.54 31.1177C28.54 31.0082 28.574 30.92 28.6533 30.8433C28.7329 30.7665 28.8242 30.7339 28.9492 30.7339C29.2334 30.7339 29.3701 30.8436 29.3701 31.063C29.3699 31.1725 29.324 31.315 29.2334 31.479L27.2783 35.0005H31.2002V33.3003H30.1885L30.9043 31.9507C31.0519 31.6767 31.1318 31.3691 31.1318 31.0513C31.1317 30.5031 30.9269 30.0204 30.5293 29.6147C30.1314 29.2089 29.6308 29.0005 29.0283 29.0005ZM32.4248 29.0005V30.7056H33.1318L32.6641 31.8677C33.0356 31.8677 33.335 31.9455 33.5508 32.0894C33.7783 32.2442 33.8866 32.4321 33.8867 32.6753C33.8866 32.8963 33.815 33.0741 33.6953 33.1958C33.5635 33.3174 33.3954 33.3735 33.168 33.3735C32.9402 33.3735 32.6761 33.3175 32.4004 33.1958V34.8569C32.76 34.9565 33.1078 35.0005 33.4434 35.0005C34.1505 35.0005 34.7264 34.8237 35.1699 34.4585C35.6132 34.1044 35.8289 33.6168 35.8291 33.0415C35.8291 32.6542 35.7331 32.3211 35.5654 32.0444C35.3976 31.7678 35.1212 31.5132 34.7617 31.2808L35.8047 29.0005H32.4248Z"
            fill="#E06C75"
          />
        </svg>
      }
    />
  );
}
