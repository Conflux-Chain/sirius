/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name ContractMetadata.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */
import React from 'react';
import clsx from 'clsx';
import styled from 'styled-components';
import { List } from '@cfxjs/sirius-next-common/dist/components/List';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useToken } from 'utils/api';
import { IconButton } from './IconButton';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { isZeroAddress, formatString } from 'utils';
import { ICON_DEFAULT_TOKEN, ICON_DEFAULT_CONTRACT } from 'utils/constants';
import Edit3 from '@zeit-ui/react-icons/edit3';
import { Image } from '@cfxjs/sirius-next-common/dist/components/Image';
import { IS_CORESPACE, IS_MAINNET, IS_TESTNET } from 'env';

const WarningButton = ({ address }) => {
  const { t, i18n } = useTranslation();

  return (
    <WarningButtonWrapper>
      <IconButton
        className="metadata-tooltip-btn"
        size={16}
        viewBox={!isZeroAddress(address) ? '0 0 1024 1024' : '0 0 16 16'}
        tooltipText={
          <WarningTooltipWrapper>
            <p className="warning-text">
              {t(translations.contractDetail.contractAdminWarning)}
              <br />
              <Link
                target="_blank"
                className="warning-tooltip-link"
                href={
                  i18n.language?.startsWith('zh')
                    ? 'https://juejin.im/post/6876330619798814728'
                    : 'https://github.com/Conflux-Chain/conflux-rust/tree/master/internal_contract#admincontrol-contract'
                }
              >
                {t(translations.general.viewMore)}
              </Link>
            </p>
          </WarningTooltipWrapper>
        }
      >
        {!isZeroAddress(address) ? (
          <path
            d="M501.28 4.16a501.248 501.248 0 1 0 0 1002.56 501.248 501.248 0 0 0 0-1002.56z m42.24 668.8c0 23.36-19.2 42.24-42.24 42.24-23.04 0-42.24-19.136-42.24-42.24 0-23.04 19.2-42.24 42.24-42.24 23.04 0 42.24 19.2 42.24 42.24z m0-176.576a41.856 41.856 0 0 1-42.24 41.408 41.856 41.856 0 0 1-42.24-41.408V284.16c0-22.848 19.2-41.408 42.24-41.408 23.04 0 42.24 18.56 42.24 41.408v212.288z"
            fill="#FFB84B"
            p-id={950}
          />
        ) : (
          <g
            id="Internal-Contract"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Icon-Up：16px-18px"
              transform="translate(-992.000000, -319.000000)"
            >
              <g id="Success@2x" transform="translate(992.000000, 319.000000)">
                <path
                  d="M8,16 C12.4182667,16 16,12.4182667 16,8 C16,3.58172 12.4182667,0 8,0 C3.58172,0 0,3.58172 0,8 C0,12.4182667 3.58172,16 8,16 Z"
                  id="safety"
                  fill="#7CD77B"
                ></path>
                <polyline
                  id="safety"
                  stroke="#FFFFFF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="4.66666667 7.88073333 7.21846667 10.4848667 11.1060667 5.33333333"
                ></polyline>
              </g>
            </g>
          </g>
        )}
      </IconButton>
    </WarningButtonWrapper>
  );
};

const WarningButtonWrapper = styled.div`
  .icon.metadata-tooltip-btn {
    margin-left: 1rem;
  }
`;
const WarningTooltipWrapper = styled.div`
  p.warning-text {
    margin: 0;
  }
  .warning-tooltip-link.link,
  .warning-tooltip-link.link:hover {
    color: #008dff;
  }
`;

