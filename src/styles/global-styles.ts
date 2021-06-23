import { createGlobalStyle } from 'styled-components';
import { media } from './media';
import { sansSerifFont } from './variable';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-size: 14px;
    font-weight: 400;
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${sansSerifFont};
    letter-spacing: 0;

    a {
      color: #1e3de4;
      
      &:hover, &:active {
        color: #0f23bd;
      }
    }

    p,
    label {
      line-height: 1.5em;
    }
  
    input, select {
      font-size: inherit;
    }

    pre {
      border: none;
      margin: 0;
      padding: 0;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }

  #root {
    min-height: 100%;
    min-width: 100%;
    background-color: #f5f6fa;
  }

  .qrcode-modal.wrapper {
    .content {
      margin: 0 auto;
    }
  }

  // override @jnoodle/antd styles
  .ant-select-item-option-grouped{
    padding-left: 12px;
    margin-left: 12px;
    margin-right: 12px;
  }
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    border-radius: 3px;
  }
  
  // image preview text
  .ant-image-mask-info{
    font-size: 0;
    > span {
      font-size: 12px
    }
  }
  
  .image-preview-popover {
    line-height: 1;
    .ant-popover-inner-content {
      padding: 16px;
    }
    .image-preview-name{
      margin-top: 10px;
      text-align: center;
      max-width: 200px;
      word-break: break-word;
      white-space: normal;
      line-height: 1.4;
    }
  }
  
  .ant-popover-arrow {
    box-shadow: 8px 30px 80px 0px rgba(112, 126, 158, 0.24);
  }
  
  .ant-popover-inner {
    border-radius: 5px;
    box-shadow: 8px 30px 80px 0px rgba(112, 126, 158, 0.24);
  }

  .sirius-select-dropdown.select-dropdown {
    .option {
      height: 2.1429rem;
      color: #65709a;
      background-color: #fff;
      border: none;

      &:hover {
        border: none;
        color: #65709a;
        background-color: #f1f4f6;
      }
    }
    .option.selected {
      color: #fff;
      background-color: #65709a;
      border: none;
    }

    &.currency-select {
      max-height: 7.1429rem;
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

  /* picker style reset, should be extract to a component, but need to be careful of sub component, such as Datepicker.RangePicker */
  .cfx-picker-dropdown {
    ${media.s} {
      /* special style for mobile calendar */
      left: calc(5vw) !important;
    }
    .cfx-picker-header-view {
      button:hover {
        color: #65709A;
      }
    }
    .cfx-picker-panel-container {
      border: none;
      box-shadow: 0rem 0.4286rem 1.1429rem 0rem rgba(20, 27, 50, 0.08);
    }
    .cfx-picker-cell.cfx-picker-cell-in-view.cfx-picker-cell-range-start, .cfx-picker-cell.cfx-picker-cell-in-view.cfx-picker-cell-range-end,
    .cfx-picker-cell-in-view.cfx-picker-cell-selected, .cfx-picker-cell-in-view.cfx-picker-cell-range-start, .cfx-picker-cell-in-view.cfx-picker-cell-range-end
    {
      .cfx-picker-cell-inner {
        background: #65709A;
      }
    }
    .cfx-picker-cell-in-view.cfx-picker-cell-today .cfx-picker-cell-inner, tr>.cfx-picker-cell-in-view.cfx-picker-cell-range-hover:first-child::after, tr>.cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end:first-child::after, tr>.cfx-picker-cell-in-view.cfx-picker-cell-in-range:first-child::after, tr>.cfx-picker-cell-in-view.cfx-picker-cell-range-edge-start:not(.cfx-picker-cell-range-hover-edge-end-near-range):not(.cfx-picker-cell-range-hover-end):not(.cfx-picker-cell-range-hover)::after, tr>.cfx-picker-cell-in-view.cfx-picker-cell-range-end:first-child::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-edge-start:not(.cfx-picker-cell-range-hover-edge-start-near-range)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start:not(.cfx-picker-cell-in-range):not(.cfx-picker-cell-range-start):not(.cfx-picker-cell-range-end)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end:not(.cfx-picker-cell-in-range):not(.cfx-picker-cell-range-start):not(.cfx-picker-cell-range-end)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start.cfx-picker-cell-range-start-single::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end.cfx-picker-cell-range-end-single::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover:not(.cfx-picker-cell-in-range)::after, .cfx-picker-cell-in-view.cfx-picker-cell-in-range::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-start.cfx-picker-cell-range-hover-start::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-start.cfx-picker-cell-selected::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-start:not(.cfx-picker-cell-range-start-single)::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end.cfx-picker-cell-range-hover-end::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end.cfx-picker-cell-selected::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end:not(.cfx-picker-cell-range-end-single)::before, 
    .cfx-picker-cell-in-view.cfx-picker-cell-selected .cfx-picker-cell-inner, .cfx-picker-cell-in-view.cfx-picker-cell-range-start .cfx-picker-cell-inner, .cfx-picker-cell-in-view.cfx-picker-cell-range-end .cfx-picker-cell-inner
    {
      border-color: #65709A;
    }

    .cfx-picker-panel,
    .cfx-picker-date-panel, 
    .cfx-picker-year-panel, 
    .cfx-picker-month-panel {
      width: 100%;
    }
    table.cfx-picker-content {
      width: 100%;
      table-layout: inherit;
    }
  }
  #cfx-ui-message {
    div.icon {
      display: flex;
    }
  }
}
`;
