import React, { /*useEffect,*/ useMemo } from 'react';
// import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
// import { useHistory, useLocation } from 'react-router';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import {
  isContractAddress,
  isInnerContractAddress,
  // isAccountAddress,
} from 'utils';
import { cfxTokenTypes } from 'utils/constants';
import { ContractContent, CheckCircleIcon } from './ContractContent';
import AlertCircle from '@zeit-ui/react-icons/alertCircle';
import { ExcutedAndPendingTxns } from 'app/containers/Transactions/Loadable';

import {
  // ExcutedTxns,
  CFXTxns,
  CRC20Txns,
  CRC721Txns,
  CRC1155Txns,
  // PendingTxns,
} from 'app/containers/Transactions/Loadable';
import { MinedBlocks } from 'app/containers/Blocks/Loadable';

export function Table({ address, addressInfo }) {
  const { t } = useTranslation();
  // const location = useLocation();
  // const history = useHistory();
  // const queries = queryString.parse(location.search);
  const isContract = useMemo(
    () => isContractAddress(address) || isInnerContractAddress(address),
    [address],
  );

  // useEffect(() => {
  //   history.replace(
  //     queryString.stringifyUrl({
  //       url: location.pathname,
  //       query: {
  //         accountAddress: address,
  //         ...queries,
  //       },
  //     }),
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.search, location.pathname, address, history]);

  const tabs: any = [
    {
      value: `transaction`,
      action: 'accountTransactions',
      label: t(translations.general.transactions),
      content: <ExcutedAndPendingTxns address={address} />,
    },
    // {
    //   value: 'transaction',
    //   action: 'accountTransactions',
    //   label: isAccountAddress(address)
    //     ? t(translations.transactions.executed)
    //     : t(translations.general.transactions),
    //   content: <ExcutedTxns address={address} />,
    // },
  ];

  // if (isAccountAddress(address)) {
  //   tabs.push({
  //     value: 'transaction-pending',
  //     action: 'accountTransactions-pending',
  //     label: t(translations.transactions.pending),
  //     content: <PendingTxns address={address} />,
  //   });
  // }

  tabs.push({
    value: `transfers-${cfxTokenTypes.cfx}`,
    action: 'cfxTransfers',
    label: t(translations.general.cfxTransfer),
    content: <CFXTxns address={address} />,
  });

  tabs.push({
    hidden: !addressInfo.erc20TransferCount,
    value: `transfers-${cfxTokenTypes.crc20}`,
    action: 'transfersCrc20',
    label: t(translations.general.tokenTxnsErc20),
    content: <CRC20Txns address={address} />,
  });

  tabs.push({
    hidden: !addressInfo.erc721TransferCount,
    value: `transfers-${cfxTokenTypes.crc721}`,
    action: 'transfersCrc721',
    label: t(translations.general.tokenTxnsErc721),
    content: <CRC721Txns address={address} />,
  });

  tabs.push({
    hidden: !addressInfo.erc1155TransferCount,
    value: `transfers-${cfxTokenTypes.crc1155}`,
    action: 'transfersCrc1155',
    label: t(translations.general.tokenTxnsErc1155),
    content: <CRC1155Txns address={address} />,
  });

  if (isContract) {
    tabs.push({
      value: 'contract-viewer',
      action: 'contractViewer',
      label: (
        <div>
          {t(translations.token.contract)}{' '}
          {addressInfo.verify?.exactMatch ? (
            <CheckCircleIcon />
          ) : (
            <AlertCircle size={16} color="#e36057" />
          )}
        </div>
      ),
      content: <ContractContent contractInfo={addressInfo} />,
    });
  }

  if (!isContract) {
    tabs.push({
      value: 'mined-blocks',
      action: 'minedBlocks',
      label: t(translations.addressDetail.minedBlocks),
      content: <MinedBlocks address={address} />,
    });
  }

  return <TabsTablePanel key="table" tabs={tabs} />;
}
