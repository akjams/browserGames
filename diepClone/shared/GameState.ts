import { Serializable } from './Serializable';
import { Sprite } from './Sprite';
import { Player } from './Player';

export class GameState implements Serializable<GameState> {

  // Map: id -> player which contains it's own id.
  players: Map<string, Player>;

  constructor()  {
    this.players = new Map<string, Player>();
  }

  tick() {
    this.players.forEach((value: Player, key: string) => value.tick());
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.players.forEach((value: Player, key: string) => value.draw(ctx));
  }

  getPlayerById(id: string): Player {
    return this.players.get(id);
  }

  addPlayer(player: Player): void {
    this.players.set(player.getId(), player);
  }

  forEachSprite(callback: (s: Sprite) => void) {
    // TODO: impl this and use in tick, draw 
  }

  serialize(): Object {
    let jsonObj = {
      players: {}
    };
    this.players.forEach((value: Player, key: string) => {
      jsonObj.players[key] = value;
    });
    return jsonObj;
  }

  deserialize(jsonObj): void {
    this.players = new Map<string, Player>();
    Object.entries(jsonObj.players).forEach(([playerId, jsonPlayer]) => {
      this.players.set(playerId, Player.fromJson(jsonPlayer));
    });
  }
}
