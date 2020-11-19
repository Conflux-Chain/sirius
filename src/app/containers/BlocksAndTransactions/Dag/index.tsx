import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import dag from './lib';

export function Dag() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current !== null) {
      const { width, height } = ref.current.getBoundingClientRect();
      let destory = dag({ container: ref.current, width, height });
      const visibilityChange = () => {
        if (document.hidden) {
          destory();
        } else {
          destory = dag({
            container: ref.current,
            width: 1024,
            height: 126,
          });
        }
      };
      document.addEventListener('visibilitychange', visibilityChange);
      return () => {
        destory();
        document.removeEventListener('visibilitychange', visibilityChange);
      };
    }
  }, []);
  return <Container ref={ref}>DAG</Container>;
}

const Container = styled.div`
  width: 100%;
  height: 126px;
  margin-top: 24px;
  background-color: #eceff8;
  box-shadow: 12px 8px 24px -12px rgba(20, 27, 50, 0.12);
`;
