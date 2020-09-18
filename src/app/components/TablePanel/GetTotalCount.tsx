import React, { useEffect } from 'react';
import useSWR from 'swr';
import { simpleGetFetcher } from '../../../utils/api';

const TabLabelCount = ({ type, url, onChange }) => {
  const { data, error } = useSWR([url], simpleGetFetcher);
  useEffect(() => {
    if (data && !error) {
      onChange &&
        onChange({
          [type]: data.result?.total,
        });
    }
  }, [data, error, onChange, type]);
  return null;
};

export default TabLabelCount;
