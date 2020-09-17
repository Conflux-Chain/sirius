import { Tabs } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';

const TabsComponent = styled(Tabs)`
  .tab {
    .label {
      font-size: 16px;
      font-family: CircularStd-Medium, CircularStd;
      font-weight: normal;
      color: rgba(11, 19, 46, 0.6);
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
      transform: scale(1);
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
  header + .content {
    margin-top: 18px;
  }
`;

export default TabsComponent;
