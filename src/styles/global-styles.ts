import { createGlobalStyle } from 'styled-components';
import { media } from './media';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-size: 14px;
    font-weight: 500;
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #f5f6fa;
  }

  #root {
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }

  .siriui-tooltip-square {
    border-radius: 0 !important;
    div.inner {
      font-family: 'Circular Std';
      font-weight: 400;
      border-radius: 0;
      font-size: 0.8571rem;
      color: #E9E9E9;
      line-height: 1.0714rem;
      padding: 0.5714rem 0.8571rem;
    }
  }

  ${media.s} {
    html, body {
      font-size: 12px;
    }
  }
`;
