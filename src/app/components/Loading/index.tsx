import React, { useEffect, useRef } from 'react';
import TWEEN from '@tweenjs/tween.js';
import head from './head.png';
export default function Loading() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setupCanvas(canvas);
    const back = [1.25, -0.2];
    const segs = [
      [-0.2, 0.4],
      [0.42, 0.5],
      [0.52, 1.25],
    ];
    const pngRatio = 249 / 201;
    var image = new Image();
    image.src = './head.png';
  }, []);
  return <canvas ref={canvasRef}>Loading</canvas>;
}

function setupCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  var dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  var rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext('2d');

  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return ctx;
}
