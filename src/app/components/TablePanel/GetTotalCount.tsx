import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { simpleGetFetcher } from '../../../utils/api';

const TabLabelCount = ({ type, url, onChange }) => {
  const shouldFetch = url && onChange;
  const { data, error } = useSWR(shouldFetch ? [url] : null, simpleGetFetcher);
  useEffect(() => {
    if (data && !error) {
      onChange({
        [type]: data.result?.total,
      });
    }
  }, [data, error, type]); // eslint-disable-line
  return null;
};

TabLabelCount.defaultProps = {
  type: '',
};
TabLabelCount.propTypes = {
  type: PropTypes.string,
  url: PropTypes.string,
  onChange: PropTypes.func,
};

export default TabLabelCount;
