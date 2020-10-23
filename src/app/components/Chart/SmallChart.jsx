import React, { useEffect, useRef, useState } from 'react';
import createDraw, { PIXEL_RATIO } from './draw';
import usePlot from './usePlot';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import up from './up.svg';
import down from './down.svg';

export function SmallChart({
  width,
  height = width * 0.52,
  indicator = 'blockTime',
} = {}) {
  const { plot } = usePlot('day');
  const { t } = useTranslation();
  const [firstlast, setFirstLast] = useState(null);
  if (!plot) {
    return <Container style={{ width, height }}></Container>;
  }
  const diff = firstlast && change(...firstlast);
  const small = width < 200;
  const isDown = diff ? diff.startsWith('-') : null;

  return (
    <Container style={{ width, height }}>
      <Title>
        {t(`${indicator}.title`)}
        <Change isDown={isDown}>{diff}</Change>
      </Title>
      <Value small={small}>{firstlast && format(firstlast[1])}</Value>

      <Draw
        setFirstLast={setFirstLast}
        indicator={indicator}
        plot={plot}
        width={width * 0.7}
        height={height * 0.4}
      />
    </Container>
  );
}

function Draw({
  width,
  height,
  small,
  children,
  plot,
  indicator,
  setFirstLast,
}) {
  const backgroundCanvasRef = useRef(null);
  const lineCanvasRef = useRef(null);

  useEffect(() => {
    // if (plot.length <= 1) {
    //   return null;
    // }
    const ctxBg = backgroundCanvasRef.current.getContext('2d');
    ctxBg.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

    const ctxLine = lineCanvasRef.current.getContext('2d');
    ctxLine.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

    const { draw, first, last } = createDraw({
      width,
      height,
      ctxBg,
      ctxLine,
      plot,
      small: true,
      indicator,
    });
    if (draw) {
      draw();
    }
    setFirstLast([first, last]);
  }, [width, height, plot, indicator, setFirstLast]);
  // if (plot.length <= 1) {
  //   return null;
  // }
  return (
    <CanvasContainer small={small} style={{ width, height }}>
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
  padding: ${props => (props.small ? '8px' : '12px')};
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 12px 8px 24px -12px rgba(20, 27, 50, 0.12);
  border-radius: 5px;
  margin-top: 10px;
  position: relative;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: normal;
  color: #74798c;
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Value = styled.div`
  color: #314449;
  font-weight: bold;
  position: relative;
  z-index: 1;
  font-size: ${props => (props.small ? '18px' : '24px')};
  margin-top: ${props => (props.small ? '10%' : '0')};
`;

const Change = styled.div`
  color: #282d30;
  font-size: 12px;
  &::after {
    content: url(${({ isDown }) => (isDown ? down : up)});
    margin-left: 3px;
  }
`;

const CanvasContainer = styled.div`
  position: absolute;
  right: ${props => (props.small ? '8px' : '12px')};
  bottom: ${props => (props.small ? '8px' : '12px')};
  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

function format(v, d = 6) {
  return parseFloat(parseFloat(v).toFixed(d));
}

function change(end, start) {
  const [s, e] = [start, end].map(x => parseFloat(x));
  const diff = isNaN(format(((s - e) / s) * 100, 1))
    ? '0.0'
    : format(((s - e) / s) * 100, 1);
  return (diff > 0 ? '+' + diff : diff) + '%';
}
