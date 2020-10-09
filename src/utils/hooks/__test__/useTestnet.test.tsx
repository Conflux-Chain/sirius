import React from 'react';
import { render } from '@testing-library/react';
import { useTestnet, toTestnet, toMainnet } from '../useTestnet';

describe('useTestnet', () => {
  const MockComp: React.FC = () => {
    const isTestnet = useTestnet();
    return <p>{JSON.stringify(isTestnet)}</p>;
  };

  it('should be true when at testnet.confluxscan.io', () => {
    const location = new URL('https://testnet.confluxscan.io');
    delete window.location;
    // @ts-ignore
    window.location = location;

    const component = render(<MockComp />);
    expect((component.container.firstChild as HTMLElement).innerHTML).toEqual(
      'true',
    );
  });

  it('should be false when at confluxscan.io', () => {
    const location = new URL('https://confluxscan.io');
    delete window.location;
    // @ts-ignore
    window.location = location;

    const component = render(<MockComp />);
    expect((component.container.firstChild as HTMLElement).innerHTML).toEqual(
      'false',
    );
  });
});

const mockAssign = jest.fn();

describe('toTestnet', () => {
  it('should call location.assign with testnet.scantest url', () => {
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: mockAssign,
      hostname: 'scantest.confluxscan.io',
    };
    toTestnet();
    expect(mockAssign).toHaveBeenCalledWith(
      '//testnet.scantest.confluxscan.io',
    );
    mockAssign.mockClear();
  });
  it('should call location.assign with testnet url', () => {
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: mockAssign,
      hostname: 'confluxscan.io',
    };
    toTestnet();
    expect(mockAssign).toHaveBeenCalledWith('//testnet.confluxscan.io');
    mockAssign.mockClear();
  });
});

describe('toMainnet', () => {
  it('should call location.assign with mainnet.scantest url', () => {
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: mockAssign,
      hostname: 'testnet.scantest.confluxscan.io',
    };
    toMainnet();
    expect(mockAssign).toHaveBeenCalledWith('//scantest.confluxscan.io');
    mockAssign.mockClear();
  });
  it('should call location.assign with mainnet url', () => {
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: mockAssign,
      hostname: 'testnet.confluxscan.io',
    };
    toMainnet();
    expect(mockAssign).toHaveBeenCalledWith('//confluxscan.io');
    mockAssign.mockClear();
  });
});
