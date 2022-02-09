import { useTableDataByHttp } from 'utils/hooks/useTableDataByHttp';

export const useTableData = (
  url: string,
  inactive = false,
  shouldFetch = true,
) => useTableDataByHttp(url, inactive, shouldFetch);
