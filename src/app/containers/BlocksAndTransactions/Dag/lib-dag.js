const RENDER_SIZE = 30;
const MAX_BUFFER_SIZE = 25;
const MIN_BUFFER_SIZE = 15;

const INIT_EPOCH_WIDTH = 60;
const PIVOT_R = [11, 11];
const NON_PIVOT_R = [6, 8];

const MAX_PIVOT_R = PIVOT_R[1];
const MAX_NON_PIVOT_R = NON_PIVOT_R[1];

function scaleLinear() {
  let domain, range, clamp;
  function scale(v) {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    if (clamp) {
      const max = d0 <= d1 ? d1 : d0;
      const min = d0 <= d1 ? d0 : d1;
      v = Math.max(min, Math.min(max, v));
    }
    return r0 + ((r1 - r0) * (v - d0)) / (d1 - d0);
  }
  scale.domain = function (v) {
    return v ? ((domain = v), scale) : domain;
  };
  scale.range = function (v) {
    return v ? ((range = v), scale) : range;
  };
  scale.clamp = function (v) {
    return v ? ((clamp = v), scale) : clamp;
  };
  return scale;
}

function encode(i, j) {
  return (i << 8) + j;
}

function decode(n) {
  const i = (n & 0x00ff00) >> 8;
  const j = n & 0x0000ff;
  return [i, j];
}

const colors = [
  ['124, 202, 242', '176, 223, 247'],
  ['38, 135, 255', '125, 183, 255'],
  ['71, 104, 232', '145, 164, 241'],
];
const colorSize = colors.length;
function getEpochColor(epochNum) {
  return colors[Math.ceil(epochNum) % colorSize];
}

const getEpochSpeed = scaleLinear()
  .domain([MAX_BUFFER_SIZE, MIN_BUFFER_SIZE])
  // 2 epochs/s <==> 1/30 epoch/frame
  .range([1.2, 0.5].map(x => x / 40))
  .clamp(true);

const INIT_WIDTH = INIT_EPOCH_WIDTH;

function layout({ n, d, h: height, w = INIT_WIDTH }) {
  let points = [];
  let hit = 0;
  while (points.length <= n) {
    const _height = height - (MAX_PIVOT_R + 2) * 2;
    const _x = Math.random() * w;
    const _y =
      Math.random() > 0.5
        ? randomNumber(0, _height / 2 - MAX_PIVOT_R)
        : randomNumber(_height / 2 + MAX_PIVOT_R, _height);
    let push = true;

    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      if (Math.abs(x - _x) > d && Math.abs(y - _y) > d);
      else {
        push = false;
        hit++;
      }
    }

    if (hit > 15) {
      points = [];
      w += MAX_PIVOT_R;
      hit = 0;
    }

    if (push) {
      points.push([_x, _y]);
    }
  }

  return {
    points: points.map(([x, y]) => [x + MAX_PIVOT_R, y + MAX_NON_PIVOT_R + 3]),
    width: w + MAX_PIVOT_R * 3,
  };
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function subscribe(height, cb) {
  let epochs = [];
  //allow only one pending request, the order is pretty unpredictable otherwise
  let sendNextRequest = true;

  function updateData() {
    if (sendNextRequest) {
      sendNextRequest = false;
      fetch('/v1/dag')
        .then(e => e.json())
        .then(({ list }) => {
          const _epochs = list.map(epoch => {
            const _epoch = {};
            let [pivot, ...rest] = epoch;
            const { epochNumber, ...pivotInfo } = pivot;
            //data from server can be wrong
            rest = rest.filter(d => d.epochNumber === epochNumber);
            _epoch.epochNumber = epochNumber;
            _epoch.colors = getEpochColor(epochNumber);
            _epoch.points = [];
            const { points, width } = layout({
              n: rest.length,
              d: 10,
              h: height,
            });

            //pivot
            _epoch.points.push({
              offsetX: width,
              y: height / 2,
              ...pivotInfo,
            });
            rest.forEach((block, i) => {
              const p = points[i];
              _epoch.points.push({
                offsetX: p[0],
                y: p[1],
                ...block,
              });
            });
            return _epoch;
          });
          sendNextRequest = true;
          cb((epochs = concat(_epochs, epochs)));
        })
        .catch(() => {
          sendNextRequest = true;
        });
    }
  }

  //update on subscribe
  updateData();

  const interval = setInterval(updateData, 5000);
  return () => {
    clearInterval(interval);
  };
}

