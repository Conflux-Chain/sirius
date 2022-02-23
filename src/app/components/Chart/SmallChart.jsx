import React, { useEffect, useRef, useState } from 'react';
import createDraw, { PIXEL_RATIO } from './draw';
import usePlot from './usePlot';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import up from './up.svg';
import down from './down.svg';
import flat from './flat.svg';
import { formatNumber } from 'utils';
import { Tooltip } from '../Tooltip';
import lodash from 'lodash';

export const SmallChart = ({
  width = document.body.clientWidth,
  height = width * 0.39,
  indicator = 'blockTime',
  plain = false,
} = {}) => {
  const small = width < 300;

  const { plot } = usePlot('hour');
  const { t } = useTranslation();
  const [firstlast, setFirstLast] = useState(null);

  height = Math.min(height, 124);

  if (!plot) {
    return <>--</>;
  }
  const diff = firstlast && change(...firstlast);
  const trend = diff
    ? diff.startsWith('-')
      ? 'down'
      : diff === '0%'
      ? 'flat'
      : 'up'
    : null;

  if (plain) {
    let data;

    try {
      data = formatNumber(plot[plot.length - 1][indicator]);
    } catch (e) {}

    return lodash.isNil(data) ? (
      <>--</>
    ) : (
      <div>{data + (indicator === 'blockTime' ? 's' : '')}</div>
    );

    // return (
    //   <>
    //     <div>
    //       {firstlast &&
    //         formatNumber(firstlast[1]) + (indicator === 'blockTime' ? 's' : '')}
    //     </div>
    //     {/* not use now, set to disabled */}
    //     <Draw
    //       small={small}
    //       setFirstLast={setFirstLast}
    //       indicator={indicator}
    //       plot={plot}
    //       plain={true}
    //       width={small ? width - 100 : width - 130}
    //       height={Math.min(
    //         small ? (width - 100) * 0.6 : (width - 130) * 0.45,
    //         small ? height - 20 : height - 36,
    //       )}
    //     />
    //   </>
    // );
  } else {
    return (
      <Container style={{ width, height }} small={small}>
        <Title>
          <Tooltip text={t(`charts.${indicator}.description`)}>
            {t(`charts.${indicator}.title`)}
          </Tooltip>
        </Title>
        <Value small={small}>
          {firstlast &&
            formatNumber(firstlast[1]) + (indicator === 'blockTime' ? 's' : '')}
        </Value>
        <Change trend={trend}>{diff}</Change>

        <Draw
          small={small}
          setFirstLast={setFirstLast}
          indicator={indicator}
          plot={plot}
          plain={false}
          width={small ? width - 100 : width - 130}
          height={Math.min(
            small ? (width - 100) * 0.6 : (width - 130) * 0.45,
            small ? height - 20 : height - 36,
          )}
        />
      </Container>
    );
  }
};

function Draw({
  width,
  height,
  small,
  children,
  plot,
  indicator,
  setFirstLast,
  plain,
}) {
  const backgroundCanvasRef = useRef(null);
  const lineCanvasRef = useRef(null);

  useEffect(() => {
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
      plain,
    });
    if (draw && !plain) {
      draw();
    }
    setFirstLast([first, last]);
  }, [width, height, plot, indicator, setFirstLast, plain]);
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
  padding: ${props => (props.small ? '10px' : '18px')};
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 12px 8px 24px -12px rgba(20, 27, 50, 0.12);
  border-radius: 5px;
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
  top: -5px;
`;

const Change = styled.div`
  color: #282d30;
  font-size: 12px;
  &::after {
    content: url(${({ trend }) =>
      trend === 'down' ? down : trend === 'flat' ? flat : up});
    margin-left: 10px;
  }
`;

const CanvasContainer = styled.div`
  position: absolute;
  right: ${props => (props.small ? '16px' : '20px')};
  bottom: ${props => (props.small ? '10px' : '16px')};
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
  const diff =
    e === 0
      ? '--'
      : isNaN(format(((s - e) / e) * 100, 1))
      ? '--'
      : format(((s - e) / e) * 100, 1);
  return (diff > 0 ? '+' + diff : diff) + '%';
}
