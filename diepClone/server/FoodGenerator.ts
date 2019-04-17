import { Food } from '../shared/Food';
import { GameState } from '../shared/GameState';
import { Utils } from '../shared/Utils';
import { Constants } from '../shared/Constants';

const TOTOAL_FOODS = 200;

export class FoodGenerator {
  gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    for (let i = 0; i < TOTOAL_FOODS; i++) {
      let food: Food = new Food(
          Utils.randomId(),
          Utils.randInt(0, Constants.WORLD_WIDTH),
          Utils.randInt(0, Constants.WORLD_HEIGHT));
      gameState.addFood(food);
    }
  }

  // Introduce more food over time here.
  tick() {

  }


}