function concat(newEpochs, oldEpochs) {
  if (oldEpochs.length === 0) {
    return newEpochs;
  }
  const oldInNew = newEpochs[newEpochs.length - 1].epochNumber;
  const newInOld = oldEpochs[0].epochNumber;
  const overlap = newInOld - oldInNew;
  if (overlap < 0) {
  } else {
    oldEpochs = oldEpochs.slice(overlap + 1);
  }
  const result = newEpochs.concat(oldEpochs);
  return result;
}

var Concrete = {},
  idCounter = 0;

Concrete.PIXEL_RATIO = (function () {
  // return 1
  return (window && window.devicePixelRatio) || 1;
})();

////////////////////////////////////////////////////////////// VIEWPORT //////////////////////////////////////////////////////////////

/**
 * Concrete Viewport constructor
 * @param {Object} config
 * @param {Integer} config.width - viewport width in pixels
 * @param {Integer} config.height - viewport height in pixels
 */
Concrete.Viewport = function (config) {
  if (!config) {
    config = {};
  }

  this.container = config.container;
  this.layers = [];

  const canvas = document.createElement('canvas');

  canvas.width = config.width * Concrete.PIXEL_RATIO;
  canvas.style.width = config.width + 'px';
  canvas.height = config.height * Concrete.PIXEL_RATIO;
  canvas.style.height = config.height + 'px';
  canvas.getContext('2d').scale(Concrete.PIXEL_RATIO, Concrete.PIXEL_RATIO);

  this.setSize(config.width || 0, config.height || 0);

  // clear container
  config.container.innerHTML = '';
  config.container.appendChild((this.canvas = canvas));
};

Concrete.Viewport.prototype = {
  /**
   * add layer
   * @param {Concrete.Layer} layer
   * @returns {Concrete.Viewport}
   */
  add: function (layer) {
    this.layers.push(layer);
    layer.setSize(layer.width || this.width, layer.height || this.height);
    layer.viewport = this;
    return this;
  },
  /**
   * set viewport size
   * @param {Integer} width - viewport width in pixels
   * @param {Integer} height - viewport height in pixels
   * @returns {Concrete.Viewport}
   */
  setSize: function (width, height) {
    this.width = width;
    this.height = height;
    // this.scene.setSize(width, height);

    this.layers.forEach(function (layer) {
      layer.setSize(width, height);
    });

    return this;
  },
  /**
   * get key associated to coordinate.  This can be used for mouse interactivity.
   * @param {Number} x
   * @param {Number} y
   * @returns {Integer} integer - returns -1 if no pixel is there
   */
  getIntersection: function (x, y) {
    var layers = this.layers,
      len = layers.length,
      n,
      layer,
      key;

    for (n = len - 1; n >= 0; n--) {
      layer = layers[n];
      key = layer.hit.getIntersection(x, y);
      if (key >= 0) {
        return key;
      }
    }
    return -1;
  },

  /**
   * composite all layers onto visible canvas
   */
  render: function () {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.width, this.height);
    this.layers.forEach(function (layer) {
      if (layer.visible) {
        context.drawImage(layer.scene.canvas, 0, 0, layer.width, layer.height);
      }
    });
  },
};

////////////////////////////////////////////////////////////// LAYER //////////////////////////////////////////////////////////////

/**
 * Concrete Layer constructor
 * @param {Object} config
 * @param {Integer} [config.x]
 * @param {Integer} [config.y]
 * @param {Integer} [config.width] - viewport width in pixels
 * @param {Integer} [config.height] - viewport height in pixels
 */
Concrete.Layer = function (config) {
  if (!config) {
    config = {};
  }
  this.width = 0;
  this.height = 0;
  this.visible = true;
  this.id = idCounter++;
  this.hit = new Concrete.Hit({
    contextType: config.contextType,
  });
  this.scene = new Concrete.Scene({
    contextType: config.contextType,
  });

  if (config.width && config.height) {
    this.setSize(config.width, config.height);
  }
};

