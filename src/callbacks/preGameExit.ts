import { ModCallback } from "isaac-typescript-definitions";
import { saveSettings } from "../features/data";

export function preGameExitInit(mod: Mod): void {
  mod.AddCallback(ModCallback.PRE_GAME_EXIT, () => {
    saveSettings(mod);
  });
}
