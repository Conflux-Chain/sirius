import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Contract as ContractBody } from '../../components/Contract/Loadable';
import { useCMContractQuery } from '../../../utils/api';
import { isAddress } from '../../../utils';

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
    'abi',
    'bytecode',
    'icon',
    'sourceCode',
    'typeCode',
  ];
  const params = { address: contractAddress, fields };
  const { data } = useCMContractQuery(params, isAddress(contractAddress));
  useEffect(() => {
    if (isAddress(contractAddress)) {
      setLoading(true);
      if (data) {
        setLoading(false);
        setContractDetail(data);
        setType('edit');
      }
    } else {
      setLoading(false);
    }
  }, [data, contractAddress]);
  return (
    <>
      <Helmet>
        <title>{t(translations.metadata.title)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <ContractBody
        contractDetail={contractDetail}
        type={type}
        address={contractAddress}
        history={props.history}
        loading={loading}
      ></ContractBody>
    </>
  );
}
