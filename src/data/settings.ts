import { Difficulty, RoomType } from "isaac-typescript-definitions";

export let settings = {
  ALWAYS_ON: true,
  SINGLE_CHOICE: false,
  TIER_THRESHOLD: 3,
  ITEM_COUNT: 4,
  SPENT_ROLL: false,
  MODES: new Set<Difficulty>(),
  ROOMS: new Set<RoomType>(),
  IS_COOP: true,
  _VERSION: "2.6.1",
};
