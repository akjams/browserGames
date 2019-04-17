import { Sprite } from './Sprite';

export class Food implements Sprite {

  id: string;
  x: number;
  y: number;

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  getId(): string {
    return this.id;
  }

  tick() {
  
  }

  draw(ctx: CanvasRenderingContext2D)  {
    ctx.beginPath();
    ctx.fillStyle = '#000088';
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  }

  deserialize(jsonObj): void {
    
  }

  static fromJson(jsonObj): Food {
    return new Food(jsonObj.id, jsonObj.x, jsonObj.y);
  }
}
