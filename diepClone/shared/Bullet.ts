import { Player } from './Player';
import { Sprite } from './Sprite';
import { Utils } from './Utils';
import { Constants } from './Constants';

export class Bullet implements Sprite {
  shooter: Player;
  id: string;
  x: number;
  y: number;
  xvel: number;
  yvel: number;

  constructor(id: string, x: number, y: number, xvel: number, yvel: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.xvel = xvel;
    this.yvel = yvel;
  }

  static fromShooter(shooter: Player,
      shooterXvel: number, shooterYvel: number) {
		let dx = (Constants.CANVAS_WIDTH / 2 - shooter.heroActions.mouseX);
		let dy = -(Constants.CANVAS_HEIGHT / 2 - shooter.heroActions.mouseY);
	  let theta = Math.atan2(dx, dy) + Math.PI/2; // radians in range (-PI, PI].
    let shotXvel = Math.cos(theta) * shooter.bulletSpeed;
    let shotYvel = Math.sin(theta) * shooter.bulletSpeed;

    let combinedXvel = shotXvel + shooterXvel;
    let combinedYvel = shotYvel + shooterYvel;
    
    let bullet: Bullet = new Bullet(
      Utils.randomId(),
      shooter.x,
      shooter.y,
      combinedXvel,
      combinedYvel);
      bullet.shooter = shooter;
      return bullet;
  }

	tick() {
		this.x += this.xvel;
		this.y += this.yvel;
	}

	draw(ctx: CanvasRenderingContext2D) { 
		ctx.beginPath();
		ctx.fillStyle = '#222222';
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.fill();
	}

  getId(): string {
    return this.id;
  }

	deserialize(jsonObj): void  {
		throw 'Unsupported';
	}

	static fromJson(jsonObj): Bullet  {
		return new Bullet(jsonObj.id, jsonObj.x, jsonObj.y, jsonObj.xvel, jsonObj.yvel);
	}

	// Client side does not need a reference to shooter.
	serialize(): Object {
		return {
			id: this.id,
			x: this.x,
			y: this.y,
		  xvel: this.xvel,
      yvel: this.yvel
    }
	}
  
}