export function ContractMetadata({ address, contractInfo }) {
  const { t } = useTranslation();
  const notAvailableText = t(translations.general.security.notAvailable);
  const { data: tokenInfo } = useToken(address, ['name', 'iconUrl']);
  const loading = contractInfo.name === t(translations.general.loading);
  const skeletonStyle = { height: '1.5714rem' };
  const isNotDeployed = [1, 2, 3].includes(contractInfo.destroy?.status);

  const isToken = ['20', '721', '1155', '3525'].includes(
    /\d+/.exec(tokenInfo.tokenType || tokenInfo.transferType)?.[0] || '', // compatible with open api
  );

  let tokenName: React.ReactNode = tokenInfo.name
    ? formatString(
        `${tokenInfo.name || notAvailableText} (${
          tokenInfo.symbol || notAvailableText
        })`,
        'tokenTracker',
      )
    : notAvailableText;

  if (tokenInfo.name && isToken) {
    tokenName = <Link href={`/token/${address}`}>{tokenName}</Link>;
  }

  let list = [
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.nameTag)}>
          {t(translations.contract.nameTag)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Image
              width={24} // width: 16px + paddingRight: 8px = 24px
              style={{
                paddingRight: '8px',
              }}
              src={tokenInfo?.iconUrl || ''}
              preview={false}
              fallback={ICON_DEFAULT_CONTRACT}
              alt={contractInfo.name + 'logo'}
            />
            <Content>{contractInfo.name || notAvailableText}</Content>
            <Link
              className="contract-info-update"
              href={`/contract-info/${address}`}
            >
              <Edit3 size={18} color="#1e3de4" />
            </Link>
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.contractAdmin)}>
          {t(translations.contract.contractAdmin)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Content>
              {contractInfo.admin ? (
                <CoreAddressContainer value={contractInfo.admin} />
              ) : (
                notAvailableText
              )}
            </Content>
            <WarningButton key="warning" address={contractInfo.admin} />
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.tokenTracker)}>
          {t(translations.contract.tokenTracker)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Image
              width={24} // width: 16px + paddingRight: 8px = 24px
              style={{
                paddingRight: '8px',
              }}
              src={tokenInfo?.iconUrl || ''}
              preview={false}
              fallback={ICON_DEFAULT_TOKEN}
              alt={tokenInfo?.name + 'logo'}
            />

            <Content className={clsx(!tokenInfo.name && 'not-available')}>
              {tokenName}
            </Content>
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.storageSponsor)}>
          {t(translations.contract.storageSponsor)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Content
              className={clsx(
                !contractInfo.sponsor.sponsorForCollateral && 'not-available',
              )}
            >
              {contractInfo.sponsor &&
              contractInfo.sponsor.sponsorForCollateral ? (
                [
                  <CoreAddressContainer
                    key={contractInfo.sponsor.sponsorForCollateral}
                    value={contractInfo.sponsor.sponsorForCollateral}
                    alias={
                      contractInfo.sponsor.sponsorForCollateralContractInfo &&
                      contractInfo.sponsor.sponsorForCollateralContractInfo.name
                        ? contractInfo.sponsor.sponsorForCollateralContractInfo
                            .name
                        : null
                    }
                  />,
                ]
              ) : (
                <CenterLine>{notAvailableText}</CenterLine>
              )}
            </Content>
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.contractCreator)}>
          {t(translations.contract.creator)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            {isNotDeployed ? (
              <Content className="not-available">
                <Text type="error">
                  {t(translations.contract.thisContract)}
                  {t(
                    translations.contract.status[contractInfo.destroy?.status],
                  )}
                </Text>
              </Content>
            ) : (
              <Content
                className={clsx(
                  !contractInfo.from && 'not-available',
                  !contractInfo.transactionHash && 'not-available',
                )}
              >
                {contractInfo.from ? (
                  <CoreAddressContainer value={contractInfo.from} />
                ) : (
                  notAvailableText
                )}
                {contractInfo.transactionHash ? (
                  <>
                    {` ${t(translations.contractDetail.at)} ${t(
                      translations.contractDetail.txOnlyEn,
                    )} `}
                    <LinkWrap
                      href={`/transaction/${contractInfo.transactionHash}`}
                    >
                      <Text
                        tag="span"
                        hoverValue={contractInfo.transactionHash}
                      >
                        {formatString(contractInfo.transactionHash, 'address')}
                      </Text>
                    </LinkWrap>
                    {` ${t(translations.contractDetail.txOnlyZh)} `}
                  </>
                ) : null}
              </Content>
            )}
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.gasFeeSponsor)}>
          {t(translations.contract.gasSponsor)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Content>
              {contractInfo.sponsor && contractInfo.sponsor.sponsorForGas ? (
                [
                  <CoreAddressContainer
                    key={contractInfo.sponsor.sponsorForGas}
                    value={contractInfo.sponsor.sponsorForGas}
                    alias={
                      contractInfo.sponsor.sponsorForGasContractInfo &&
                      contractInfo.sponsor.sponsorForGasContractInfo.name
                        ? contractInfo.sponsor.sponsorForGasContractInfo.name
                        : null
                    }
                  />,
                ]
              ) : (
                <CenterLine>{notAvailableText}</CenterLine>
              )}
            </Content>
          </CenterLine>
        </SkeletonContainer>
      ),
    },
  ];

  if (!(IS_CORESPACE && (IS_MAINNET || IS_TESTNET))) {
    list = list.filter((_, index) => [0, 1, 2, 4].includes(index));
  }

  return <List list={list} />;
}

const CenterLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  .metadata-tooltip-btn {
    margin-left: 0.5rem;
    margin-bottom: 0.2857rem;
    ${media.s} {
      margin-left: 1rem;
    }
  }

  .contract-info-update {
    position: absolute;
    right: 0;
  }
`;

const Content = styled.span`
  &.not-available.link {
    color: #97a3b4;
  }
`;

const LinkWrap = styled(Link)`
  color: #1e3de4 !important;
  &:hover {
    color: #0f23bd !important;
  }
`;
