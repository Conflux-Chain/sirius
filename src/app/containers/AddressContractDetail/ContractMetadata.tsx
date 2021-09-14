/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name ContractMetadata.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */
import React from 'react';
import clsx from 'clsx';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { List } from 'app/components/List/';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useToken } from 'utils/api';
import { IconButton } from './IconButton';
import { media } from 'styles/media';
import { Text } from 'app/components/Text';
import { Link as UILink } from '@cfxjs/react-ui';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { AddressContainer } from 'app/components/AddressContainer';
import { isZeroAddress, formatString } from 'utils';
import {
  ICON_DEFAULT_TOKEN,
  NETWORK_TYPES,
  NETWORK_TYPE,
  ICON_DEFAULT_CONTRACT,
} from 'utils/constants';
import Edit3 from '@zeit-ui/react-icons/edit3';
import { Image } from '@jnoodle/antd';

const Link = ({ to, children }) => <RouterLink to={to}>{children}</RouterLink>;

const WarnningButton = ({ address }) => {
  const { t, i18n } = useTranslation();

  return (
    <WarnningButtonWrapper>
      <IconButton
        className="metadata-tooltip-btn"
        size={16}
        tooltipContentClassName="warnning-tooltip"
        viewBox={!isZeroAddress(address) ? '0 0 1024 1024' : '0 0 16 16'}
        tooltipText={
          <WarnningTooltipWrapper>
            <p className="warnning-text">
              {t(translations.contractDetail.contractAdminWarning)}
              <br />
              <UILink
                target="_blank"
                className="warnning-tooltip-link"
                href={
                  i18n.language?.startsWith('zh')
                    ? 'https://juejin.im/post/6876330619798814728'
                    : 'https://github.com/Conflux-Chain/conflux-rust/tree/master/internal_contract#admincontrol-contract'
                }
              >
                {t(translations.general.viewMore)}
              </UILink>
            </p>
          </WarnningTooltipWrapper>
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
    </WarnningButtonWrapper>
  );
};

const WarnningButtonWrapper = styled.div`
  .warnning-tooltip.tooltip-content {
    max-width: 30rem;
    text-align: center;
    padding: 0.43rem 0.86rem;
    ${media.s} {
      max-width: 15rem;
    }
  }
  .icon.metadata-tooltip-btn {
    margin-left: 1rem;
  }
`;
const WarnningTooltipWrapper = styled.div`
  p.warnning-text {
    margin: 0;
  }
  .warnning-tooltip-link.link {
    color: #008dff;
  }
`;

export function ContractMetadata({ address, contractInfo }) {
  const { t } = useTranslation();
  const notAvailableText = t(translations.general.security.notAvailable);
  const { data: tokenInfo } = useToken(address, ['name', 'iconUrl']);
  const loading = contractInfo.name === t(translations.general.loading);
  const skeletonStyle = { height: '1.5714rem' };

  let list = [
    {
      title: (
        <Tooltip
          text={t(translations.toolTip.contract.nameTag)}
          placement="top"
        >
          {t(translations.contract.nameTag)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Image
              width={24} // width: 16px + padingRight: 8px = 24px
              style={{
                paddingRight: '8px',
              }}
              src={tokenInfo?.iconUrl || ''}
              preview={false}
              fallback={ICON_DEFAULT_CONTRACT}
              alt={contractInfo.name + 'logo'}
            />
            <Content>{contractInfo.name || notAvailableText}</Content>
            <RouterLink
              className="contract-info-update"
              to={`/contract-info/${address}`}
            >
              <Edit3 size={18} color="#1e3de4" />
            </RouterLink>
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip
          text={t(translations.toolTip.contract.contractAdmin)}
          placement="top"
        >
          {t(translations.contract.contractAdmin)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Content>
              {contractInfo.admin ? (
                <AddressContainer
                  value={contractInfo.admin}
                  alias={
                    isZeroAddress(contractInfo.admin)
                      ? t(translations.general.zeroAddress)
                      : undefined
                  }
                />
              ) : (
                notAvailableText
              )}
            </Content>
            <WarnningButton key="warning" address={contractInfo.admin} />
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip
          text={t(translations.toolTip.contract.tokenTracker)}
          placement="top"
        >
          {t(translations.contract.tokenTracker)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Image
              width={24} // width: 16px + padingRight: 8px = 24px
              style={{
                paddingRight: '8px',
              }}
              src={tokenInfo?.iconUrl || ''}
              preview={false}
              fallback={ICON_DEFAULT_TOKEN}
              alt={tokenInfo?.name + 'logo'}
            />

            <Content className={clsx(!tokenInfo.name && 'not-available')}>
              {tokenInfo.name ? (
                <Link to={`/token/${address}`}>
                  {formatString(
                    `${tokenInfo.name || notAvailableText} (${
                      tokenInfo.symbol || notAvailableText
                    })`,
                    'tokenTracker',
                  )}
                </Link>
              ) : (
                notAvailableText
              )}
            </Content>
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip
          text={t(translations.toolTip.contract.storageSponsor)}
          placement="top"
        >
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
                  <AddressContainer
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
        <Tooltip
          text={t(translations.toolTip.contract.contractCreator)}
          placement="top"
        >
          {t(translations.contract.creator)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            {/* TODO use codeHash */}
            {!contractInfo.codeHash ? (
              <Content className="not-available">
                <Text type="error">
                  {t(translations.contractDetail.notDeployed)}
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
                  <AddressContainer value={contractInfo.from} />
                ) : (
                  notAvailableText
                )}
                {contractInfo.transactionHash ? (
                  <>
                    {` ${t(translations.contractDetail.at)} ${t(
                      translations.contractDetail.txOnlyEn,
                    )} `}
                    <LinkWrap
                      to={`/transaction/${contractInfo.transactionHash}`}
                    >
                      <Text span hoverValue={contractInfo.transactionHash}>
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
        <Tooltip
          text={t(translations.toolTip.contract.gasFeeSponsor)}
          placement="top"
        >
          {t(translations.contract.gasSponsor)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Content>
              {contractInfo.sponsor && contractInfo.sponsor.sponsorForGas ? (
                [
                  <AddressContainer
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

  if (![NETWORK_TYPES.mainnet, NETWORK_TYPES.testnet].includes(NETWORK_TYPE)) {
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
