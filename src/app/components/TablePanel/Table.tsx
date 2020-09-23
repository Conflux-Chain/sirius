import React, { useEffect } from 'react';
import { Table, Pagination, Loading } from '@cfxjs/react-ui';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { simpleGetFetcher } from './../../../utils/api';
import styled from 'styled-components';
import { media } from './../../../styles/media';

const StyledPaginationWrapper = styled.div`
  margin: 1.7143rem 0;
  li button {
    background-color: rgba(0, 84, 254, 0.04);
  }
  .input-wrapper.solid,
  div.select {
    background-color: rgba(0, 84, 254, 0.04) !important;
    border-color: transparent;
    &.hover,
    &:hover {
      background-color: #e0eaff !important;
      border-color: transparent;
    }
    input {
      color: #74798c !important;
      font-size: 1rem;
      font-family: CircularStd-Medium, CircularStd;
      font-weight: 500;
    }
  }

  div.text,
  button,
  div.option span {
    font-size: 1rem !important;
    font-family: CircularStd-Medium, CircularStd;
    font-weight: 500;
    color: #74798c !important;
    line-height: 1.2857rem !important;
  }
  button.active {
    color: #fff !important;
  }
`;
const StyledTableWrapper = styled.div`
  .table-content {
    padding: 0 1.2857rem 1.2857rem;
  }
  .table th.table-cell {
    white-space: nowrap;
  }
  .table td.table-cell {
    font-size: 1rem;
    font-family: CircularStd-Book, CircularStd;
    font-weight: 400;
    color: #20253a;
    padding: 1.2857rem calc((0.5714rem / 2) * 3);
    white-space: nowrap;
    line-height: 1;

    ${media.s} {
      padding: 1.1429rem;
    }
  }
`;

function PanelTable({ url, pagination, table, onDataChange }) {
  const { data, error } = useSWR([url], simpleGetFetcher);

  useEffect(() => {
    onDataChange && onDataChange({ data, error });
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
