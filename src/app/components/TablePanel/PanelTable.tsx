import React, { useEffect } from 'react';
import { Table, Pagination } from '@cfxjs/react-ui';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { simpleGetFetcher } from './../../../utils/api';

function PanelTable({ url, columns, onChange, pagination }) {
  const { data, error } = useSWR([url], simpleGetFetcher);

  useEffect(() => {
    onChange && onChange(data);
  }, [data, onChange]);

  if (error) return <div>no data.</div>;
  if (!data) return <div>loading</div>;

  return (
    <>
      <Table
        tableLayout="fixed"
        columns={columns}
        data={data.result?.list || []}
      />
      <Pagination
        size="small"
        total={data.result.total}
        showPageSizeChanger
        showQuickJumper
        {...pagination}
      />
    </>
  );
}

PanelTable.defaultProps = {
  onChange: () => {}, // emit total count
  url: '',
  columns: [],
  // pagination component config, see https://react-ui-git-master.conflux-chain.vercel.app/en-us/components/pagination
  pagination: {},
};

PanelTable.propTypes = {
  onChange: PropTypes.func,
  url: PropTypes.string,
  columns: PropTypes.array,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
  }),
};

export default PanelTable;
