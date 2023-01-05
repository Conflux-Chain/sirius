import React from 'react';
import { Canvas } from '@react-three/fiber';
// @ts-ignore
import { OrbitControls } from '@react-three/drei';
import styled from 'styled-components';
import { Skeleton, Image } from '@cfxjs/antd';
import ErrorBoundary from '../ErrorBoundary';
import Scene from './scene';
import NotFoundIcon from 'images/token/tokenIdNotFound.jpg';

const NotFound = () => {
  return (
    <Image
      width={500}
      height={'auto'}
      src={NotFoundIcon}
      alt={'not found'}
      preview={false}
    />
  );
};

export const ThreeD = ({ url = '', type }) => {
  return (
    <Container>
      {/* @ts-ignore */}
      <ErrorBoundary message={<NotFound />}>
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
          <Scene url={url} type={type}></Scene>
          <OrbitControls />
          <ambientLight intensity={0.1} />
          <directionalLight color="#FFFFFF" position={[0, 0, 5]} />
        </Canvas>
      </ErrorBoundary>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
`;
