import React from 'react';
import { updateWrapper } from '../../../test/utils';
import TestRenderer from 'react-test-renderer';
import * as api from '../api';

const getData = jest.fn();
const getError = jest.fn();
const MockComp: React.FC<{ f: api.useApi; p?: api.Params | any[] }> = ({
  f,
  p,
}) => {
  const { data, error } = f(p);
  if (data) getData(data);
  if (error) getError(error.message);
  return <div></div>;
};

describe('api', () => {
  describe('useDashboardDag', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useDashboardDag} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useDashboardDag} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useDashboardDag} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useDashboardDag} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useDashboardEpoch', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useDashboardEpoch} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useDashboardEpoch} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useDashboardEpoch} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useDashboardEpoch} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useDashboardPlot', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useDashboardPlot} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useDashboardPlot} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useDashboardPlot} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useDashboardPlot} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useDashboardTrend', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useDashboardTrend} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useDashboardTrend} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useDashboardTrend} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useDashboardTrend} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useAddressQuery', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useAddressQuery} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useAddressQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useAddressQuery} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useAddressQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useBlockList', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useBlockList} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useBlockList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useBlockList} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useBlockList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useBlockQuery', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useBlockQuery} p={{ hash: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useBlockQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useBlockQuery} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useBlockQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useTransactionList', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useTransactionList} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTransactionList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTransactionList} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useTransactionList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useTransactionQuery', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useTransactionQuery} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTransactionQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTransactionQuery} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useTransactionQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useTransferList', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useTransferList} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTransferList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTransferList} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useTransferList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useContractList', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useContractList} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useContractList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useContractList} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useContractList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useTokenList', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useTokenList} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTokenList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTokenList} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useTokenList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useTokenQuery', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useTokenQuery} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTokenQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useTokenQuery} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useTokenQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useUtilType', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useUtilType} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useUtilType} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useUtilType} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useUtilType} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useCMAccountTokenList', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useCMAccountTokenList} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMAccountTokenList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMAccountTokenList} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useCMAccountTokenList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useCMContractQuery', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp
          f={api.useCMContractQuery}
          p={[{ address: '0x86f7006d534dad36d56d10531ecd2fd2c6eedb78' }]}
        />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMContractQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMContractQuery} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useCMContractQuery} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useCMContractList', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useCMContractList} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMContractList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMContractList} p={[{ test: 'a' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useCMContractList} p={{ test: 'a' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useCMContractCreate', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useCMContractCreate} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMContractCreate} p={{ foo: 'bar' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMContractCreate} p={[{ foo: 'bar' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useCMContractCreate} p={{ foo: 'bar' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
  describe('useCMContractDelete', () => {
    it('should return the data', async () => {
      let r: TestRenderer.ReactTestRenderer;

      // no params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(<MockComp f={api.useCMContractDelete} />);
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // json
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMContractDelete} p={{ foo: 'bar' }} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // array params
      fetchMock.mockOnce(JSON.stringify({ data: 'json' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      r = TestRenderer.create(
        <MockComp f={api.useCMContractDelete} p={[{ foo: 'bar' }]} />,
      );
      await updateWrapper(r, 0);
      expect(getData).toBeCalledWith({ data: 'json' });

      // err
      fetchMock.mockRejectOnce(new Error('err'));
      r = TestRenderer.create(
        <MockComp f={api.useCMContractDelete} p={{ foo: 'bar' }} />,
      );
      await updateWrapper(r, 0);
      expect(getError).toBeCalledWith('err');
    });
  });
});
