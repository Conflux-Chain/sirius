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
    div.inner {
      font-family: CircularStd-Book, CircularStd;
      font-weight: 400;
      border-radius: 0;
      font-size: 12px;
      color: #E9E9E9;
      line-height: 15px;
      padding: 8px 12px;
    }
  }
`;
