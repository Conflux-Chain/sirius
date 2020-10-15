import React from 'react';
import { Tabs } from '@cfxjs/react-ui';
import { TabsProps } from '@cfxjs/react-ui/dist/tabs/tabs';
import styled from 'styled-components/macro';
import clsx from 'clsx';

const TabsComponent = ({ children, className, ...others }: TabsProps) => {
  return (
    <StyledTabsWrapper>
      <Tabs className={clsx(className, 'sirius-Tabs')} {...others}>
        {children}
      </Tabs>
    </StyledTabsWrapper>
  );
};

TabsComponent.Item = Tabs.Item;
TabsComponent.useTabsHandle = Tabs.useTabsHandle;

const StyledTabsWrapper = styled.div`
  .tabs.sirius-Tabs {
    .tab {
      .label {
        font-size: 1.1429rem;
        color: rgba(11, 19, 46, 0.6);
        line-height: 1.7143rem;
        padding: 0.5714rem 0.2857rem;
        font-weight: 500;
      }
      .nav {
        margin: 0 0.5714rem;
      }
      &.active,
      &:hover {
        .label {
          font-weight: 500;
          color: #0b132e;
        }
      }
      .bottom {
        height: 0.4286rem;
        border-top-left-radius: 0.5714rem;
        border-top-right-radius: 0.5714rem;
      }
    }
    header + .content {
      margin-top: 1.2857rem;
      padding-top: 0;
    }
  }
`;

export default TabsComponent;
