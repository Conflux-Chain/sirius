import { createGlobalStyle } from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import {
  sansSerifFont,
  monospaceFont,
  blue0,
  blue1,
  blue2,
  blue3,
  blue4,
  gray0,
  gray1,
  gray2,
  gray3,
  gray4,
  orange0,
  black0,
} from './variable';

export const GlobalStyle = createGlobalStyle`

  body {
    --theme-color-blue0: #141414;
    --theme-color-blue1: ${blue1};
    --theme-color-blue2: ${blue2};
    --theme-color-blue3: ${blue3};
    --theme-color-blue4: ${blue4};
    --theme-color-gray0: ${gray0};
    --theme-color-gray1: ${gray1};
    --theme-color-gray2: ${gray2};
    --theme-color-gray3: ${gray3};
    --theme-color-gray4: ${gray4};
    --theme-color-green2: #7789D3;
    --theme-color-orange0: ${orange0};
    --theme-color-black0: ${black0};
    --theme-color-primary: #60BBF9;
    --theme-color-highlight-bg: rgba(96, 187, 249, 0.06);
    --theme-color-primary-button-bg: #7789D3;
    --theme-color-button-bg: rgba(0, 84, 254, 0.8);
    --theme-color-outline: #7789D3;
    --theme-color-shadow: rgba(30, 61, 228, 0.2);
    --theme-color-search-button-bg: #7789D3;
    --theme-color-search-button-hover-bg: #4665f0;
    --theme-color-gas-price-line-bg: #f0f4f3;
    --theme-color-foot-bg: #0A0A0A;
    --theme-color-foot-highlight: #7789D3;
    --theme-color-link: #1e3de4;
    --theme-color-link-hover: #0f23bd;
    --theme-color-chart-title: #7789D3;
    --theme-color-chart-link: #1e3de4;
    --theme-monospace-font: ${monospaceFont};
  }

  html,
  body {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    height: 100%;
    width: 100%;
    background-color: #000 !important;
  }

  body {
    font-family: ${sansSerifFont};
    letter-spacing: 0;

    a {
      color: #60BBF9;

      &:hover, &:active {
        color: #60BBF9 !important;
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
      font-family: ${monospaceFont};
    }
  }

  #root {
    min-height: 100%;
    min-width: 100%;
    background-color: #000;
  }

  .sirius-card {
    border: 1px solid rgba(255, 255, 255, 0.10);
    background-color: transparent;
  }

  .description {
    border-bottom-width: 0;
    .left {
      color: rgba(255, 255, 255, 0.50);
    }
    .right {
      color: #FAFAFA;
    }
  }

  .ant-table {
    color: #FAFAFA;
    background-color: #000;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    padding: 0;
    .ant-table-title {
      color: rgba(255, 255, 255, 0.50);
      padding: 12px 16px;
      border-radius: 8px 8px 0 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.10);
      background: #141414;
    }
    .ant-table-footer {
      color: #FAFAFA;
      border-radius: 0 0 2px 2px;
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.10);
      background-color: transparent;
    }
    .ant-table-tbody > tr:not([aria-hidden='true']):nth-child(odd), .ant-table-thead > tr > th {
      background-color: #000;
    }
    .ant-table-thead > tr > th {
      rgba(255, 255, 255, 0.50)
    }
    .ant-table-tbody > tr:hover, .ant-table-tbody > tr:hover > td.ant-table-cell {
      background: rgba(255, 255, 255, 0.06);
    }
    .empty .text-\\#4b4b4b, .empty .text-\\#000 {
      color: #FAFAFA;
    }
  }

  .ant-picker, .ant-input-affix-wrapper, .ant-input, .ant-form-item-has-error .ant-input:not(.ant-input-disabled), .ant-form-item-has-error .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled), .ant-form-item-has-error .ant-input:not(.ant-input-disabled):hover, .ant-form-item-has-error .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover, .ant-input-group-addon .ant-select.ant-select-single:not(.ant-select-customize-input) .ant-select-selector, .ant-form-item-has-error .ant-input-group-addon .ant-select.ant-select-single:not(.ant-select-customize-input) .ant-select-selector  {
    background-color: #000;
    color: #FAFAFA;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 9999s ease-in-out 0s;
    -webkit-text-fill-color: #fff;
    -webkit-box-shadow: 0 0 0 1000px #000 inset;
    caret-color: #fff;
  }
  .ant-input-group-addon, .ant-picker, .ant-input-affix-wrapper, .ant-input, .ant-input-group-addon .ant-select.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    border: 1px solid rgba(255, 255, 255, 0.10);
  }
  .ant-input-group-addon {
    background-color: transparent;
  }
  .ant-select-arrow {
    color: #FFFFFF80;
  }

  body {
    .bg-\\#EFF2FA {
      background-color: #141414;
      &::after {
        background-color: #000;
        background-image: unset;
        border: none;
      }
    }
    .ant-btn.ant-btn-primary {
      box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.04);
      background-color: #FAFAFA;
      color: #000;
      &:hover {
        background-color: #FAFAFA;
      }
    }
    .ant-btn {
      border-radius: 16px;
      border: 1px solid #ffffff1a;
      background-color: #000;
      color: #FAFAFA;
      &:hover {
        background-color: #ffffff0f;
        border: 1px solid #ffffff1a;
      }
    }
    .ant-collapse-content {
      color: #fafafa;
      background-color: #000;
      border-top: 1px solid rgba(255, 255, 255, 0.10);
    }
    .btn.btnComp {
      border: 1px solid #ffffff1a;
      background-color: #000;
      color: #FAFAFA;
      &:hover {
        background-color: #ffffff0f;
        border: 1px solid #ffffff1a;
      }
    }
    .option-container.bg-\\#fff {
      border-radius: 14px;
      background: linear-gradient(180deg, rgba(57, 57, 57, 0.14) 0%, rgba(0, 0, 0, 0.10) 20%, rgba(0, 0, 0, 0.10) 50%, rgba(69, 69, 69, 0.15) 100%);
      box-shadow: 0 2px 2px -2px rgba(255, 255, 255, 0.50) inset, 0 -2px 2px -2px rgba(255, 255, 255, 0.70) inset, 0 0 0 1px rgba(0, 0, 0, 0.10) inset, -1px 0 0 0 rgba(0, 0, 0, 0.15), 1px 0 0 0 rgba(0, 0, 0, 0.15), 0 -1px 0 0 rgba(0, 0, 0, 0.07), 0 1px 0 0 rgba(0, 0, 0, 0.07), 0 18px 44px -14px rgba(0, 0, 0, 0.80) !important;
      backdrop-filter: blur(14px);
      padding: 6px;
      .opt {
        padding: 0 10px;
        color: #FAFAFA;
        border-radius: 8px;
        &:hover {
          background: rgba(255, 255, 255, 0.06);
        }
      }
    }
    .ant-select-dropdown {
      border-radius: 14px;
      background: linear-gradient(180deg, rgba(57, 57, 57, 0.14) 0%, rgba(0, 0, 0, 0.10) 20%, rgba(0, 0, 0, 0.10) 50%, rgba(69, 69, 69, 0.15) 100%);
      box-shadow: 0 2px 2px -2px rgba(255, 255, 255, 0.50) inset, 0 -2px 2px -2px rgba(255, 255, 255, 0.70) inset, 0 0 0 1px rgba(0, 0, 0, 0.10) inset, -1px 0 0 0 rgba(0, 0, 0, 0.15), 1px 0 0 0 rgba(0, 0, 0, 0.15), 0 -1px 0 0 rgba(0, 0, 0, 0.07), 0 1px 0 0 rgba(0, 0, 0, 0.07), 0 18px 44px -14px rgba(0, 0, 0, 0.80);
      backdrop-filter: blur(14px);
      padding: 6px;
      .rc-virtual-list-holder-inner {
        gap: 2px;
      }
    }
    .ant-select-item-option {
      padding: 0 10px;
      border-radius: 8px;
      color: #fafafa;
      background-color: transparent;
      display: flex;
      align-items: center;
      &:hover {
        background: rgba(255, 255, 255, 0.06);
      }
    }
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled),.ant-select-item-option-active:not(.ant-select-item-option-disabled), .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
      color: #fafafa;
      background-color: #141414;
      background: rgba(255, 255, 255, 0.06);
    }
    .ant-popover-inner {
      border-radius: 14px;
      background: linear-gradient(180deg, rgba(57, 57, 57, 0.14) 0%, rgba(0, 0, 0, 0.10) 20%, rgba(0, 0, 0, 0.10) 50%, rgba(69, 69, 69, 0.15) 100%);
      box-shadow: 0 2px 2px -2px rgba(255, 255, 255, 0.50) inset, 0 -2px 2px -2px rgba(255, 255, 255, 0.70) inset, 0 0 0 1px rgba(0, 0, 0, 0.10) inset, -1px 0 0 0 rgba(0, 0, 0, 0.15), 1px 0 0 0 rgba(0, 0, 0, 0.15), 0 -1px 0 0 rgba(0, 0, 0, 0.07), 0 1px 0 0 rgba(0, 0, 0, 0.07), 0 18px 44px -14px rgba(0, 0, 0, 0.80);
      backdrop-filter: blur(14px);
      color: #fafafa;
    }
    .ant-popover-inner-content {
      color: #fafafa;
    }
    .ant-popover .ant-popover-content > .ant-popover-arrow {
      border-left-color: #7D7D7D;
      border-right-color: #7D7D7D;
      border-top-color: #7D7D7D;
      border-bottom-color: #7D7D7D;
    }
    .ant-modal {
      color: #FAFAFA;
    }
    .ant-modal-content {
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.10);
      background: #141414;
      .ant-divider {
        border-top: 1px solid rgba(255, 255, 255, 0.10);
      }
    }
    .ant-modal-close {
      color: #FFFFFF80;
    }
    tr.ant-table-expanded-row > td, tr.ant-table-expanded-row:hover > td, .ant-table .ant-table-tbody > tr:hover {
      background: transparent;
    }

    .notification.visible {
      border-radius: 14px;
      background: linear-gradient(180deg, rgba(57, 57, 57, 0.14) 0%, rgba(0, 0, 0, 0.10) 20%, rgba(0, 0, 0, 0.10) 50%, rgba(69, 69, 69, 0.15) 100%);
      box-shadow: 0 2px 2px -2px rgba(255, 255, 255, 0.50) inset, 0 -2px 2px -2px rgba(255, 255, 255, 0.70) inset, 0 0 0 1px rgba(0, 0, 0, 0.10) inset, -1px 0 0 0 rgba(0, 0, 0, 0.15), 1px 0 0 0 rgba(0, 0, 0, 0.15), 0 -1px 0 0 rgba(0, 0, 0, 0.07), 0 1px 0 0 rgba(0, 0, 0, 0.07), 0 18px 44px -14px rgba(0, 0, 0, 0.80);
      backdrop-filter: blur(14px);
      color: #fafafa;
      .title {
        color: #fafafa;
      }
      .content {
        color: #fafafa;
      }
      .ant-collapse > .ant-collapse-item > .ant-collapse-header {
        color: #fafafa;
      }
    }

    // sirius-next select ui
    .bg-\\[\\#FFF\\].shadow-md {
      border-radius: 14px;
      background: linear-gradient(180deg, rgba(57, 57, 57, 0.14) 0%, rgba(0, 0, 0, 0.10) 20%, rgba(0, 0, 0, 0.10) 50%, rgba(69, 69, 69, 0.15) 100%);
      box-shadow: 0 2px 2px -2px rgba(255, 255, 255, 0.50) inset, 0 -2px 2px -2px rgba(255, 255, 255, 0.70) inset, 0 0 0 1px rgba(0, 0, 0, 0.10) inset, -1px 0 0 0 rgba(0, 0, 0, 0.15), 1px 0 0 0 rgba(0, 0, 0, 0.15), 0 -1px 0 0 rgba(0, 0, 0, 0.07), 0 1px 0 0 rgba(0, 0, 0, 0.07), 0 18px 44px -14px rgba(0, 0, 0, 0.80);
      backdrop-filter: blur(14px);
      padding: 6px;
      // sirius-next select item ui
      .bg-\\[\\#FFF\\] {
        background: transparent;
        padding: 0 10px;
        border-radius: 8px;
        color: #fafafa;
        &:hover {
          background: rgba(255, 255, 255, 0.06);
        }
      }
    }

    // sirius-next switch ui
    .sirius-switch {
      border: 1px solid rgba(255, 255, 255, 0.10);
      background: #141414;
      // open
      &.bg-\\[var\\(--theme-color-link\\)\\] {
        background: #60BBF9;
      }
    }

    // hide abi warning in sirius-next trace view
    .mt-1\\.4286rem.text-\\#9b9eac {
      display: none;
    }
  }

  .qrcode-modal.wrapper {
    .content {
      margin: 0 auto;
    }
  }

  // override @cfxjs/antd styles
  .ant-tag > .sirius-next-tooltip + .anticon {
    margin-left: 7px;
  }
  .ant-tag-rtl.ant-tag > .sirius-next-tooltip + .anticon {
    margin-right: 7px;
    margin-left: 0;
  }
  .ant-select-item-option-grouped {
    padding-left: 12px;
    margin-left: 12px;
    margin-right: 12px;
  }

  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    border-radius: 3px;

  }

  .ant-select-selection-item {
    color: #333333;
  }

  // image preview text
  .ant-image-mask-info {
    font-size: 0;

    > span {
      font-size: 12px
    }
  }

  // .ant-pagination-next, .ant-pagination-prev {
  //   button.ant-pagination-item-link {
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     background-color: rgba(0,84,254,0.04); 
  //     color: #74798c;
  //     border-color: rgba(0,84,254,0.04);
  //   }
  // }
  //
  // .ant-pagination-item, .ant-select:not(.ant-select-customize-input) .ant-select-selector, .ant-pagination-options-quick-jumper input {
  //   background-color: rgba(0,84,254,0.04); 
  //   color: #74798c;
  //   border-color: rgba(0,84,254,0.04);
  // }
  //
  .ant-table .ant-table-expanded-row-fixed {
    max-width: 100%;
  }

  .ant-pagination-disabled .ant-pagination-item-link, .ant-pagination-disabled:hover .ant-pagination-item-link, .ant-pagination-disabled:focus-visible .ant-pagination-item-link, .ant-pagination-item, .ant-pagination-jump-next, .ant-pagination-jump-prev, .ant-pagination-next, .ant-pagination-prev {
    border: 1px solid rgba(255, 255, 255, 0.10);
    a, .ant-pagination-item-ellipsis, .ant-pagination-item-container .ant-pagination-item-link-icon, .ant-pagination-item-link {
      color: rgba(255, 255, 255, 0.50) !important;
    }
  }
  .ant-pagination-item:focus-visible, .ant-pagination-item:hover {
    border: 1px solid rgba(255, 255, 255, 0.10);
  }
  .ant-pagination-item-active, .ant-pagination-item-active:hover {
    border: none;
    background-color: #FAFAFA;

    a {
      color: #000 !important;
    }
  }
  .ant-select-single, .ant-select-single.ant-select-open {
    .ant-select-selection-item {
      color: #FAFAFA;
    }
  }
  .ant-pagination-options-quick-jumper {
    color: #FAFAFA;
    input {
      border: 1px solid rgba(255, 255, 255, 0.10);
      color: #FAFAFA;
    }
  }
  .ant-pagination-options-quick-jumper input:focus, .ant-pagination-options-quick-jumper input-focused {
    border: 1px solid rgba(255, 255, 255, 0.10);
    color: #FAFAFA;
  }

  //
  //.ant-pagination-options-quick-jumper {
  //  input {
  //    margin-right: 0;
  //  }
  //}
  //
  .ant-table-pagination.ant-pagination {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .ant-picker-panels {
    ${media.s} {
      flex-direction: column;
    }
  }

  ${media.s} {
    //.ant-pagination-total-text {
    //  width: 100%;
    //  text-align: right;
    //}
    .ant-pagination-options {
      display: inherit;
    }
  }


  //.ant-table-thead > tr > th:not(:first-child, :last-child), .ant-table-tbody > tr > td:not(:first-child, :last-child), .ant-table tfoot > tr > th:not(:first-child, :last-child), .ant-table tfoot > tr > td:not(:first-child, :last-child) {
  //  padding: 16px 8px;
  //}
  //
  //.ant-table-thead > tr > th:last-child.ant-table-column-has-sorters {
  //  padding: 16px 8px;
  //}
  //
  //.ant-table-column-sorters {
  //  display: flex;
  //  align-items: center;
  //  padding: 0;
  //  width: 100%;
  //  justify-content: flex-end;
  //
  //  .ant-table-column-sorter {
  //    margin-top: -0.4em;
  //  }
  //}
  //
  //.ant-table-footer {
  //  background-color: #ffffff;
  //  border-top: 1px solid #f0f0f0;
  //  padding-bottom: 0;
  //}
  //
  //.ant-table-thead {
  //  & > tr > th {
  //    color: rgb(155, 158, 172);
  //    white-space: nowrap;
  //    background-color: #ffffff;
  //    border-bottom: none;
  //
  //    &.ant-table-column-sort {
  //      background: inherit;
  //    }
  //
  //    & > td {
  //      border: none;
  //    }
  //  }
  //}
  //
  //.ant-table-tbody > tr {
  //  td.ant-table-cell {
  //    border: none;
  //  }
  //
  //  td.ant-table-column-sort {
  //    background: inherit;
  //  }
  //
  //  &:not(:nth-child(odd)) {
  //    background-color: #f9fafb;
  //  }
  //
  //  &:hover {
  //    background-color: #f0f5ff;
  //
  //    td.ant-table-cell{
  //      background-color: #f0f5ff;
  //    }
  //  }
  //}
  //

  .ant-table-title {
    padding: 16px 0;
  }

  .ant-table-column-sorter {
    margin-left: 5px;
  }

  td.ant-table-column-sort {
    background: inherit;
  }

  .ant-table-empty {
    .ant-table-tbody > tr:hover {
      background-color: transparent;
    }
  }

  .ant-picker-separator {
    display: inline-flex;
  }

  ul li:before {
    content: '' !important;
  }

  .image-preview-popover {
    line-height: 1;

    .ant-popover-inner-content {
      padding: 16px;
    }

    .info-name {
      display: flex;
      justify-content: space-between;
      margin-top: 0.8571rem;

      .name {
        height: 18px;
        min-width: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  /* ---------- ant design popover, start ---------- */
  .ant-popover-arrow {
    box-shadow: 8px 30px 80px 0px rgba(112, 126, 158, 0.24);
  }

  .ant-popover-inner {
    border-radius: 5px;
    box-shadow: 8px 30px 80px 0px rgba(112, 126, 158, 0.24);
  }

  /* ---------- ant design popover, end ---------- */

  /* ---------- ant design button, start ---------- */
  .ant-btn {
    background: rgba(0, 84, 254, 0.04);
    color: #424A71;
    border: none;

    &:hover, &:focus, &:active {
      background: rgba(0, 84, 254, 0.1);
      color: #424A71;
    }
  }

  .ant-btn.ant-btn-primary {
    background-color: var(--theme-color-blue0);
    color: #ffffff;


  }

  .ant-btn {
    &:hover {
      background: #4665f0;
      color: #ffffff;
    }

    &[disabled] {
      background-color: var(--theme-color-gray3);
      color: var(--theme-color-gray2);

      &:hover {
        background-color: var(--theme-color-gray0);
        color: var(--theme-color-gray2);
      }
    }
  }

  /* ---------- ant design button, end ---------- */

  /* ---------- ant design form, start ---------- */
  .ant-row.ant-form-item {
    margin-bottom: 12px;

    .ant-select-selection-item {
      text-align: left;
    }

    .ant-form-item-label > label {
      color: #74798c;
    }

    .ant-select-selection-placeholder {
      color: #d8d8d8;
    }
  }

  .ant-tooltip {
    a {
      color: var(--theme-color-blue0);

      &:hover {
        color: var(--theme-color-blue2);
      }
    }
  }

  div.ant-message-custom-content {
    display: flex;
    align-items: center;

    .anticon {
      top: 0;
    }
  }

  /* ---------- ant design form, end ---------- */

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
      background-color: var(--theme-color-blue0);
      border: none;
    }

    &.currency-select {
      max-height: 7.1429rem;
    }

    &.dropdown {
      .option.selected {
        display: none;
      }
    }
  }

  .transactionModalContainer {
    .contentContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 2.1429rem;

      .successImg {
        width: 4rem;
      }

      .submitted {
        margin-top: 0.9286rem;
        font-size: 1rem;
        color: #282D30;
      }

      .txContainer {
        margin-top: 0.8571rem;
      }

      .label {
        color: #A4A8B6;
        line-height: 1.2857rem;
        font-size: 1rem;
      }

      .content {
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
    .cfx-picker-cell-in-view.cfx-picker-cell-selected, .cfx-picker-cell-in-view.cfx-picker-cell-range-start, .cfx-picker-cell-in-view.cfx-picker-cell-range-end {
      .cfx-picker-cell-inner {
        background: #65709A;
      }
    }

    .cfx-picker-cell-in-view.cfx-picker-cell-today .cfx-picker-cell-inner, tr > .cfx-picker-cell-in-view.cfx-picker-cell-range-hover:first-child::after, tr > .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end:first-child::after, tr > .cfx-picker-cell-in-view.cfx-picker-cell-in-range:first-child::after, tr > .cfx-picker-cell-in-view.cfx-picker-cell-range-edge-start:not(.cfx-picker-cell-range-hover-edge-end-near-range):not(.cfx-picker-cell-range-hover-end):not(.cfx-picker-cell-range-hover)::after, tr > .cfx-picker-cell-in-view.cfx-picker-cell-range-end:first-child::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-edge-start:not(.cfx-picker-cell-range-hover-edge-start-near-range)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start:not(.cfx-picker-cell-in-range):not(.cfx-picker-cell-range-start):not(.cfx-picker-cell-range-end)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end:not(.cfx-picker-cell-in-range):not(.cfx-picker-cell-range-start):not(.cfx-picker-cell-range-end)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start.cfx-picker-cell-range-start-single::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end.cfx-picker-cell-range-end-single::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover:not(.cfx-picker-cell-in-range)::after, .cfx-picker-cell-in-view.cfx-picker-cell-in-range::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-start.cfx-picker-cell-range-hover-start::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-start.cfx-picker-cell-selected::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-start:not(.cfx-picker-cell-range-start-single)::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end.cfx-picker-cell-range-hover-end::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end.cfx-picker-cell-selected::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end:not(.cfx-picker-cell-range-end-single)::before,
    .cfx-picker-cell-in-view.cfx-picker-cell-selected .cfx-picker-cell-inner, .cfx-picker-cell-in-view.cfx-picker-cell-range-start .cfx-picker-cell-inner, .cfx-picker-cell-in-view.cfx-picker-cell-range-end .cfx-picker-cell-inner {
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

  #cfx-ui-notification {
    .ant-collapse-header, .ant-collapse-content-box {
      padding: 2px 2px 0 0px !important;
      color: #999;
      display: flex;
      align-items: center;
    }

    .ant-collapse-header {
      margin-left: -2px;
    }
  }


  ul.highcharts-menu {
    padding: 0 !important;

    li.highcharts-menu-item {
      margin-bottom: 0;
    }
  }
`;
