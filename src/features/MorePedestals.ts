import {
  CollectibleType,
  EntityType,
  GridEntityType,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import { log } from "isaacscript-common";
import { ReformData } from "../data/ReformData";
import { settings } from "../data/settings";
import { getItem } from "./ItemRolling";

function isFirstItemRoom(room: Room) {
  if (
    settings.ROOMS.has(room.GetType()) &&
    room.IsFirstVisit() &&
    room.GetType() !== RoomType.SHOP
  ) {
    if (settings.ALWAYS_ON) {
      return true;
    }
  }
  return false;
}

function roomReform(room: Room, oPos: Vector[]) {
  let roomV = Game().GetLevel().GetCurrentRoomDesc().Data!.Variant;
  let positions = new Array<Vector>();

  if (ReformData.REMOVE_GRID.has(roomV)) {
    for (const v of ReformData.REMOVE_GRID.get(roomV)!) {
      log(`Trying to remove grid ${v}`);
      let gridEntity = room.GetGridEntity(v);
      if (gridEntity === undefined) {
        log("GridEntity not found");

        for (const entity of Isaac.GetRoomEntities()) {
          if (
            entity.Type === EntityType.FIREPLACE &&
            entity.Position.Distance(room.GetGridPosition(v)) < 20
          ) {
            entity.Remove();
          }
        }
      } else if (gridEntity.GetType() === GridEntityType.BLOCK) {
        room.RemoveGridEntity(v, 0, true);
      } else {
        log(`Default grid type: ${gridEntity.GetType()}`);
        room.GetGridEntity(v)?.Destroy(true);
      }
    }
  }

  let posOffset = ReformData.ITEM_POS_OFFSET.get(roomV);
  if (posOffset === undefined) {
    if (oPos.length === 2) {
      posOffset = ReformData.DOUBLE_DEFAULT_OFFSET;
    } else {
      posOffset = new Map<number, Array<number>>([[1, [0, 0]]]);
    }
  }

  for (const [i, offset] of posOffset) {
    positions.push(oPos[i]!.add(Vector(offset[1]!, offset[2]!).mul(40)));
  }

  let gridOffset = ReformData.GRID_OFFSET.get(roomV);

  if (gridOffset !== undefined) {
    for (const [origin, target] of gridOffset) {
      let oGrid = room.GetGridEntity(origin);
      room.SpawnGridEntity(
        target,
        oGrid!.GetType(),
        oGrid!.GetVariant(),
        room.GetSpawnSeed(),
        0,
      );
      if (oGrid?.GetType() === GridEntityType.WALL) {
        room.RemoveGridEntity(origin, 0, true);
      } else {
        room.GetGridEntity(origin)?.Destroy(true);
      }
    }
  }

  return positions;
}

export function spawnItems(
  positions: Vector[],
  room: Room,
  itemList: CollectibleType[],
  oneLine: boolean,
) {
  let OFFSETS = [
    Vector(0, -1),
    Vector(0, 1),
    Vector(-1, 0),
    Vector(1, 0),
    Vector(-1, 1),
    Vector(1, -1),
    Vector(-1, -1),
    Vector(1, 1),
  ];

  if (oneLine !== undefined) {
    OFFSETS = [
      Vector(0, 0),
      Vector(-1, 0),
      Vector(1, 0),
      Vector(-2, 0),
      Vector(2, 0),
      Vector(-3, 0),
      Vector(3, 0),
      Vector(-4, 0),
    ];
  }

  log(`Ready to spawn ${positions.length} items`);
  let GRID_POS_WIDTH = 40;
  for (let i = 0; i <= settings.ITEM_COUNT - 1; i++) {
    for (let j = 0; j <= positions.length - 1; j++) {
      let pos = positions[j]!.add(OFFSETS[i]!.mul(GRID_POS_WIDTH));
      pos = room.FindFreeTilePosition(pos, GRID_POS_WIDTH / 2);

      let nextSeed = Game().GetSeeds().GetNextSeed();
      let roomType = Game().GetRoom().GetType();
      let itemPoolForRoom = Game()
        .GetItemPool()
        .GetPoolForRoom(roomType, nextSeed);

      let item = getItem(itemPoolForRoom, false, nextSeed)!;

      if (itemList.length > 0) {
        let tempItem = Isaac.GetItemConfig().GetCollectible(
          itemList[itemList.length - 1]!,
        );
        if (tempItem!.Quality >= settings.TIER_THRESHOLD) {
          item = tempItem!.ID;
        }
        itemList.pop();
      }

      let spawnedEntity = Game().Spawn(
        EntityType.PICKUP,
        PickupVariant.COLLECTIBLE,
        pos,
        Vector(0, 0),
        undefined,
        item,
        room.GetSpawnSeed(),
      );

      if (settings.SINGLE_CHOICE) {
        spawnedEntity.ToPickup()!.OptionsPickupIndex = 1;
      }
    }
  }
}

let spawnCountDown: number;
spawnCountDown = 0;

let _kPositions: Vector[] = [];
let _kItemList: number[] = [];

export function postNewRoom() {
  if (isFirstItemRoom(Game().GetRoom())) {
    spawnCountDown = 2;
    for (let entity of Isaac.GetRoomEntities()) {
      if (
        entity.Type === EntityType.PICKUP &&
        entity.Variant == PickupVariant.COLLECTIBLE
      ) {
        _kPositions.push(entity.Position);
        _kItemList.push(entity.SubType);
        entity.Remove();
      }
    }
  }
}

export function postUpdate() {
  if (spawnCountDown === 2) {
    spawnCountDown = 1;
    _kPositions = roomReform(Game().GetRoom(), _kPositions);
  } else if (spawnCountDown === 1) {
    spawnCountDown = 0;
    let roomV = Game().GetLevel().GetCurrentRoomDesc().Data!.Variant;
    spawnItems(
      _kPositions,
      Game().GetRoom(),
      _kItemList,
      ReformData.ONE_LINE_ROOM.get(roomV)!,
    );
    _kPositions.length = 0;
    _kItemList.length = 0;
  }
}
