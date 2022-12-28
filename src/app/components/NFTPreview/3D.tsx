import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
// @ts-ignore
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense } from 'react';
import styled from 'styled-components';
import { Skeleton } from '@cfxjs/antd';

export const ThreeD = ({ url = '' }) => {
  const gltf = useLoader(GLTFLoader, url);

  return (
    <Container>
      <Skeleton.Image />
      <Canvas
        frameloop="demand"
        className="3d-canvas"
        style={{
          position: 'absolute',
          top: '0',
          background: '#FFFFFF',
        }}
      >
        <Suspense fallback={null}>
          <primitive object={gltf.scene} scale={1} />
          <OrbitControls />
          {/* <Environment preset="studio" background /> */}
        </Suspense>
      </Canvas>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
`;
