import React, { useEffect, useRef } from 'react';
import loading from './loading';
export default function Loading() {
  const ref = useRef(null);
  useEffect(() => {
    return loading(ref.current);
  }, []);
  return <div ref={ref}></div>;
}
