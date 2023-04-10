import { RoomType } from "isaac-typescript-definitions";
import { settings } from "../data/settings";

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

export function modConfigMenuInit() {
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
        return `First Floor Only: ${onOff}`;
      },
      OnChange: (currentBool) => {
        settings.ALWAYS_ON = currentBool as boolean;
      },
      Info: ["Toggle to enable only for the first floor"],
    });

    ModConfigMenu.AddSetting(name, "Settings", {
      Type: ModConfigMenuOptionType.BOOLEAN,
      CurrentSetting: () => {
        return settings.SINGLE_CHOICE;
      },
      Display: () => {
        let onOff = "Disabled";
        if (settings.SINGLE_CHOICE) {
          onOff = "Enabled";
        }
        return `Single choice: ${onOff}`;
      },
      OnChange: (currentBool) => {
        settings.SINGLE_CHOICE = currentBool as boolean;
      },
      Info: ["Toggle this to either only get one item or all items"],
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

    ModConfigMenu.AddSetting(name, "Settings", {
      Type: ModConfigMenuOptionType.NUMBER,
      CurrentSetting: () => {
        return settings.ITEM_COUNT;
      },
      Minimum: 1,
      Maximum: 4,
      Display: () => {
        return `Item amount: ${settings.ITEM_COUNT}`;
      },
      OnChange: (currentNum) => {
        settings.ITEM_COUNT = currentNum as number;
      },
      Info: ["Minimum amount of items to spawn"],
    });

    // addMCMSetting("Modes", Difficulty.NORMAL, "Normal Mode", "");
    // addMCMSetting("Modes", Difficulty.HARD, "Hard Mode", "");
    // addMCMSetting("Modes", Difficulty.GREED, "Greed Mode", "");
    // addMCMSetting("Modes", Difficulty.GREEDIER, "Greedier Mode", "");

    addMCMSetting("Rooms", RoomType.SHOP, "Shop", "");
    addMCMSetting("Rooms", RoomType.TREASURE, "Treasure room", "");
    addMCMSetting("Rooms", RoomType.DEVIL, "Devil room", "");
    addMCMSetting("Rooms", RoomType.ANGEL, "Angel room", "");
  }
}
