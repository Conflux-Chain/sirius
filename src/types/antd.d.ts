import '@cfxjs/antd';
import React from 'react';

declare module '@cfxjs/antd' {
  interface SpinProps {
    children?: React.ReactNode;
  }
  interface ModalProps {
    children?: React.ReactNode;
  }
  interface CollapseProps {
    children?: React.ReactNode;
  }
  interface CollapsePanelProps {
    children?: React.ReactNode;
  }
  interface DropDownProps {
    children?: React.ReactNode;
  }
  interface BreadcrumbProps {
    children?: React.ReactNode;
  }
  interface BreadcrumbItemProps {
    children?: React.ReactNode;
  }
}
