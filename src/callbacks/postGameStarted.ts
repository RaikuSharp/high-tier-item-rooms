import { ModCallbackCustom, upgradeMod } from "isaacscript-common";
import { loadSettings } from "../features/data";

export function postGameStarted(mod: Mod): void {
  let modUp = upgradeMod(mod);
  modUp.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    (isContinue) => {
      loadSettings(isContinue, mod);
    },
    undefined,
  );
}
