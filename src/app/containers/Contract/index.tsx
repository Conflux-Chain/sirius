import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContractOrTokenInfo } from 'app/components/Contract/Loadable';
import { useCMContractQuery } from 'utils/api';
import { isCoreContractAddress } from 'utils';

export function Contract(props) {
  const { t } = useTranslation();
  const [contractDetail, setContractDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('create');
  const matchParams = props.match.params;
  const contractAddress = matchParams.contractAddress;
  const fields = [
    'address',
    'type',
    'name',
    'website',
    'token',
    'typeCode',
    'verifyInfo',
  ];
  const params = useMemo(() => ({ address: contractAddress, fields }), [
    contractAddress,
    fields,
  ]);
  const { data } = useCMContractQuery(
    params,
    isCoreContractAddress(contractAddress),
  );
  useEffect(() => {
    if (isCoreContractAddress(contractAddress)) {
      setLoading(true);
      if (data && data.nonce) {
        setContractDetail(data);
        setType('edit');
      }
      setLoading(false);
    }
  }, [data, contractAddress]);

  return (
    <>
      <Helmet>
        <title>{t(translations.header.contract)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <ContractOrTokenInfo
        contractDetail={contractDetail}
        type={type}
        address={contractAddress}
        loading={loading}
      ></ContractOrTokenInfo>
    </>
  );
}
