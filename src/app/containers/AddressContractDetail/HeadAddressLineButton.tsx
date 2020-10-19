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
    // pressed={pressed}
    // onMouseDown={() => setPressed(true)}
    // onMouseUp={() => setPressed(false)}
    >
      {children}
    </Button>
  );
}

const Button = styled.div<ButtonHTMLAttributes<HTMLDivElement>>`
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dbdde4;
  &:hover {
    background-color: #63688a;
    svg {
      fill: #fff;
    }
  }
`;
