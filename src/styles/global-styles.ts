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

  .siriui-tooltip-square {
    border-radius: 0 !important;
    div.inner {
      font-weight: 400;
      border-radius: 0;
      font-size: 12px;
      color: #e9e9e9;
      line-height: 1.0714rem;
      padding: 0.5714rem 0.8571rem;
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
        color: #0054FE;
      }
    }
  }

  ${media.s} {
    html, body {
      font-size: 12px;
    }
  }
`;
