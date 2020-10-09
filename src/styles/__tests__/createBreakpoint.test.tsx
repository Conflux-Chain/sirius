import React from 'react';
import createBreakpoint from '../createBreakpoint';
import { render } from '@testing-library/react';
import { act } from '@testing-library/react';

describe('createBreakpoint', () => {
  it('should return the right useBreakpoint', async () => {
    const sizes = {
      s: 600,
      m: 1024,
      l: 1440,
      xl: 1920,
    };
    const useBreakpoint = createBreakpoint({
      s: sizes.s,
      m: sizes.m,
      l: sizes.l,
      xl: sizes.xl,
    });
    const MockComp: React.FC = () => {
      const bp = useBreakpoint();
      return <p>{bp}</p>;
    };
    const component = render(<MockComp />);
    act(() => {
      window = Object.assign(window, { innerWidth: 600 });
      window.dispatchEvent(new Event('resize'));
    });
    expect((component.container.firstChild as HTMLElement).innerHTML).toEqual(
      's',
    );

    act(() => {
      window = Object.assign(window, { innerWidth: 1024 });
      window.dispatchEvent(new Event('resize'));
    });
    expect((component.container.firstChild as HTMLElement).innerHTML).toEqual(
      'm',
    );

    act(() => {
      window = Object.assign(window, { innerWidth: 1440 });
      window.dispatchEvent(new Event('resize'));
    });
    expect((component.container.firstChild as HTMLElement).innerHTML).toEqual(
      'l',
    );

    act(() => {
      window = Object.assign(window, { innerWidth: 1920 });
      window.dispatchEvent(new Event('resize'));
    });
    expect((component.container.firstChild as HTMLElement).innerHTML).toEqual(
      'xl',
    );
  });

  it('should sort sizes correctly', async () => {
    const sizes = {
      s: 600,
      xl: 1920,
      l: 1440,
    };
    const useBreakpoint = createBreakpoint({
      s: sizes.s,
      xl: sizes.xl,
      l: sizes.l,
    });
    const MockComp: React.FC = () => {
      const bp = useBreakpoint();
      return <p>{bp}</p>;
    };
    const component = render(<MockComp />);
    act(() => {
      window = Object.assign(window, { innerWidth: 1440 });
      window.dispatchEvent(new Event('resize'));
    });
    expect((component.container.firstChild as HTMLElement).innerHTML).toEqual(
      'l',
    );
  });

  it('should use the default breakpoint correctly', async () => {
    const useBreakpoint = createBreakpoint();
    const MockComp: React.FC = () => {
      const bp = useBreakpoint();
      return <p>{bp}</p>;
    };
    const component = render(<MockComp />);
    act(() => {
      window = Object.assign(window, { innerWidth: 1024 });
      window.dispatchEvent(new Event('resize'));
    });
    expect((component.container.firstChild as HTMLElement).innerHTML).toEqual(
      'laptop',
    );
  });
});
