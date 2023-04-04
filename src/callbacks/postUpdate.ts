import { ModCallback } from "isaac-typescript-definitions";
import { postUpdate } from "../features/MorePedestals";

export function postUpdateInit(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {
  postUpdate();
}
