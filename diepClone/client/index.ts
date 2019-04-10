'use strict';

const WIDTH = 600;
const HEIGHT = 400;

let canvas = <HTMLCanvasElement> document.getElementById("canvasId");

canvas.setAttribute('width', WIDTH.toString());
canvas.setAttribute('height', HEIGHT.toString());
canvas.setAttribute('style', 'border:1px solid #000000;');

let ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000'; // red.
ctx.fillRect(100, 100, 150, 75);


