import React from 'react';
import styled from 'styled-components';

import '@google/model-viewer';

export const ThreeD = ({ url = '' }) => {
  return (
    <Container>
      {/* @ts-ignore */}
      <model-viewer
        alt="Neil Armstrong's Spacesuit from the Smithsonian Digitization Programs Office and National Air and Space Museum"
        src={url}
        // poster="https://vbs-staging.oss-cn-beijing.aliyuncs.com/pattern/thumbnail1024/prop_mask_004_ue_1024.png?versionid=CAEQKRiBgMCc0Jf.oxgiIDU2MGY0Nzc3ZjBjYjRkYmQ4MjdhNzFlMDk5ZWQ3ZjQ1"
        shadow-intensity="1"
        camera-controls
        touch-action="pan-y"
        // @ts-ignore
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
        }}
        // @ts-ignore
      ></model-viewer>
      {/* @ts-ignore */}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 100%;
`;
