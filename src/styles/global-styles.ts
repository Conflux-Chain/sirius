import { createGlobalStyle } from 'styled-components';
import { media } from './media';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-size: 14px;
    font-weight: 400;
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #root {
    min-height: 100%;
    min-width: 100%;
    background-color: #f5f6fa;
  }

  p,
  label {
    line-height: 1.5em;
  }

  input, select {
    font-size: inherit;
  }

  ${media.s} {
    html, body {
      font-size: 12px;
    }
  }
`;
