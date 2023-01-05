import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default function Scene({ url }) {
  const fbx = useLoader(FBXLoader, url);

  return (
    <Suspense fallback={null}>
      <primitive object={fbx} scale={0.005} />
    </Suspense>
  );
}
