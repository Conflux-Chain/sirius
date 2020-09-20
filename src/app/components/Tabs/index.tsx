import { Tabs } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import { media } from './../../../styles/media';

const TabsComponent = styled(Tabs)`
  .tab {
    .label {
      font-size: 16px;
      font-family: CircularStd-Medium, CircularStd;
      color: rgba(11, 19, 46, 0.6) !important;
      line-height: 24px;
      padding: 8px 3px;
      font-weight: 500;
    }
    .nav {
      margin: 0 8px;
    }
    &.active,
    &:hover {
      .label {
        font-weight: 500;
        color: #0b132e !important;
      }
    }
    .bottom {
      height: 6px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
  header + .content {
    padding-top: 18px;
  }

  ${media.s} {
    .tab {
      .nav {
        margin: 0 16px 0 0;
      }
      .label {
        padding: 2px 3px;
        font-size: 14px;
        line-height: 18px;
      }
      .bottom {
        height: 4px;
      }
    }
    header + .content {
      padding-top: 12px;
    }
  }
`;

export default TabsComponent;
