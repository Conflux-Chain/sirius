/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name HeadAddressLineButton.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */

import React, { ButtonHTMLAttributes, useState } from 'react';
import styled from 'styled-components';

export function HeadAddressLineButton({ children }) {
  const [pressed, setPressed] = useState<boolean>(false);
  return (
    <Button
      pressed={pressed}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {children}
    </Button>
  );
}

const Button = styled.div<
  ButtonHTMLAttributes<HTMLDivElement> & { pressed: boolean }
>`
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  background-color: ${props => (props.pressed ? '#63688a' : '#dbdde4')};
`;
