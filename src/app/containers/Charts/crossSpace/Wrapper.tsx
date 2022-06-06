import React from 'react';
import { Wrapper as CommonWrapper } from '../common/Wrapper';

export const Wrapper = ({ children, ...props }) =>
  React.createElement(
    CommonWrapper,
    // @ts-ignore
    {
      ...props,
      path: 'cross-space-charts',
      type: 'crossSpace',
    },
    children,
  );
