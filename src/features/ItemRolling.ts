import { ItemPoolType } from "isaac-typescript-definitions";
import { nextSeed } from "isaacscript-common";
import { settings } from "../data/settings";

function getItem(itemPoolType: ItemPoolType, decrease: boolean, seed: Seed) {
  let foundItem = false;
  let item: Readonly<ItemConfigItemCollectible> | undefined;

  while (!foundItem) {
    seed = nextSeed(seed);
    let collectible = Game()
      .GetItemPool()
      .GetCollectible(itemPoolType, decrease, seed);
    item = Isaac.GetItemConfig().GetCollectible(collectible);
    if (item?.IsCollectible() && item.Quality >= settings.TIER_THRESHOLD) {
      foundItem = true;
    }
  }

  if (item !== undefined) {
    return item.ID;
  }
  return undefined;
}

function roll(itemPoolType: ItemPoolType, decrease: boolean, seed: Seed) {
  let roomType = Game().GetRoom().GetType();
  let difficulty = Game().Difficulty;

  // log(`Room Type is: ${roomType}`);
  // log(`Difficulty is: ${difficulty}`);

  if (settings.SPENT_ROLL) {
    return;
  }

  if (difficulty && roomType !== undefined) {
    if (settings.MODES.has(difficulty) && settings.ROOMS.has(roomType)) {
      if (!settings.ALWAYS_ON) {
        settings.SPENT_ROLL = true;
      }
      return getItem(itemPoolType, decrease, seed);
    }
  }
  return undefined;
}
