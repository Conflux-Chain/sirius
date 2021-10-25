import TestRenderer, { ReactTestRenderer } from 'react-test-renderer';
import { ReactElement } from 'react';

const { act } = TestRenderer;

export const sleep = (time: number) => {
  // console.log('time: ', time);
  return new Promise(resolve => setTimeout(resolve, time));
};

export const updateWrapper = async (
  wrapper: ReactTestRenderer,
  time: number = 0,
  element?: ReactElement,
) => {
  await act(async () => {
    await sleep(time);
    // @ts-ignore
    wrapper.update(element);
  });
};
