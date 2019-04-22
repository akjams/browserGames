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
  theta: number; // radians.
  speed: number;

  constructor(id: string, x: number, y: number, theta: number, speed: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.theta = theta;
    this.speed = speed;
  }

  static fromShooter(shooter: Player,
      shooterXvel: number, shooterYvel: number) {
		let dx = (Constants.CANVAS_WIDTH / 2 - shooter.heroActions.mouseX);
		let dy = -(Constants.CANVAS_HEIGHT / 2 - shooter.heroActions.mouseY);
	  let theta = Math.atan2(dx, dy) + Math.PI/2; // radians in range (-PI, PI].
    let speed = shooter.bulletSpeed
        + Math.sqrt(shooterXvel * shooterXvel + shooterYvel * shooterYvel);
    
    
    let bullet: Bullet = new Bullet(
      Utils.randomId(),
      shooter.x,
      shooter.y,
      theta,
      speed);
      bullet.shooter = shooter;
      return bullet;
  }

	tick() {
		this.x += this.speed * Math.cos(this.theta);
		this.y += this.speed * Math.sin(this.theta);
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
		return new Bullet(jsonObj.id, jsonObj.x, jsonObj.y, jsonObj.theta, jsonObj.speed);
	}

	// Client side does not need a reference to shooter.
	serialize(): Object {
		return {
			id: this.id,
			x: this.x,
			y: this.y,
      speed: this.speed,
      theta: this.theta
		}
	}
  
}
