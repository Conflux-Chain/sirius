import React, { useCallback, useEffect, useState } from 'react';
import { eventLogsColumns } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { cfxRequest } from 'utils/rpcRequest';
import { AdvancedSearchForm } from '../Transactions/components/AdvancedSearchForm';
import Search from '@zeit-ui/react-icons/search';
import ChevronUp from '@zeit-ui/react-icons/chevronUp';
import Button from '@cfxjs/sirius-next-common/dist/components/Button';
import { StyledTableHeaderWrapper } from '../Transactions/components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useLocation } from 'react-router-dom';
import { ContractEventList } from '@cfxjs/sirius-next-common/dist/components/EventLog/ContractEventList';

const searchOptions = {
  fromEpoch: true,
  toEpoch: true,
  topic0: true,
  button: {
    col: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
    },
  },
};

interface Props {
  address: string;
  contractInfo?: any;
}

const Title = ({ invalidSearch }: { invalidSearch: string | null }) => {
  const { t } = useTranslation();
  const [fold, setFold] = useState(invalidSearch === null);
  useEffect(() => {
    if (invalidSearch !== null) setFold(false);
  }, [invalidSearch]);

  return (
    <StyledTableHeaderWrapper>
      <div className="table-header-top">
        <div className="table-title-tip-total">
          {t(translations.eventLogs.logTips)}
        </div>
        <div className="table-title-filter-wrapper">
          <Button type="icon" onClick={() => setFold(!fold)}>
            {fold ? <Search size={18} /> : <ChevronUp size={18} />}
          </Button>
        </div>
      </div>
      {fold ? null : (
        <div className="table-header-bottom">
          <AdvancedSearchForm {...searchOptions} />
        </div>
      )}
    </StyledTableHeaderWrapper>
  );
};
const columnsWidth = [185, 105, 115, 720];
export const ContractEventLogs = ({ address, contractInfo }: Props) => {
  const { search } = useLocation();
  const [ageFormat, toggleAgeFormat] = useAge();

  const columns = useCallback(
    (contractInfo, implementContractInfo) =>
      [
        eventLogsColumns.transactionHash,
        eventLogsColumns.epochNumber,
        eventLogsColumns.age(ageFormat, toggleAgeFormat),
        eventLogsColumns.logs({ contractInfo, implementContractInfo }),
      ].map((item, i) => ({ ...item, width: columnsWidth[i] })),
    [ageFormat, toggleAgeFormat],
  );

  return (
    <ContractEventList
      space="core"
      request={cfxRequest}
      columns={columns}
      address={address}
      contractInfo={contractInfo}
      title={valid => <Title invalidSearch={valid ? null : search} />}
    />
  );
};
