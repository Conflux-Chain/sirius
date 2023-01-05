import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default function Scene({ url }) {
  const obj = useLoader(OBJLoader, url);

  return (
    <Suspense fallback={null}>
      <primitive object={obj} scale={0.4} />
    </Suspense>
  );
}
