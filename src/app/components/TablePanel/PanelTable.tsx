import React, { useEffect } from 'react';
import { Table, Pagination, Card } from '@cfxjs/react-ui';
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
    padding-top: 0;
  }
  .table td {
    font-size: 14px;
    font-family: CircularStd-Book, CircularStd;
    color: #20253a;
    line-height: 24px;
    padding: 18px calc((8px / 2) * 3) !important;
  }
`;

function PanelTable({ url, columns, onChange, pagination, rowKey }) {
  const { data, error } = useSWR([url], simpleGetFetcher);

  useEffect(() => {
    onChange && onChange(data);
  }, [data, onChange]);

  if (error) return <div>no data.</div>;
  if (!data) return <div>loading</div>;

  return (
    <>
      <Card>
        <StyledTableWrapper>
          <Table
            tableLayout="fixed"
            columns={columns}
            rowKey={rowKey}
            data={data.result?.list || []}
          />
        </StyledTableWrapper>
      </Card>
      <StyledPaginationWrapper>
        <Pagination total={data.result.total} {...pagination} />
      </StyledPaginationWrapper>
    </>
  );
}

PanelTable.defaultProps = {
  onChange: () => {}, // emit total count
  url: '',
  columns: [],
  // pagination component config, see https://react-ui-git-master.conflux-chain.vercel.app/en-us/components/pagination
  pagination: {},
  rowKey: 'key',
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
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default PanelTable;
