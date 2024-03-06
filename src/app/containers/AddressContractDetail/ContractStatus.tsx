import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { CheckCircleIcon } from '../AddressContractDetail/ContractContent';
import AlertCircle from '@zeit-ui/react-icons/alertCircle';
import lodash from 'lodash';

interface Props {
  contract: {
    destroy: {
      status: number;
    };
    isRegistered?: boolean;
    cfxTransferCount?: number | string;
    verify?: {
      exactMatch: boolean;
    };
  };
}

export const ContractStatus = ({ contract }: Props) => {
  const { t } = useTranslation();
  let status: React.ReactNode = '';
  const dStatus = contract?.destroy?.status;

  if (dStatus === 0) {
    if (
      !lodash.isNil(contract?.isRegistered) ||
      !lodash.isNil(contract?.cfxTransferCount)
    ) {
      if (contract?.verify?.exactMatch === true) {
        status = <CheckCircleIcon size={14} />;
      } else {
        status = <AlertCircle size={16} color="var(--theme-color-orange0)" />;
      }
    }
  } else if (dStatus === 1) {
    status = t(translations.contract.status['1']);
  } else if (dStatus === 2) {
    status = t(translations.contract.status['2']);
  } else if (dStatus === 3) {
    status = t(translations.contract.status['3']);
  }

  return <StyledStatusWrapper>{status}</StyledStatusWrapper>;
};

const StyledStatusWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  font-size: 12px;
  color: var(--theme-color-orange0);
`;
