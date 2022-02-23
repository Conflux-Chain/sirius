import React, { useRef, useEffect } from 'react';

import usePlot from './usePlot';
import createDraw from './draw';
import { Loading } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PIXEL_RATIO } from './draw';

const RECT_HEIGHT = 40;
const RECT_WIDTH = 100;

const DURATIONS = [
  ['hour', '1H'],
  ['day', '1D'],
  ['month', '1M'],
  // ['all', 'ALL'],
];

export const Chart = ({ width = 500, indicator = 'blockTime' }) => {
  const { t } = useTranslation();
  const clientWidth = document.body.clientWidth;
  const small = width < 500;
  const padding = small ? 16 : 48;
  // get the max x grids which most suitable chart width
  let NUM_X_GRID = Math.floor(Math.min(clientWidth, 1024) / 50);
  if (NUM_X_GRID < 7) NUM_X_GRID = 7;
  if (small) NUM_X_GRID = 6;

  const {
    plot,
    isError,
    isLoading,
    setDuration,
    duration,
    axisFormat,
    popupFormat,
  } = usePlot('day', NUM_X_GRID);
  if (isError) {
    return <div>Error</div>;
  } else {
    return (
      <Container style={{ width }} small={small}>
        <Title>{t(`charts.${indicator}.title`)}</Title>
        <Description>{t(`charts.${indicator}.description`)}</Description>
        {isLoading ? (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        ) : null}
        <Draw
          plot={plot}
          width={width - padding - (small ? 50 : 70)}
          indicator={indicator}
          small={small}
          format={[popupFormat, axisFormat]}
          numXGrid={NUM_X_GRID}
        />
        <Buttons small={small}>
          {DURATIONS.map(([d, key]) => (
            <Button
              key={key}
              small={small}
              active={d === duration}
              onClick={() => setDuration(d)}
            >
              {key}
            </Button>
          ))}
        </Buttons>
      </Container>
    );
  }
};

function Draw({
  plot,
  indicator,
  width = 359,
  height = width * 0.35,
  small,
  children,
  format: [popupFormat, axisFormat],
  numXGrid,
}) {
  if (small) height = width * 0.4;
  // const scale = width / 359;
  const containerRef = useRef(null);
  const backgroundCanvasRef = useRef(null);
  const lineCanvasRef = useRef(null);

  let TRI_HEIGHT = 10;
  let POPUP_PADDING = 20;

  let X_AXIS_HEIGHT = small ? 40 : 50;
  let Y_AXIS_WIDTH = small ? 40 : 70;

  useEffect(() => {
    let cursorX;
    const ctxBg = backgroundCanvasRef.current.getContext('2d');
    ctxBg.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

    const ctxLine = lineCanvasRef.current.getContext('2d');
    ctxLine.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

    const { xScale1, draw } = createDraw({
      TRI_HEIGHT,
      POPUP_PADDING,
      RECT_WIDTH,
      RECT_HEIGHT,
      Y_AXIS_WIDTH,
      X_AXIS_HEIGHT,
      width,
      height,
      popupFormat,
      axisFormat,
      ctxBg,
      ctxLine,
      plot,
      indicator,
      NUM_X_GRID: numXGrid,
    });
    if (draw) {
      draw();
      draw();
      const movelistener = event => {
        if (xScale1) {
          const { offsetX } = event;
          cursorX = Math.round(xScale1.invert(offsetX));
          draw({
            cursorX,
          });
        }
      };
      const leaveListener = event => {
        draw();
      };
      const container = containerRef.current;
      container.addEventListener('mousemove', movelistener);
      container.addEventListener('mouseleave', leaveListener);
      return () => {
        container.removeEventListener('mousemove', movelistener);
        container.removeEventListener('mouseleave', leaveListener);
      };
    }
  }, [
    height,
    indicator,
    plot,
    width,
    TRI_HEIGHT,
    X_AXIS_HEIGHT,
    Y_AXIS_WIDTH,
    POPUP_PADDING,
    popupFormat,
    axisFormat,
    numXGrid,
  ]);

  return (
    <CanvasContainer small={small} ref={containerRef} style={{ width, height }}>
      <canvas
        ref={backgroundCanvasRef}
        style={{ width, height }}
        width={width * PIXEL_RATIO}
        height={height * PIXEL_RATIO}
      />
      <canvas
        ref={lineCanvasRef}
        style={{ width, height }}
        width={width * PIXEL_RATIO}
        height={height * PIXEL_RATIO}
      />
      {children}
    </CanvasContainer>
  );
}

const Container = styled.div`
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  padding: ${props => (props.small ? '8px' : '24px')};
  box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
  border-radius: 5px;
  min-height: ${props => (props.small ? '200px' : '250px')};
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: calc(50% - 30px);
  width: 40px;
  height: 40px;
  left: calc(50% - 20px);
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.1429rem;
  color: black;
  line-height: 2.1429rem;
`;

const Description = styled.div`
  font-weight: bold;
  line-height: 1.2143rem;
  font-size: 0.8571rem;
  color: #4a6078;
  font-weight: 500;
`;

const Buttons = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 1.5rem;
  top: ${props => (props.small ? '1.5rem' : '5rem')};
  box-sizing: content-box;
`;

const Button = styled.button`
  cursor: pointer;
  width: ${props => (props.small ? '27px' : '32px')};
  height: ${props => (props.small ? '16px' : '20px')};
  border: 1px solid rgba(59, 85, 145, 0.2);
  color: #3b5591;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7143rem;
  margin-bottom: 0.5714rem;
  background: ${props => (props.active ? 'rgba(59, 85, 145, 0.2)' : '#ffffff')};
  box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(6, 6, 8, 0.12);
  border-radius: 0.2857rem;
`;

const CanvasContainer = styled.div`
  position: relative;
  margin-left: ${props => (props.small ? 0 : '1.7143rem')};
  margin-top: 0.7857rem;
  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
`;
