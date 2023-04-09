import { Difficulty, RoomType } from "isaac-typescript-definitions";
import { jsonDecode, jsonEncode } from "isaacscript-common";
import { settings } from "../data/settings";

export function loadSettings(isContinue: boolean, mod: Mod) {
  // log("Loading settings");
  if (mod.HasData()) {
    const serialized = Isaac.LoadModData(mod);
    const deserialized = jsonDecode(serialized);
    const savedVersion = deserialized.get("version") as string;
    if (savedVersion === settings._VERSION) {
      const modes = deserialized.get("modes") as Difficulty[];
      settings.MODES.clear();
      for (const mode of modes) {
        settings.MODES.add(mode);
      }

      const rooms = deserialized.get("rooms") as RoomType[];
      settings.ROOMS.clear();
      for (const room of rooms) {
        settings.ROOMS.add(room);
      }

      if (!isContinue) {
        settings.SPENT_ROLL = false;
      }

      const a = deserialized.get("alwaysOn") as boolean;
      settings.ALWAYS_ON = a;

      const itemTier = deserialized.get("item_tier") as number;
      settings.TIER_THRESHOLD = itemTier;

      const itemCount = deserialized.get("item_count") as number;
      settings.ITEM_COUNT = itemCount;

      const single_choice = deserialized.get("single_choice") as boolean;
      settings.SINGLE_CHOICE = single_choice;
    }
  }
}

export function saveSettings(mod: Mod) {
  const enabledModes = [];
  for (const mode of settings.MODES.values()) {
    enabledModes.push(mode);
  }

  const enabledRooms = [];
  for (const room of settings.ROOMS.values()) {
    enabledRooms.push(room);
  }
  const toSerialize = {
    modes: enabledModes,
    rooms: enabledRooms,
    alwaysOn: settings.ALWAYS_ON,
    version: settings._VERSION,
    item_tier: settings.TIER_THRESHOLD,
    item_count: settings.ITEM_COUNT,
    single_choice: settings.SINGLE_CHOICE,
  };

  mod.SaveData(jsonEncode(toSerialize));
}
