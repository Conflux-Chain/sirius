import dayjs from 'dayjs';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

// const NUM_X_GRID = 7;
const NUM_Y_GRID = 5;

const COLORS = {
  '1': {
    line: '#FA5D8E',
    inner: '#ECA169',
    outer: '#FBDADA',
  },
  '-1': {
    line: '#1E54FF',
    inner: '#A6E999',
    outer: '#E0FBDA',
  },
};

export default function createDraw({
  TRI_HEIGHT = 0,
  POPUP_PADDING = 0,
  RECT_WIDTH = 0,
  RECT_HEIGHT = 0,
  Y_AXIS_WIDTH = 0,
  X_AXIS_HEIGHT = 0,
  NUM_X_GRID = 7,
  width,
  height,
  ctxBg,
  ctxLine,
  plot,
  indicator,
  isSolid,
  small,
}) {
  if (!plot) {
    return false;
  }
  const xData = [],
    yData = [],
    data = [];
  range(0, plot.length - 1, NUM_X_GRID)
    .map(i => plot[i])
    .forEach(x => {
      xData.push(parseInt(x['timestamp']));
      yData.push(parseFloat(x[indicator]));
      data.push([parseInt(x['timestamp']), parseFloat(x[indicator])]);
    });

  const first = yData[0],
    last = yData[yData.length - 1];
  console.log('draw', indicator, first, last);
  const color = COLORS[first > last ? 1 : -1];
  const yGridRanges = getYScaleRange([height - X_AXIS_HEIGHT, 0], NUM_Y_GRID);

  const xScale = scaleLinear()
    .domain(extent(xData))
    .range([Y_AXIS_WIDTH + (small ? 5 : 10), width - (small ? 5 : 20)]);
  const xScale1 = xScale.copy().domain([0, xData.length - 1]);
  const yScale = scaleLinear()
    .domain(extent(yData))
    .range([
      height - X_AXIS_HEIGHT - (small ? 5 : 20),
      small ? 5 : RECT_HEIGHT + POPUP_PADDING + TRI_HEIGHT,
    ]);
  function draw({ cursorX } = {}) {
    ///////////////// background canvas ///////////////////
    ctxBg.save();
    ctxBg.clearRect(0, 0, width, height);
    ctxBg.beginPath();
    ctxBg.fillStyle = 'rgba(0,0,0,0.87)';
    ctxBg.font = '12px';

    //draw borders
    if (!small) {
      ctxBg.strokeStyle = 'rgba(0,0,0,0.12)';
      ctxBg.moveTo(Y_AXIS_WIDTH, 0);
      ctxBg.lineTo(Y_AXIS_WIDTH, height - X_AXIS_HEIGHT);
      ctxBg.lineTo(width, height - X_AXIS_HEIGHT);
      ctxBg.stroke();
    }

    //draw grid
    ctxBg.beginPath();
    ctxBg.setLineDash([2, 1]);
    const rx = (width + Y_AXIS_WIDTH) / 2;
    const ry = (height - X_AXIS_HEIGHT) / 2;
    const gradient = ctxBg.createRadialGradient(rx, ry, 10, rx, ry, rx);
    gradient.addColorStop(1, 'rgba(249,249,249,0.17)');
    gradient.addColorStop(0, 'rgba(230,230,230,0.89)');
    ctxBg.strokeStyle = gradient;

    xData.forEach((_, i) => {
      const t = xData[i];
      const x = xScale(t);

      if (X_AXIS_HEIGHT) {
        ctxBg.save();
        ctxBg.beginPath();
        ctxBg.fillStyle = 'rgba(0,0,0,0.87)';
        ctxBg.textAlign = 'center';
        ctxBg.textBaseline = 'bottom';
        ctxBg.translate(x, height - 12);
        ctxBg.rotate((-50 * Math.PI) / 180);
        const d = dayjs.unix(t);
        ctxBg.fillText(d.format('MM/DD'), 0, -5);
        ctxBg.fillText(d.format('HH:mm'), 0, 5);
        ctxBg.restore();
      }

      ctxBg.moveTo(x, 0);
      ctxBg.lineTo(x, height - X_AXIS_HEIGHT);
      ctxBg.stroke();
    });

    yGridRanges.forEach(y => {
      ctxBg.beginPath();
      const v = yScale.invert(y);
      if (Y_AXIS_WIDTH) {
        ctxBg.save();
        ctxBg.fillStyle = 'rgba(0,0,0,0.87)';
        // ctxBg.fillStyle = 'red';
        ctxBg.textAlign = 'end';
        ctxBg.textBaseline = 'middle';
        ctxBg.fillText(format(v), Y_AXIS_WIDTH - 10, y);
        ctxBg.restore();
      }

      ctxBg.moveTo(Y_AXIS_WIDTH, y);
      ctxBg.lineTo(width, y);
      ctxBg.stroke();
    });

    ctxBg.restore();

    ///////////////// line canvas ///////////////////
    ctxLine.clearRect(0, 0, width, height);
    ctxLine.strokeStyle = color.line;
    ctxLine.fillStyle = 'rgba(0,0,0,0)';
    ctxLine.lineWidth = 2;

    ctxLine.beginPath();
    data.forEach(([t, v], i) => {
      const x = xScale(t);
      const y = yScale(v);
      if (i === 0) {
        ctxLine.moveTo(x, y);
      } else {
        ctxLine.lineTo(x, y);
      }
    });
    ctxLine.stroke();
    let drawCurrent; //draw after dots to make sure not covered
    data.forEach(([t, v], i) => {
      const x = xScale(t);
      const y = yScale(v);

      if (i === cursorX) {
        drawCurrent = () => {
          ctxLine.save();

          //vertical line
          ctxLine.beginPath();
          ctxLine.lineWidth = 1;
          ctxLine.strokeStyle = '#8EB2EB';
          ctxLine.moveTo(x, 0);
          ctxLine.lineTo(x, height - X_AXIS_HEIGHT);
          ctxLine.stroke();

          //rect
          ctxLine.beginPath();
          ctxLine.fillStyle = 'rgba(113,143,245,0.8)';
          const rectTL = Math.min(
            Math.max(Y_AXIS_WIDTH, x - RECT_WIDTH / 2),
            width - RECT_WIDTH,
          );
          ctxLine.fillRect(
            rectTL,
            y - (RECT_HEIGHT + TRI_HEIGHT + POPUP_PADDING),
            RECT_WIDTH,
            RECT_HEIGHT,
          );
          //triangle
          ctxLine.beginPath();
          ctxLine.moveTo(x - TRI_HEIGHT, y - POPUP_PADDING - TRI_HEIGHT - 0.1);
          ctxLine.lineTo(x, y - POPUP_PADDING);
          ctxLine.lineTo(x + TRI_HEIGHT, y - POPUP_PADDING - TRI_HEIGHT - 0.1);
          ctxLine.closePath();
          ctxLine.fill();

          //text
          ctxLine.fillStyle = 'white';
          ctxLine.textAlign = 'left';
          ctxLine.font = '10px CircularStd';
          ctxLine.fillText(
            dayjs.unix(t).format('YYYY/MM/DD HH:mm'),
            rectTL + 5,
            y - POPUP_PADDING - TRI_HEIGHT - RECT_HEIGHT * 0.6,
          );
          ctxLine.font = 'bold 12px CircularStd';
          ctxLine.fillText(
            v.toPrecision(5),
            rectTL + 5,
            y - POPUP_PADDING - TRI_HEIGHT - RECT_HEIGHT * 0.2,
          );
          //dot
          ctxLine.beginPath();
          ctxLine.fillStyle = color.outer;
          ctxLine.arc(x, y, 6, 0, 2 * Math.PI);
          ctxLine.fill();
          ctxLine.beginPath();
          ctxLine.fillStyle = color.inner;
          ctxLine.arc(x, y, 4, 0, 12 * Math.PI);
          ctxLine.fill();
          ctxLine.restore();
        };
      } else {
        ctxLine.beginPath();
        ctxLine.clearRect(x - 2, y - 2, 4, 4);
        // ctxLine.arc(x, y, 2, 0, 2 * Math.PI)
        if (isSolid) {
          ctxLine.save();
          ctxLine.fillStyle = color.line;
          ctxLine.arc(x, y, 3, 0, 2 * Math.PI);
          ctxLine.fill();
          ctxLine.restore();
        } else {
          ctxLine.arc(x, y, 2, 0, 2 * Math.PI);
          ctxLine.stroke();
        }
      }
    });
    drawCurrent && drawCurrent();
  }
  return { xScale1, draw, first, last };
}

function format(v) {
  if (Math.round(v / 100) > 0) {
    return Math.round(v);
  } else {
    return v.toPrecision(3);
  }
}

function range(start, end, num) {
  const step = Math.round((end - start) / num);
  const result = [end]; //make sure end in the list but not start
  let i = end;
  while ((i -= step) >= start) {
    result.unshift(i);
  }
  return result;
}

function getYScaleRange(range, num) {
  const [end, start] = range;
  const step = (end - start) / num;
  const result = [end];
  let i = start;
  while ((i += step) < end) {
    result.push(i);
  }
  return result;
}

export const PIXEL_RATIO = (function () {
  var ctx = document.createElement('canvas').getContext('2d'),
    dpr = window.devicePixelRatio || 1,
    bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;

  return dpr / bsr;
})();
