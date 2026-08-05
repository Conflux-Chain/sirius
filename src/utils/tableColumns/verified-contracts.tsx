import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { formatNumber, formatString } from '..';
import {
  Warning,
  OptimizationIcon,
  ConstructorIcon,
} from '@cfxjs/sirius-next-common/dist/components/Icons';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { formatBalance } from '@cfxjs/sirius-next-common/dist/utils';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';

export const address = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.address)}
    </Translation>
  ),
  dataIndex: 'address',
  key: 'address',
  render: (value, row) => (
    <CoreAddressContainer
      value={value}
      verify
      link={`/address/${value}?tab=contract-viewer`}
    />
  ),
};

export const contractName = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.contractName)}
    </Translation>
  ),
  dataIndex: 'contractName',
  key: 'contractName',
  render: value => (
    <Text tag="span" hoverValue={value}>
      {formatString(value, 28)}
    </Text>
  ),
};

export const compiler = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.compiler)}
    </Translation>
  ),
  dataIndex: 'codeFormat',
  key: 'codeFormat',
};

export const version = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.version)}
    </Translation>
  ),
  dataIndex: 'compilerVersion',
  key: 'compilerVersion',
  render: (value, row) => {
    const compilerVulnerabilities = row.compilerVulnerabilities;
    if (compilerVulnerabilities) {
      return (
        <StyledIconWrapper>
          <Tooltip
            title={
              <Translation>
                {t =>
                  t(translations.general.table.tooltip.compilerVersionWarning, {
                    count: compilerVulnerabilities,
                  })
                }
              </Translation>
            }
            className="tooltip-trigger"
          >
            <Warning className="warning" />
            {value}
          </Tooltip>
        </StyledIconWrapper>
      );
    }
    return value;
  },
};

export const balance = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.balance)}
    </Translation>
  ),
  dataIndex: 'balance',
  key: 'balance',
  render: value => {
    const balance = value || 0;
    return (
      <Text tag="span" hoverValue={`${formatBalance(balance, 0, true)} CFX`}>
        {`${formatBalance(balance, 0, false, {}, 0.001)} CFX`}
      </Text>
    );
  },
};

export const txns = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.txns)}
    </Translation>
  ),
  dataIndex: 'txns',
  key: 'txns',
  sortable: true,
  render: value => <span>{formatNumber(value, { withUnit: false })}</span>,
};

export const setting = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.setting)}
    </Translation>
  ),
  dataIndex: 'setting',
  key: 'setting',
  sortable: true,
  render: setting => {
    const optimizationEnabled = setting?.optimizationEnabled;
    const constructorArguments = setting?.constructorArguments;
    if (!constructorArguments && !optimizationEnabled) return '-';
    return (
      <StyledIconWrapper>
        {optimizationEnabled && (
          <Tooltip
            title={
              <Translation>
                {t => t(translations.general.table.tooltip.optimizationEnabled)}
              </Translation>
            }
          >
            <OptimizationIcon />
          </Tooltip>
        )}
        {constructorArguments && (
          <Tooltip
            title={
              <Translation>
                {t =>
                  t(translations.general.table.tooltip.constructorArguments)
                }
              </Translation>
            }
          >
            <ConstructorIcon />
          </Tooltip>
        )}
      </StyledIconWrapper>
    );
  },
};

export const verified = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.verified)}
    </Translation>
  ),
  dataIndex: 'verifiedAt',
  key: 'verifiedAt',
  sortable: true,
  render: value => <span>{dayjs.utc(value * 1000).format('MM/DD/YYYY')}</span>,
};

export const license = {
  title: (
    <Translation>
      {t => t(translations.general.table.verifiedContracts.license)}
    </Translation>
  ),
  dataIndex: 'license',
  key: 'license',
  sortable: true,
  render: value => value || '-',
};

export const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5714rem;
  .tooltip-trigger {
    display: flex;
    align-items: center;
    gap: 0.5714rem;
  }
  svg,
  img {
    width: 1.1429rem;
    height: 1.1429rem;
  }
  .warning {
    color: #fa953c;
  }
`;
