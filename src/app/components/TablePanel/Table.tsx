import React, { useEffect } from 'react';
import { Table, Pagination, Card, Loading } from '@cfxjs/react-ui';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { simpleGetFetcher } from './../../../utils/api';
import styled from 'styled-components';

const StyledPaginationWrapper = styled.div`
  margin: 24px 0;
  li button {
    background-color: rgba(0, 84, 254, 0.04);
  }
  .input-wrapper.solid,
  .select {
    background-color: rgba(0, 84, 254, 0.04) !important;
    border-color: transparent !important;
    &.hover,
    &:hover {
      background-color: #e0eaff !important;
    }
  }
  .text,
  button,
  .option span {
    font-size: 14px !important;
    font-family: CircularStd-Medium, CircularStd;
    font-weight: 500 !important;
    color: #74798c !important;
    line-height: 18px;
  }
  button.active {
    color: #fff !important;
  }
`;
const StyledTableWrapper = styled.div`
  .table thead th {
    white-space: nowrap !important;
  }
  .table td.table-cell {
    font-size: 14px;
    font-family: CircularStd-Book, CircularStd;
    color: #20253a;
    line-height: 24px;
    padding: 18px calc((8px / 2) * 3);
    white-space: nowrap !important;
  }
`;

function PanelTable({ url, pagination, table, onDataChange }) {
  const { data, error } = useSWR([url], simpleGetFetcher);

  useEffect(() => {
    onDataChange && onDataChange(data, error);
  }, [data]); // eslint-disable-line

  let emptyText: React.ReactNode | string = 'No data.';
  let tableData = table.data;
  let paginationTotal: number = 0;

  if (!data && !error) {
    emptyText = <Loading />;
  }

  if (data && !error) {
    tableData = data.result?.list || table.data;
    paginationTotal = data.result?.total || 0;
  }

  return (
    <>
      <StyledTableWrapper>
        <Table
          tableLayout="fixed"
          columns={table.columns}
          rowKey={table.rowKey}
          data={tableData}
          emptyText={emptyText}
          scroll={{ x: 800 }}
        />
      </StyledTableWrapper>
      <StyledPaginationWrapper>
        {pagination.show && (
          <Pagination {...pagination} total={paginationTotal} />
        )}
      </StyledPaginationWrapper>
    </>
  );
}

PanelTable.defaultProps = {
  url: '',
  columns: [],
  // pagination component config, see https://react-ui-git-master.conflux-chain.vercel.app/en-us/components/pagination
  pagination: {},
  table: {
    data: [],
    columns: [],
    rowKey: 'key',
  },
  onDataChange: () => {},
};

PanelTable.propTypes = {
  url: PropTypes.string,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
  }),
  table: PropTypes.shape({
    data: PropTypes.array,
    columns: PropTypes.array,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  }),
  onDataChange: PropTypes.func,
};

export default PanelTable;
