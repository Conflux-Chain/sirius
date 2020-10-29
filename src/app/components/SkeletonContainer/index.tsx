import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton } from '@cfxjs/react-ui';

interface SkeletonContainerProps {
  children?: React.ReactNode;
  shown?: boolean;
  style?: React.CSSProperties;
}
type NativeAttrs = Omit<
  React.HTMLAttributes<any>,
  keyof SkeletonContainerProps
>;
export declare type Props = SkeletonContainerProps & NativeAttrs;
const SkeletonStyle = { display: 'flex', flex: 1, maxWidth: 'initial' };
const SkeletonContainerComp = ({ children, shown, style }: Props) => {
  return (
    <>
      {shown ? (
        <Skeleton style={{ ...SkeletonStyle, ...style }}>{children}</Skeleton>
      ) : (
        children
      )}
    </>
  );
};

SkeletonContainerComp.defaultProps = {
  shown: false,
};

SkeletonContainerComp.propTypes = {
  shown: PropTypes.bool,
};

export default SkeletonContainerComp;
