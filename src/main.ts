import {
  Difficulty,
  ItemPoolType,
  RoomType,
} from "isaac-typescript-definitions";
import { ModCallback } from "isaac-typescript-definitions/dist/src/enums/ModCallback";
import {
  ModCallbackCustom,
  jsonDecode,
  jsonEncode,
  log,
  upgradeMod,
} from "isaacscript-common";

const MOD_NAME = "higher-tier-item-rooms";
const modVanilla = RegisterMod(MOD_NAME, 1);
const mod = upgradeMod(modVanilla);

let settings = {
  ALWAYS_ON: false,
  TIER_THRESHOLD: 3,
  SPENT_ROLL: true,
  MODES: new Set<Difficulty>(),
  ROOMS: new Set<RoomType>(),
  _VERSION: "2.0",
};

const game = Game();

main();

function main() {
  if (ModConfigMenu !== undefined) {
    log("Mod Menu found");
    mod.AddCallbackCustom(
      ModCallbackCustom.POST_GAME_STARTED_REORDERED,
      loadSettings,
      undefined,
    );
    mod.AddCallback(ModCallback.PRE_GAME_EXIT, saveSettings);
  }
}

function addMCMSetting(
  section: string,
  key: number,
  description: string,
  info: string,
) {
  if (ModConfigMenu !== undefined) {
    const newSetting: ModConfigMenuSetting = {
      CurrentSetting: (): boolean => {
        if (section === "Modes") {
          return settings.MODES.has(key);
        } else if (section === "Rooms") {
          return settings.ROOMS.has(key);
        }
        return false;
      },
      Display: () => {
        let onOff = "Disabled";
        if (section === "Modes") {
          if (settings.MODES.has(key)) {
            onOff = "Enabled";
          }
        } else if (section === "Rooms") {
          if (settings.ROOMS.has(key)) {
            onOff = "Enabled";
          }
        }
        return description + ": " + onOff;
      },
      Info: [info],
      OnChange: () => {
        if (section === "Modes") {
          if (settings.MODES.has(key)) {
            settings.MODES.delete(key);
          } else {
            settings.MODES.add(key);
          }
        } else if (section === "Rooms") {
          if (settings.ROOMS.has(key)) {
            settings.ROOMS.delete(key);
          } else {
            settings.ROOMS.add(key);
          }
        }
      },
      Type: ModConfigMenuOptionType.BOOLEAN,
    };

    ModConfigMenu.AddSetting("HTIR", section, newSetting);
  }
}

if (ModConfigMenu !== undefined) {
  const name = "HTIR";

  ModConfigMenu.AddSpace(name, "About");
  ModConfigMenu.AddText(name, "About", () => "Higher Tier Item Rooms");
  ModConfigMenu.AddSpace(name, "About");
  ModConfigMenu.AddText(name, "About", () => `Version ${settings._VERSION}`);
  ModConfigMenu.AddSpace(name, "About");
  ModConfigMenu.AddText(name, "About", () => "by Kanjo");

  ModConfigMenu.AddText(name, "Settings", () => "Higher Tier Item Rooms");
  ModConfigMenu.AddSetting(name, "Settings", {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => {
      return settings.ALWAYS_ON;
    },
    Display: () => {
      let onOff = "Disabled";
      if (settings.ALWAYS_ON) {
        onOff = "Enabled";
      }
      return `All Item Rooms: ${onOff}`;
    },
    OnChange: (currentBool) => {
      settings.ALWAYS_ON = currentBool as boolean;
    },
    Info: ["Toggle this setting to reroll every enabled room"],
  });

  ModConfigMenu.AddSetting(name, "Settings", {
    Type: ModConfigMenuOptionType.NUMBER,
    CurrentSetting: () => {
      return settings.TIER_THRESHOLD;
    },
    Minimum: 0,
    Maximum: 4,
    Display: () => {
      return `Minimum item tier: ${settings.TIER_THRESHOLD}`;
    },
    OnChange: (currentNum) => {
      settings.TIER_THRESHOLD = currentNum as number;
    },
    Info: ["Minimum tier for rolling items"],
  });

  addMCMSetting("Modes", Difficulty.NORMAL, "Normal Mode", "");
  addMCMSetting("Modes", Difficulty.HARD, "Hard Mode", "");
  addMCMSetting("Modes", Difficulty.GREED, "Greed Mode", "");
  addMCMSetting("Modes", Difficulty.GREEDIER, "Greedier Mode", "");

  addMCMSetting("Rooms", RoomType.SHOP, "Shop", "");
  addMCMSetting("Rooms", RoomType.TREASURE, "Treasure room", "");
  addMCMSetting("Rooms", RoomType.DEVIL, "Devil room", "");
  addMCMSetting("Rooms", RoomType.ANGEL, "Angel room", "");
}

function getItem(itemPoolType: ItemPoolType, decrease: boolean, seed: Seed) {
  let foundItem = false;
  let item = undefined;

  while (!foundItem) {
    let collectible = game
      .GetItemPool()
      .GetCollectible(itemPoolType, decrease, seed);
    item = Isaac.GetItemConfig().GetCollectible(collectible);
    if (item?.IsCollectible() && item.Quality >= settings.TIER_THRESHOLD) {
      log("rolled: " + item.Name);
      foundItem = true;
    }
  }

  if (item !== undefined) {
    return item.ID;
  }
  return undefined;
}

function roll(itemPoolType: ItemPoolType, decrease: boolean, seed: Seed) {
  let roomType = game.GetRoom().GetType();
  let difficulty = game.Difficulty;

  log(`Room Type is: ${roomType}`);
  log(`Difficulty is: ${difficulty}`);

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

function loadSettings(isContinue: boolean) {
  log("Loading settings");
  if (mod.HasData()) {
    const serialized = Isaac.LoadModData(modVanilla);
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

      if (!settings.SPENT_ROLL) {
        mod.AddCallback(ModCallback.PRE_GET_COLLECTIBLE, roll);
      }
    }
  }
}

function saveSettings() {
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
  };

  mod.SaveData(jsonEncode(toSerialize));
}
