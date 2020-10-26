/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name ContractMetadata.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */
import React, { useCallback } from 'react';
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
const Link = ({ to, children }) => <RouterLink to={to}>{children}</RouterLink>;

const WarnningButton = () => {
  const { t } = useTranslation();

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
              <UILink className="warnning-tooltip-link" href="/tbd">
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
`;
const WarnningTooltipWrapper = styled.div`
  p.warnning-text {
    margin: 0;
  }
  .warnning-tooltip-link.link {
    color: #008dff;
  }
`;

const EditButton = ({ url }) => {
  const { t } = useTranslation();

  return (
    <IconButton
      url={url}
      className="metadata-tooltip-btn"
      size={16}
      tooltipText={t(translations.general.address.editContract)}
    >
      <path
        d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
        fill="#DBDDE4"
      />
      <path
        d="M696 768h-368A72.064 72.064 0 0 1 256 696v-368c0-39.68 32.256-71.936 72-72h186.816a24 24 0 0 1 0 48H328a24 24 0 0 0-24 24v368c0 13.248 10.752 24 24 24h368a24 24 0 0 0 24-24V512A24 24 0 1 1 768 512v184c0 39.744-32.256 71.936-72 72zM514.816 536a24 24 0 0 1-17.088-40.832l229.12-232a24 24 0 1 1 34.24 33.728L531.84 528.896a23.936 23.936 0 0 1-17.088 7.104z"
        fill="#737682"
      />
    </IconButton>
  );
};

export function ContractMetadata({ address }) {
  const { t } = useTranslation();
  const notAvaiableText = t(translations.general.security.notAvailable);
  const isAvaiable = useCallback(t => t !== null, []);

  const { data: contractInfo } = useContract(address, [
    'name',
    'icon',
    'sponsorForGas',
    'sponsorForCollateral',
    'website',
    'admin',
    'from',
    'transactionHash',
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
                <Content>{contractInfo.name || notAvaiableText}</Content>
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
                  {isAvaiable(contractInfo.admin) ? (
                    <Link to={`/address/${contractInfo.admin}`}>
                      <Text span hoverValue={contractInfo.admin}>
                        {formatString(contractInfo.admin, 'address')}
                      </Text>
                    </Link>
                  ) : (
                    notAvaiableText
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
                <Content
                  className={clsx(
                    !isAvaiable(tokenInfo.name) && 'not-avaiable',
                  )}
                >
                  {isAvaiable(tokenInfo.name) ? (
                    <Link to={`/token/${address}`}>{tokenInfo.name}</Link>
                  ) : (
                    notAvaiableText
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
                    !isAvaiable(contractInfo.sponsorForCollateral) &&
                      'not-avaiable',
                  )}
                >
                  {isAvaiable(contractInfo.sponsorForCollateral)
                    ? [
                        <Link
                          key="content"
                          to={`/address/${contractInfo.sponsorForCollateral}`}
                        >
                          {contractInfo.sponsorForCollateral}
                        </Link>,
                        <EditButton url={`/sponsor/${address}`} key="edit" />,
                      ]
                    : notAvaiableText}
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
                <Content
                  className={clsx(
                    !isAvaiable(contractInfo.from) && 'not-avaiable',
                    !isAvaiable(contractInfo.transactionHash) && 'not-avaiable',
                  )}
                >
                  {isAvaiable(contractInfo.from) ? (
                    <Link to={`/address/${contractInfo.from}`}>
                      <Text span hoverValue={contractInfo.from}>
                        {formatString(contractInfo.from, 'address')}
                      </Text>
                    </Link>
                  ) : (
                    notAvaiableText
                  )}
                  {` ${t(translations.contractDetail.at)} ${t(
                    translations.contractDetail.txOnlyEn,
                  )} `}
                  {isAvaiable(contractInfo.from) ? (
                    <Link to={`/transaction/${contractInfo.transactionHash}`}>
                      <Text span hoverValue={contractInfo.transactionHash}>
                        {formatString(contractInfo.transactionHash, 'address')}
                      </Text>
                    </Link>
                  ) : (
                    notAvaiableText
                  )}
                  {` ${t(translations.contractDetail.txOnlyZh)} `}
                </Content>
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
                  {isAvaiable(contractInfo.sponsorForGas)
                    ? [
                        <Link
                          key="content"
                          to={`/address/${contractInfo.sponsorForGas}`}
                        >
                          {contractInfo.sponsorForGas}
                        </Link>,
                        <EditButton url={`/sponsor/${address}`} key="edit" />,
                      ]
                    : notAvaiableText}
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
  &.not-avaiable.link {
    color: #97a3b4;
  }
`;
const Icon = styled.img`
  width: 1.14rem;
  height: 1.14rem;
  margin-right: 0.57rem;
`;
