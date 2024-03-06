import React from 'react';

declare module 'recoil' {
  interface RecoilRootProps {
    children?: React.ReactNode;
  }
}
