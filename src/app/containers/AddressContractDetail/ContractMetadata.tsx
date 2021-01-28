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
import { useContract, useToken } from 'utils/api';
import { IconButton } from './IconButton';
import { media } from 'styles/media';
import { Text } from 'app/components/Text';
import { Link as UILink } from '@cfxjs/react-ui';
import { formatString } from 'utils';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { AddressContainer } from '../../components/AddressContainer';
const Link = ({ to, children }) => <RouterLink to={to}>{children}</RouterLink>;

const WarnningButton = () => {
  const { t, i18n } = useTranslation();

  return (
    <WarnningButtonWrapper>
      <IconButton
        className="metadata-tooltip-btn"
        size={16}
        tooltipContentClassName="warnning-tooltip"
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
        <path
          d="M501.28 4.16a501.248 501.248 0 1 0 0 1002.56 501.248 501.248 0 0 0 0-1002.56z m42.24 668.8c0 23.36-19.2 42.24-42.24 42.24-23.04 0-42.24-19.136-42.24-42.24 0-23.04 19.2-42.24 42.24-42.24 23.04 0 42.24 19.2 42.24 42.24z m0-176.576a41.856 41.856 0 0 1-42.24 41.408 41.856 41.856 0 0 1-42.24-41.408V284.16c0-22.848 19.2-41.408 42.24-41.408 23.04 0 42.24 18.56 42.24 41.408v212.288z"
          fill="#FFB84B"
          p-id={950}
        />
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

export function ContractMetadata({ address }) {
  const { t } = useTranslation();
  const notAvailableText = t(translations.general.security.notAvailable);

  const { data: contractInfo } = useContract(address, [
    'name',
    'icon',
    'sponsor',
    'website',
    'admin',
    'from',
    'transactionHash',
    'code',
  ]);
  const { data: tokenInfo } = useToken(address, ['name', 'icon']);
  const loading = contractInfo.name === t(translations.general.loading);
  const skeletonStyle = { height: '1.5714rem' };

  return (
    <List
      list={[
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
                {contractInfo.icon && (
                  <Icon
                    src={contractInfo.icon}
                    alt={`${contractInfo.name} logo`}
                  />
                )}
                <Content>{contractInfo.name || notAvailableText}</Content>
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
                    <AddressContainer value={contractInfo.admin} />
                  ) : (
                    notAvailableText
                  )}
                </Content>
                <WarnningButton key="warning" />
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
                {tokenInfo.icon && (
                  <Icon
                    src={tokenInfo.icon}
                    alt={`${contractInfo.name} logo`}
                  />
                )}
                <Content className={clsx(!tokenInfo.name && 'not-available')}>
                  {tokenInfo.name ? (
                    <Link to={`/token/${address}`}>{`${
                      tokenInfo.name || notAvailableText
                    } (${tokenInfo.symbol || notAvailableText})`}</Link>
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
                    !contractInfo.sponsor.sponsorForCollateral &&
                      'not-available',
                  )}
                >
                  {contractInfo.sponsor &&
                  contractInfo.sponsor.sponsorForCollateral ? (
                    [
                      <AddressContainer
                        value={contractInfo.sponsor.sponsorForCollateral}
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
                {!contractInfo.code ? (
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
                        <Link
                          to={`/transaction/${contractInfo.transactionHash}`}
                        >
                          <Text span hoverValue={contractInfo.transactionHash}>
                            {formatString(
                              contractInfo.transactionHash,
                              'address',
                            )}
                          </Text>
                        </Link>
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
                  {contractInfo.sponsor &&
                  contractInfo.sponsor.sponsorForGas ? (
                    [
                      <AddressContainer
                        value={contractInfo.sponsor.sponsorForGas}
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
      ]}
    />
  );
}

const CenterLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .metadata-tooltip-btn {
    margin-left: 0.5rem;
    margin-bottom: 0.2857rem;
    ${media.s} {
      margin-left: 1rem;
    }
  }
`;

const Content = styled.span`
  &.not-available.link {
    color: #97a3b4;
  }
`;
const Icon = styled.img`
  width: 1.14rem;
  height: 1.14rem;
  margin-right: 0.57rem;
`;
