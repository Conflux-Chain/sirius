import 'react-helmet-async';
import React from 'react';

declare module 'react-helmet-async' {
  interface HelmetProps {
    children?: React.ReactNode;
  }
  interface ProviderProps {
    children?: React.ReactNode;
  }
}
