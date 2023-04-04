import { ModCallbackCustom, upgradeMod } from "isaacscript-common";
import { postNewRoom } from "../features/MorePedestals";

export function postNewRoomInit(mod: Mod): void {
  let modUp = upgradeMod(mod);
  modUp.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, main);
}

function main() {
  postNewRoom();
}
