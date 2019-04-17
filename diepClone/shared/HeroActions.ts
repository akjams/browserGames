import { Serializable } from './Serializable';

export class HeroActions implements Serializable<HeroActions> {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  mouseDown: boolean;
  mouseX: number;
  mouseY: number;

  // The HeroActions keeps itself up to date.
  addEventListeners(canvas: HTMLCanvasElement): void {
    let onKeyUpOrDown: EventListener = (event: KeyboardEvent) => {
      console.assert(event.type === 'keydown' || event.type === 'keyup',
          'Unknown event.type: ' + event.type);
      let isDown: boolean = event.type === 'keydown';
      if (event.key === 'w') { this.w = isDown; }
      if (event.key === 'a') { this.a = isDown; }
      if (event.key === 'd') { this.d = isDown; }
      if (event.key === 's') { this.s = isDown; }
    };

    canvas.addEventListener('keydown', onKeyUpOrDown);
    canvas.addEventListener('keyup', onKeyUpOrDown);

    let onMouseMove: EventListener = (event: MouseEvent) => {
      this.mouseX = event.offsetX;
      this.mouseY = event.offsetY;
    };

    canvas.addEventListener('mousemove', onMouseMove);

    let onMouseUpOrDown: EventListener = (event: MouseEvent) => {
      console.assert(['mouseup', 'mousedown'].includes(event.type),
          'Unknown event.type: ' + event.type);
      this.mouseDown = event.type === 'mousedown';
    };

    canvas.addEventListener('mouseup', onMouseUpOrDown);
    canvas.addEventListener('mousedown', onMouseUpOrDown);
  }

  deserialize(jsonObj): void {
    this.w = jsonObj.w;
    this.a = jsonObj.a;
    this.s = jsonObj.s;
    this.d = jsonObj.d;
    this.mouseDown = jsonObj.mouseDown;
    this.mouseX = jsonObj.mouseX;
    this.mouseY = jsonObj.mouseY;
  }
}

