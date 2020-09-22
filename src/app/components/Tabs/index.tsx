import { Tabs } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';

const TabsComponent = styled(Tabs)`
  .tab {
    .label {
      font-size: 1.142857rem;
      font-family: CircularStd-Medium, CircularStd;
      color: rgba(11, 19, 46, 0.6);
      line-height: 1.714286rem;
      padding: 0.571429rem 0.285714rem;
      font-weight: 500;
    }
    .nav {
      margin: 0 0.571429rem;
    }
    &.active,
    &:hover {
      .label {
        font-weight: 500;
        color: #0b132e !important;
      }
    }
    .bottom {
      height: 0.428571rem;
      border-top-left-radius: 0.571429rem;
      border-top-right-radius: 0.571429rem;
    }
  }
  header + .content {
    margin-top: 1.285714rem;
    padding-top: 0;
  }
`;

export default TabsComponent;
