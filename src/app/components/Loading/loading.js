import head from './head.png';
export default function loading(container) {
  const canvas = document.createElement('canvas');
  const WIDTH = 146;
  const PADDING = 10;
  var dpr = window.devicePixelRatio || 1;
  var ctx = canvas.getContext('2d');
  let rafId;
  var img = new Image();
  img.onload = function () {
    const { width, height } = this;
    const pngRatio = width / height;
    const HEIGHT = WIDTH / pngRatio;

    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;

    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';

    ctx.scale(dpr, dpr);

    ctx.strokeStyle = 'rgb(0, 84, 254)';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#FE7329';

    const back = [1.1, -0.2];
    const segs = [
      [-0.2, 0.36],
      [0.4, 0.42],
      [0.46, 1.1],
    ];

    // debugger;

    function update(v) {
      ctx.beginPath();
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const x = WIDTH / 2,
        y = HEIGHT / 2 + 4,
        radiusX = WIDTH / 2.1,
        radiusY = HEIGHT / 6,
        rotation = -Math.PI * 0.15;
      ctx.stroke();

      const isFront = v < (1 + 0.25) * Math.PI || v > 1.75 * Math.PI;

      function drawBall() {
        ctx.beginPath();
        const px = radiusX * Math.cos(v);
        const py = radiusY * Math.sin(v);

        const qx = px * Math.cos(rotation) - py * Math.sin(rotation);
        const qy = px * Math.sin(rotation) + py * Math.cos(rotation);

        const xx = x + qx;
        const yy = y + qy;
        ctx.arc(xx, yy, 8, 0, 2 * Math.PI);
        ctx.fill();
      }

      function drawPath([from, to]) {
        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          radiusX,
          radiusY,
          rotation,
          Math.PI * from,
          Math.PI * to,
        );
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      if (!isFront) {
        drawBall();
      }
      drawPath(back);
      ctx.drawImage(
        img,
        0,
        0,
        width,
        height,
        PADDING,
        PADDING,
        WIDTH - PADDING * 2,
        (WIDTH - PADDING * 2) / pngRatio,
      );

      segs.forEach(drawPath);

      if (isFront) {
        drawBall();
      }
    }

    const valueStart = 0,
      valueEnd = 2 * Math.PI;
    const duration = 5000;
    let start = Date.now();
    function loop() {
      const time = Date.now();
      let elapsed = (time - start) / duration;
      elapsed = elapsed > 1 ? 1 : elapsed;
      if (elapsed === 1) {
        start = Date.now();
      }
      let value = ease(elapsed);
      const valueCurrent = valueStart + (valueEnd - valueStart) * value;
      update(valueCurrent);

      rafId = requestAnimationFrame(loop);
    }
    loop();
  };
  img.src = head;
  container.appendChild(canvas);
  return () => {
    cancelAnimationFrame(rafId);
  };
}

function ease(amount) {
  var s = 1.2;
  return --amount * amount * ((s + 1) * amount + s) + 1;
}