Concrete.Layer.prototype = {
  /**
   * set layer size
   * @param {Number} width
   * @param {Number} height
   * @returns {Concrete.Layer}
   */
  setSize: function (width, height) {
    this.width = width;
    this.height = height;
    this.scene.setSize(width, height);
    this.hit.setSize(width, height);
    return this;
  },
};

////////////////////////////////////////////////////////////// SCENE //////////////////////////////////////////////////////////////

/**
 * Concrete Scene constructor
 * @param {Object} config
 * @param {Integer} [config.width] - canvas width in pixels
 * @param {Integer} [config.height] - canvas height in pixels
 */
Concrete.Scene = function (config) {
  this.contextType = '2d';
  this.id = idCounter++;
  this.canvas = window.OffscreenCanvas
    ? new OffscreenCanvas(0, 0)
    : document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
};

Concrete.Scene.prototype = {
  /**
   * set scene size
   * @param {Number} width
   * @param {Number} height
   * @returns {Concrete.Scene}
   */
  setSize: function (width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width * Concrete.PIXEL_RATIO;
    this.canvas.height = height * Concrete.PIXEL_RATIO;

    if (this.contextType === '2d' && Concrete.PIXEL_RATIO !== 1) {
      this.context.scale(Concrete.PIXEL_RATIO, Concrete.PIXEL_RATIO);
    }

    return this;
  },
  /**
   * clear scene
   * @returns {Concrete.Scene}
   */
  clear: function () {
    var context = this.context;
    if (this.contextType === '2d') {
      context.clearRect(
        0,
        0,
        this.width * Concrete.PIXEL_RATIO,
        this.height * Concrete.PIXEL_RATIO,
      );
    }
    return this;
  },
};

////////////////////////////////////////////////////////////// HIT //////////////////////////////////////////////////////////////

/**
 * Concrete Hit constructor
 * @param {Object} config
 * @param {Integer} [config.width] - canvas width in pixels
 * @param {Integer} [config.height] - canvas height in pixels
 */
Concrete.Hit = function (config) {
  if (!config) {
    config = {};
  }

  this.width = 0;
  this.height = 0;
  this.contextType = config.contextType || '2d';
  this.canvas = window.OffscreenCanvas
    ? new OffscreenCanvas(0, 0)
    : document.createElement('canvas');
  this.context = this.canvas.getContext(this.contextType, {
    // have to add preserveDrawingBuffer so that we can pick colors with readPixels for hit detection
    preserveDrawingBuffer: true,
    // solve webgl antialiasing picking issue
    antialias: false,
  });

  // this.hitColorIndex = 0;
  // this.keyToColor = {};
  // this.colorToKey = {};

  if (config.width && config.height) {
    this.setSize(config.width, config.height);
  }
};

Concrete.Hit.prototype = {
  /**
   * set hit size
   * @param {Number} width
   * @param {Number} height
   * @returns {Concrete.Hit}
   */
  setSize: function (width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width * Concrete.PIXEL_RATIO;
    this.canvas.height = height * Concrete.PIXEL_RATIO;
    return this;
  },
  /**
   * clear hit
   * @returns {Concrete.Hit}
   */
  clear: function () {
    var context = this.context;
    if (this.contextType === '2d') {
      context.clearRect(
        0,
        0,
        this.width * Concrete.PIXEL_RATIO,
        this.height * Concrete.PIXEL_RATIO,
      );
    }
    return this;
  },
  /**
   * get key associated to coordinate.  This can be used for mouse interactivity.
   * @param {Number} x
   * @param {Number} y
   * @returns {Integer} integer - returns -1 if no pixel is there
   */
  getIntersection: function (x, y) {
    var context = this.context,
      data;

    x = Math.round(x);
    y = Math.round(y);

    // if x or y are out of bounds return -1
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      return -1;
    }

    // 2d
    if (this.contextType === '2d') {
      data = context.getImageData(x, y, 1, 1).data;

      if (data[3] < 255) {
        return -1;
      }
    }

    return this.rgbToInt(data);
  },
  /**
   * get canvas formatted color string from data index
   * @param {Number} index
   * @returns {String}
   */
  getColorFromIndex: function (index) {
    var rgb = this.intToRGB(index);
    return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
  },
  /**
   * converts rgb array to integer value
   * @param {Array.<Number} rgb - [r,g,b]
   * @returns {Integer}
   */
  rgbToInt: function (rgb) {
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    return (r << 16) + (g << 8) + b;
  },
  /**
   * converts integer value to rgb array
   * @param {Number} number - positive number between 0 and 256*256*256 = 16,777,216
   * @returns {Array.<Integer>}
   */
  intToRGB: function (number) {
    var r = (number & 0xff0000) >> 16;
    var g = (number & 0x00ff00) >> 8;
    var b = number & 0x0000ff;
    return [r, g, b];
  },
};

