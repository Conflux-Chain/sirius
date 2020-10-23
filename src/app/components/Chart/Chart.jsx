import React, { useRef, useEffect } from 'react';

import usePlot from './usePlot';
import createDraw from './draw';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PIXEL_RATIO } from './draw';

const RECT_HEIGHT = 40;
const RECT_WIDTH = 90;

const DURATIONS = [
  ['hour', '1H'],
  ['day', '1D'],
  ['month', '1M'],
  ['all', 'ALL'],
];
export const Chart = ({ width = 500, indicator = 'blockTime' }) => {
  const { plot, isError, setDuration, duration } = usePlot('day');
  const { t } = useTranslation();
  const small = width < 500;
  const padding = small ? 16 : 48;
  if (isError) {
    return <div>Error</div>;
  } else {
    return (
      <Container style={{ width }} small={small}>
        <Title>{t(`${indicator}.title`)}</Title>
        <Description>{t(`${indicator}.description`)}</Description>
        {true && (
          <Draw
            plot={plot}
            width={(width - padding) * 0.83}
            indicator={indicator}
            small={small}
          >
            <Buttons>
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
          </Draw>
        )}
      </Container>
    );
  }
};

function Draw({
  plot,
  indicator,
  width = 359,
  height = width * 0.55,
  small,
  children,
}) {
  const scale = width / 359;
  const containerRef = useRef(null);
  const backgroundCanvasRef = useRef(null);
  const lineCanvasRef = useRef(null);

  let TRI_HEIGHT = 5 * scale;
  let POPUP_PADDING = 12 * scale;

  let X_AXIS_HEIGHT = 38 * scale;
  let Y_AXIS_WIDTH = 45 * scale;

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
      ctxBg,
      ctxLine,
      plot,
      indicator,
    });
    if (draw) {
      draw();
      const listener = event => {
        if (xScale1) {
          const { offsetX } = event;
          cursorX = Math.round(xScale1.invert(offsetX));
          draw({
            cursorX,
          });
        }
      };
      const container = containerRef.current;
      container.addEventListener('mousemove', listener);
      return () => container.removeEventListener('mousemove', listener);
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
`;

const Title = styled.div`
  font-weight: bolder;
  font-size: 1.1429rem;
  color: black;
  line-height: 2.1429rem;
`;

const Description = styled.div`
  font-weight: bold;
  line-height: 1.2143rem;
  font-size: 0.8571rem;
  color: #4a6078;
`;

const Buttons = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: -4rem;
  top: 1rem;
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
