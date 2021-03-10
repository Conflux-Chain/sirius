import React from 'react';
import { Dropdown } from '../../components/Dropdown';
import qs from 'query-string';
import { useLocation, useHistory } from 'react-router';

import imgDot from 'images/contract-address/dot-dot-dot.svg';

// options example:
// [
//   {
//     key: 'all',
//     name: 'viewAll',
//   },
//   {
//     key: 'outgoing',
//     name: 'viewOutgoingTxns',
//   },
//   {
//     key: 'incoming',
//     name: 'viewIncomingTxns',
//   },
// ]

interface Props {
  type: string;
  options: Array<{
    key: string;
    name: string;
  }>;
  onChange?: (value) => void;
}

export const TableSearchDropdown = ({
  type,
  options = [],
  onChange,
}: Props) => {
  const history = useHistory();
  const location = useLocation();
  const query = qs.parse(location.search || '');

  const handleChange =
    onChange ||
    function (value) {
      if (query[type] !== value)
        history.push(
          qs.stringifyUrl({
            url: location.pathname,
            query: {
              ...query,
              [type]: value,
            },
          }),
        );
    };

  return (
    <Dropdown
      label={<img src={imgDot} alt="alarm" />}
      options={options}
      onChange={handleChange}
    />
  );
};
