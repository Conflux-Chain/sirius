import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import dag from './lib-dag.js';

export function Dag() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current !== null) {
      let destory = dag({ container: ref.current });
      const visibilityChange = () => {
        if (document.hidden) {
          destory();
        } else {
          destory = dag({
            container: ref.current,
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
  return <Container ref={ref}></Container>;
}

const Container = styled.div`
  width: 100%;
  height: 127px;
  margin-top: 24px;
  background-color: #eceff8;
  box-shadow: 12px 8px 24px -12px rgba(20, 27, 50, 0.12);
`;
