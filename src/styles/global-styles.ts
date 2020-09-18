import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-size: 14px;
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #F5F6FA;
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
    .inner {
      font-family: CircularStd-Book, CircularStd;
      font-weight: 400;
      color: #CDCDCD;
      line-height: 11px;
      border-radius: 0;
    }
  }
`;
