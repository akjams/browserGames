import { Serializable } from './Serializable';
import { Sprite } from './Sprite';
import { Player } from './Player';
import { Bullet } from './Bullet';
import { Food } from './Food';

export class GameState implements Serializable<GameState> {

  // Map: id -> player which contains it's own id.
  players: Map<string, Player>;
  foods: Map<string, Food>;
  bullets: Map<string, Bullet>;

  constructor()  {
    this.players = new Map<string, Player>();
    this.foods = new Map<string, Food>();
    this.bullets = new Map<string, Bullet>();
  }

  tick() {
    this.forEachSprite((sprite: Sprite) => sprite.tick());
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.forEachSprite((sprite: Sprite) => sprite.draw(ctx));
  }

  getPlayerById(id: string): Player {
    return this.players.get(id);
  }

  removePlayerById(id: string): void {
    this.players.delete(id);
  }

  addPlayer(player: Player): void {
    this.players.set(player.getId(), player);
  }

  addFood(food: Food): void {
    this.foods.set(food.getId(), food);
  }

  addBullet(bullet: Bullet): void {
    this.bullets.set(bullet.getId(), bullet);
  }

  forEachSprite(callback: (s: Sprite) => void) {
    this.players.forEach((value: Player, key: string) => { callback(value) });
    this.foods.forEach((value: Food, key: string) => { callback(value) });
    this.bullets.forEach((value: Bullet, key: string) => { callback(value) });
  }

  serialize(): Object {
    let jsonObj = {
      players: {},
      foods: {},
      bullets: {}
    };
    this.players.forEach((value: Player, key: string) => {
      jsonObj.players[key] = value;
    });
    this.foods.forEach((value: Food, key: string) => {
      jsonObj.foods[key] = value;
    });
    this.bullets.forEach((value: Bullet, key: string) => {
      jsonObj.bullets[key] = value.serialize();
    });
    return jsonObj;
  }

  deserialize(jsonObj): void {
    this.players = new Map<string, Player>();
    Object.entries(jsonObj.players).forEach(([playerId, jsonPlayer]) => {
      this.players.set(playerId, Player.fromJson(jsonPlayer));
    });
    this.foods = new Map<string, Food>();
    Object.entries(jsonObj.foods).forEach(([id, jsonFood]) => {
      this.foods.set(id, Food.fromJson(jsonFood));
    });
    this.bullets = new Map<string, Bullet>();
    Object.entries(jsonObj.bullets).forEach(([id, jsonBullet]) => {
      this.bullets.set(id, Bullet.fromJson(jsonBullet));
    });
  }
}
