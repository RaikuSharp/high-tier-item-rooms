import { ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom, upgradeMod } from "isaacscript-common";
import { roll } from "../features/ItemRolling";
import { postNewRoom } from "../features/MorePedestals";

export function postNewRoomInit(mod: Mod): void {
  let modUp = upgradeMod(mod);
  modUp.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, main);
  mod.AddCallback(ModCallback.PRE_GET_COLLECTIBLE, roll);
}

function main() {
  postNewRoom();
}
