import { Difficulty, RoomType } from "isaac-typescript-definitions";

export let settings = {
  ALWAYS_ON: false,
  SINGLE_CHOICE: true,
  TIER_THRESHOLD: 0,
  ITEM_COUNT: 1,
  SPENT_ROLL: false,
  MODES: new Set<Difficulty>(),
  ROOMS: new Set<RoomType>(),
  IS_COOP: true,
  _VERSION: "2.6.5",
};
