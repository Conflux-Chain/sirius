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

  .qrcode-modal.wrapper {
    .content {
      margin: 0 auto;
    }
  }

  .sirius-select-dropdown.select-dropdown {
    .option {
      height: 30px;
      color: #65709a;
      background-color: #fff;
    }
    .option.selected {
      color: #fff;
      background-color: #65709a;
    }
  }

  ${media.s} {
    html, body {
      font-size: 12px;
    }
  }
`;
