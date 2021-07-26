import React from 'react';
import {
  TablePanel as TablePanelNew,
  TitleTotal,
} from 'app/components/TablePanelNew';
import { tokenColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { cfxTokenTypes } from 'utils/constants';
import { media, useBreakpoint } from 'styles/media';
import { DownloadCSV } from 'app/components/DownloadCSV/Loadable';
import styled from 'styled-components/macro';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { isAddress, isHash } from 'utils';
import { useHistory, useLocation } from 'react-router-dom';
import {
  TableSearchDatepicker,
  TableSearchInput,
} from 'app/components/TablePanel';
import qs from 'query-string';
import { useMessages } from '@cfxjs/react-ui';
import lodash from 'lodash';

interface Props {
  type: string;
  address: string;
  decimals: number;
}

interface Query {
  accountAddress?: string;
  transactionHash?: string;
  tokenId?: string;
}

export const Transfers = ({ type, address, decimals }: Props) => {
  const url = `/transfer?address=${address}&transferType=${type}`;

  const bp = useBreakpoint();
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [, setMessage] = useMessages();

  const [ageFormat, toggleAgeFormat] = useAge();

  let {
    accountAddress: filterAddr,
    transactionHash: filterHash,
    tokenId: filterTokenId,
    tab: currentTab,
    ...others
  } = qs.parse(location.search);

  let columnsWidth = [3, 6, 6, 4, 4];
  let columns = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    {
      ...tokenColunms.quantity,
      render: (value, row, index) =>
        tokenColunms.quantity.render(value, row, index, {
          decimals,
        }),
    },
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  if (type === cfxTokenTypes.erc721) {
    columnsWidth = [3, 6, 6, 4, 3];
    columns = [
      tokenColunms.txnHash,
      tokenColunms.from,
      tokenColunms.to,
      tokenColunms.tokenId(),
      tokenColunms.age(ageFormat, toggleAgeFormat),
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }
  if (type === cfxTokenTypes.erc1155) {
    columnsWidth = [3, 7, 7, 3, 4, 4];
    columns = [
      tokenColunms.txnHash,
      tokenColunms.from,
      tokenColunms.to,
      tokenColunms.quantity,
      tokenColunms.tokenId(address),
      tokenColunms.age(ageFormat, toggleAgeFormat),
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }

  const filter =
    (filterAddr as string) ||
    (filterHash as string) ||
    (filterTokenId as string) ||
    '';

  const onFilter = (filter: string) => {
    let object: Query = {};

    if (filter) {
      if (isAddress(filter)) {
        object.accountAddress = filter;
      } else if (isHash(filter)) {
        object.transactionHash = filter;
      } else if (type !== cfxTokenTypes.erc20 && lodash.isInteger(+filter)) {
        object.tokenId = filter;
      } else {
        setMessage({
          text: t(translations.token.transferList.searchError),
        });
        return;
      }
    }

    const urlWithQuery = qs.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        skip: '0',
        ...object,
      },
    });
    history.push(urlWithQuery);
  };

  const tableHeader = ({ total, listLimit }) => {
    return (
      <StyledSearchAreaWrapper>
        <TitleTotal total={total} listLimit={listLimit} />
        <div className="token-search-container">
          <TableSearchInput
            onFilter={onFilter}
            filter={filter}
            placeholder={
              type === cfxTokenTypes.erc20
                ? `${t(
                    translations.general.searchInputPlaceholder.txnHash,
                  )} / ${t(
                    translations.general.searchInputPlaceholder.holderAddress,
                  )}`.replace(bp === 's' ? / \/ /gi : '/', '/')
                : `${t(
                    translations.general.searchInputPlaceholder.txnHash,
                  )} / ${t(
                    translations.general.searchInputPlaceholder.holderAddress,
                  )} / ${t(
                    translations.general.searchInputPlaceholder.tokenID,
                  )}`.replace(bp === 's' ? / \/ /gi : '/', '/')
            }
          />
          <TableSearchDatepicker />
        </div>
      </StyledSearchAreaWrapper>
    );
  };
  const tableFooter = (
    <DownloadCSV
      url={qs.stringifyUrl({
        url: '/v1/report/transfer',
        query: {
          transferType: type,
          address,
          limit: '5000',
          reverse: 'true',
        },
      })}
    />
  );

  return (
    <>
      <TablePanelNew
        url={url}
        columns={columns}
        rowKey={(row, index) => `${row.transactionHash}${index}`}
        title={tableHeader}
        footer={() => tableFooter}
      ></TablePanelNew>
    </>
  );
};

const StyledSearchAreaWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  .token-search-container {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;

    ${media.s} {
      justify-content: flex-start;
      margin-top: 0.3571rem;
    }
  }

  ${media.s} {
    justify-content: flex-start;
  }
`;