const MAX_PIVOT_R$1 = PIVOT_R[1];
const MAX_NON_PIVOT_R$1 = NON_PIVOT_R[1];

const staggering = 1;
const blinkScale = scaleLinear().domain([0, 1]).range([0, Math.PI]);
const lineScale = scaleLinear().domain([0, 1]).range([0, 1]).clamp(true);
const pivotOuterR = scaleLinear()
  .domain([
    INIT_EPOCH_WIDTH + MAX_PIVOT_R$1 * 3,
    INIT_EPOCH_WIDTH + MAX_PIVOT_R$1 * 5,
  ])
  .range(PIVOT_R)
  .clamp(true);
const POPUP_MARGIN = 15;
const POPUP_PADDING = 5;
const POPUP_LINE_HEIGHT = 15;
const TITLE_FONT = 'bold 12px Circular Std';
const TXT_FONT = 'normal 10px Circular Std';
const PIVOT_OUTER_ALPHA = 0.3;

function createRender(viewport, height, viewport_width) {
  const main = new Concrete.Layer();
  viewport.add(main);
  const { scene, hit } = main;
  const ctx = scene.context;
  const ctxHit = hit.canvas.getContext('2d');
  return function render({
    epochsToRender,
    growingEpoch,
    growingRate,
    hoveredBlock,
  }) {
    const hash2Point = {};

    const drawEdges = [];
    const drawPoints = [];
    let drawHover = [];

    epochsToRender.forEach((epoch, i) => {
      const { epochX, points, colors, epochNumber } = epoch;
      const isGrowingEpoch = growingEpoch === epochNumber;
      const isBlinkingEpoch = growingEpoch - 1 === epochNumber;
      const nPoints = points.length;

      // debugger
      points.forEach((point, j) => {
        const { offsetX, y, hash, parentHash, refereeHashes } = point;
        const x = epochX + offsetX;
        hash2Point[hash] = [x, y];
        const isPivot = j === 0;
        const referees =
          hoveredBlock &&
          hoveredBlock[0] === i &&
          hoveredBlock[1] === j &&
          refereeHashes.map(hash => {
            return [hash, hash2Point[hash]];
          });

        const hitIdx = encode(i, j);
        let parentPoint;
        let alpha = 1;
        if (!(parentPoint = hash2Point[parentHash])) {
          parentPoint = [-200, height / 2];
        }

        const domainStart = (j / nPoints) * staggering;
        lineScale.domain([domainStart, 1]);
        const _growing = isGrowingEpoch ? lineScale(growingRate) : 1;

        drawEdges.push(() => {
          ctx.beginPath();
          const [parentX, parentY] = parentPoint;
          ctx.moveTo(parentX, parentY);
          const distX = parentX + (x - parentX) * _growing;
          const distY = parentY + (y - parentY) * _growing;
          ctx.lineTo(distX, distY);
          ctx.strokeStyle = `rgba(208, 215, 235,${alpha})`;
          ctx.lineWidth = isPivot ? 4 : 1;
          ctx.stroke();
        });

        drawPoints.push(() => {
          let pivotR;
          if (isPivot) {
            pivotR = pivotOuterR(offsetX);
          }
          ctxHit.beginPath();
          ctxHit.fillStyle = hit.getColorFromIndex(hitIdx);
          ctxHit.arc(
            x,
            y,
            isPivot ? pivotR : MAX_NON_PIVOT_R$1,
            0,
            Math.PI * 2,
          );
          ctxHit.fill();
          if (!isGrowingEpoch) {
            let blinkingAlpha;
            if (isBlinkingEpoch) {
              blinkingAlpha = isPivot
                ? PIVOT_OUTER_ALPHA + Math.sin(blinkScale(growingRate)) * 0.4
                : alpha - Math.abs(Math.sin(blinkScale(growingRate))) * 0.6;
            }
            if (isPivot) {
              const pivotR = pivotOuterR(offsetX);
              ctx.beginPath();
              ctx.fillStyle = `rgba(${colors[0]},${blinkingAlpha || 0.3} )`;
              ctx.arc(x, y, pivotR, 0, Math.PI * 2);
              ctx.fill();

              ctx.beginPath();
              ctx.fillStyle = `rgba(${colors[0]}, 1)`;
              ctx.arc(x, y, pivotR * 0.7, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.fillStyle = `rgba(${colors[1]}, ${blinkingAlpha || 1})`;
              ctx.arc(x, y, MAX_NON_PIVOT_R$1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        if (referees) {
          let pw;
          const drawText = [];
          ctx.textBaseline = 'bottom';
          ctx.textAlign = 'start';

          ctx.font = TITLE_FONT;
          const title =
            'Ref block hashes: ' + (referees.length === 0 ? '--' : '');
          const { width } = ctx.measureText(title);
          pw = width;
          drawText.push(title);

          const unfoundYGap = height / referees.length;
          let unfoundY = 0;
          referees.forEach(([hash, [_x, _y] = [-200, unfoundY]], i) => {
            unfoundY += unfoundYGap;
            drawHover.push(() => {
              ctx.beginPath();
              ctx.moveTo(_x, _y);
              ctx.lineTo(x, y);
              ctx.save();
              ctx.strokeStyle = `rgba(208, 215, 235,1)`;
              ctx.lineWidth = 1;
              ctx.setLineDash([3, 3]);
              ctx.stroke();
              ctx.restore();
            });
            ctx.font = TXT_FONT;
            const txt = `[${i}]:${hash}`;
            const { width } = ctx.measureText(txt);
            if (width > pw) {
              pw = width;
            }
            drawText.push(txt);
          });

          const ph =
            POPUP_PADDING * 2 + (referees.length + 1) * POPUP_LINE_HEIGHT;
          pw += POPUP_PADDING * 2;
          const [p_x, p_y] = popupPosition(
            viewport_width,
            height,
            pw,
            ph,
            x,
            y,
          );
          //background
          drawHover.push(() => {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(p_x, p_y, pw, ph);
          });

          drawText.forEach((txt, i) => {
            drawHover.push(() => {
              ctx.font = i === 0 ? TITLE_FONT : TXT_FONT;
              ctx.fillStyle = '#20253A';
              ctx.fillText(
                txt,
                p_x + POPUP_PADDING,
                p_y + POPUP_PADDING + (i + 1) * POPUP_LINE_HEIGHT,
              );
            });
          });
        }
      });
    });

    scene.clear();
    hit.clear();
    drawEdges.forEach(f => f());
    drawPoints.forEach(f => f());
    drawHover.forEach(f => f());
  };
}

function popupPosition(vp_w, vp_h, p_width, p_height, x, y) {
  let tl_x,
    tl_y,
    arrow = 'top';
  tl_x = x - p_width * 0.2;
  if (tl_x < 0) {
    tl_x = POPUP_PADDING;
  } else if (tl_x + p_width > vp_w) {
    tl_x = vp_w - p_width - POPUP_PADDING;
  }

  tl_y = y - p_height - POPUP_MARGIN;
  if (tl_y < 0) {
    arrow = 'bottom';
    tl_y = y + POPUP_MARGIN;
  }

  if (tl_y + p_height > vp_h) {
    arrow = 'right';
    tl_y = y - p_height / 2;
    tl_x = x + POPUP_MARGIN;
  }

  if (tl_x + p_width > vp_w) {
    tl_x = x - p_width - POPUP_MARGIN;
    arrow = 'left';
  }

  return [tl_x, tl_y, arrow];
}

function dag({ container, width, height }) {
  const viewport = new Concrete.Viewport({
    container,
    width,
    height,
  });
  const renderMain = createRender(viewport, height, width);
  const viewportCanvas = viewport.canvas;

  let epoches = [];
  const unsubscribe = subscribe(height, _data => {
    epoches = _data;
  });

  let epochsToRender = [];
  let diff;
  let growthSpeed;
  let targetLeftMovingWidth = 0;
  let currentLeftMovingWidth = 0;
  let growingRate = 0;
  let growingEpoch;

  let currentEpoch;
  function addEpoch() {
    let bufferSize = epoches.length;

    //too much buffer to go mainly because hover or inactive
    if (bufferSize > MAX_BUFFER_SIZE) {
      while (epoches.length > MIN_BUFFER_SIZE) {
        if (
          epochsToRender[epochsToRender.length - 1].epochNumber <
          epoches[epoches.length - 1].epochNumber
        ) {
          epochsToRender.push(epoches.pop());
        }
      }
    }
    //the epoches may contain data already in the queue
    while (
      epochsToRender.length > 0 &&
      epoches.length > 0 &&
      epochsToRender[epochsToRender.length - 1].epochNumber >=
        epoches[epoches.length - 1].epochNumber
    ) {
      epoches.pop();
    }

    if (epoches.length > 0) {
      epochsToRender.push((currentEpoch = epoches.pop()));
    }

    bufferSize = epoches.length;
    growthSpeed = getEpochSpeed(bufferSize);

    //clean up epochsToRender for sake of memory
    if (epochsToRender.length > RENDER_SIZE) {
      epochsToRender = epochsToRender.slice(
        epochsToRender.length - RENDER_SIZE,
      );
    }

    growingEpoch = currentEpoch.epochNumber;
    growingRate = 0;

    let currentEpochX;
    for (let i = 0; i < epochsToRender.length; i++) {
      const epoch = epochsToRender[i];
      let { epochX } = epoch;

      if (i === 0) {
        currentEpochX = epochX || 0;
      }
      const { points } = epoch;
      if (epochX === undefined) {
        epochX = epoch.epochX = currentEpochX;
      }
      currentEpochX = epochX + points[0].offsetX + MAX_PIVOT_R * 2;
      diff = currentEpochX - width;
    }

    if (diff > 0) {
      targetLeftMovingWidth = diff;
      currentLeftMovingWidth = 0;
      for (let i = 0; i < epochsToRender.length; i++) {
        const epoch = epochsToRender[i];
        epoch._epochX = epoch.epochX;
      }
    }
  }

  function moveViewport() {
    currentLeftMovingWidth += 16;
    for (let i = 0; i < epochsToRender.length; i++) {
      const epoch = epochsToRender[i];
      epoch.epochX = epoch._epochX - currentLeftMovingWidth;
    }
  }

  let rafId;
  let hover;
  let hoveredBlock;
  function loop() {
    if (!hover) {
      const start = epoches.length > 0;
      if (start) {
        const isMoving = currentLeftMovingWidth < targetLeftMovingWidth;
        const isGrowing = growingRate <= 1;
        //moving animation in order to making room for growing
        //and growing animation
        if (!isMoving && !isGrowing) {
          //no animation ready to play
          //add another block and trigger new circle
          addEpoch();
        } else if (isMoving) {
          moveViewport();
        } else if (isGrowing) {
          growingRate += growthSpeed;
        }
      }
    }
    renderMain({ epochsToRender, growingEpoch, growingRate, hoveredBlock });
    viewport.render();
    rafId = requestAnimationFrame(loop);
  }
  loop();
  window.loop = loop;

  function mousemove(e) {
    hover = true;
    const { layerX, layerY } = e;
    const idx = viewport.getIntersection(layerX, layerY);
    if (idx !== -1) {
      viewportCanvas.style.cursor = 'pointer';
      hoveredBlock = decode(idx);
    } else {
      hoveredBlock = undefined;
      viewportCanvas.style.cursor = 'default';
    }
  }
  viewportCanvas.addEventListener('mousemove', mousemove);

  function click() {
    if (hoveredBlock) {
      const [i, j] = hoveredBlock;
      const { hash } = epochsToRender[i].points[j];
      window.open('https://confluxscan.io/block/' + hash, '_blank');
    }
  }

  function mouseLeave() {
    hover = false;
  }
  viewportCanvas.addEventListener('mouseleave', mouseLeave);
  viewportCanvas.addEventListener('click', click);

  return function destory() {
    unsubscribe();
    window.cancelAnimationFrame(rafId);
    viewportCanvas.removeEventListener('mousemove', mousemove);
    viewportCanvas.removeEventListener('mouseleave', mouseLeave);
    viewportCanvas.removeEventListener('click', click);
  };
}

export default dag;
