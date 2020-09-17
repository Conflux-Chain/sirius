import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Contract as ContractBody } from '../../components/Contract';
import { appendApiPrefix } from '../../../utils/api';
import useSWR from 'swr';
import qs from 'query-string';
const fetcher = url => fetch(url).then(res => res.json());
export function Contract(props) {
  const { t } = useTranslation();
  const [contractDetail, setContractDetail] = useState({});
  const [type, setType] = useState('create');
  const matchParams = props.match.params;
  const contractAddress = matchParams.contractAddress;
  const fields = [
    'address',
    'type',
    'name',
    'website',
    'tokenIcon',
    'abi',
    'bytecode',
    'icon',
    'sourceCode',
    'typeCode',
  ];
  const queryParams = { address: contractAddress, fields };
  const queryParamsStr = qs.stringify(queryParams);
  const { data, error } = useSWR(
    contractAddress
      ? appendApiPrefix('/contract-manager/contract/query?' + queryParamsStr)
      : null,
    fetcher,
  );
  useEffect(() => {
    if (data && data.code === 0) {
      setContractDetail(data.result);
      setType('edit');
    }
  }, [data]);
  return (
    <>
      <Helmet>
        <title>{t(translations.homepage.title)}</title>
        <meta
          name="description"
          content={t(translations.homepage.description)}
        />
      </Helmet>
      <ContractBody
        contractDetail={contractDetail}
        type={type}
        address={contractAddress}
        history={props.history}
      ></ContractBody>
    </>
  );
}
