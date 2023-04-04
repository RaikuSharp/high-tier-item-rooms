import { postGameStarted } from "./callbacks/postGameStarted";
import { postNewRoomInit } from "./callbacks/postNewRoom";
import { postUpdateInit } from "./callbacks/postUpdate";
import { preGameExitInit } from "./callbacks/preGameExit";
import { modConfigMenuInit } from "./features/ModConfigMenu";

const MOD_NAME = "higher-tier-item-rooms";

main();

function main(): void {
  const mod = RegisterMod(MOD_NAME, 1);
  modConfigMenuInit();
  registerCallbacks(mod);
}

function registerCallbacks(mod: Mod) {
  postUpdateInit(mod);
  postNewRoomInit(mod);
  preGameExitInit(mod);
  postGameStarted(mod);
}
