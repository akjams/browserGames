export class GameDriver {
  static readonly WIDTH: number = 600;
  static readonly HEIGHT: number = 400;

  canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = <HTMLCanvasElement> document.getElementById("canvasId");
    this.canvas.setAttribute('width', GameDriver.WIDTH.toString());
    this.canvas.setAttribute('height', GameDriver.HEIGHT.toString());
    this.canvas.setAttribute('style', 'border:1px solid #000000;');
  }

  gameLoop() {
    let ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#AA0000'; // red.
    ctx.fillRect(150, 100, 150, 75);
  }
}
