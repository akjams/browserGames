import { Serializable } from './Serializable';

export interface Sprite extends Serializable<Sprite> {
  
  getId(): string;
  tick(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
