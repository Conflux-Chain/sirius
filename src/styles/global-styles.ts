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
      height: 2.1429rem;
      color: #65709a;
      background-color: #fff;
    }
    .option.selected {
      color: #fff;
      background-color: #65709a;
    }
  }
  .transactionModalContainer{
    .contentContainer{
      display:flex;
      flex-direction:column;
      align-items:center;
      padding-top:2.1429rem;
      .successImg{
        width:4rem;
      }
      .submitted{
        margin-top:0.9286rem;
        font-size:1rem;
        color: #282D30;
      }
      .txContainer{
        margin-top:0.8571rem;
      }
      .label{
        color: #A4A8B6;
        line-height: 1.2857rem;
        font-size: 1rem;
      }
      .content{
        color: #1e3de4;
      }
    }
  }

  ${media.s} {
    html, body {
      font-size: 12px;
    }
    .cfx-picker-dropdown {
      max-width: 90vw;
      .cfx-picker-panel-container {
        max-width: 90vw;
        .cfx-picker-month-panel {
          max-width: 90vw;
          width: 100%;
        }
      }
    }
  }

  /* to solve black line issue in Chrome */
  .skeleton::after {
    border-left: 1px solid #EFF2FA;
  }
`;
