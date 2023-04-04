export const ReformData = {
  ONE_LINE_ROOM: new Map<number, boolean>([
    [17, true],
    [30, true],
  ]),
  REMOVE_GRID: new Map<number, Array<number>>([
    [3, [66, 68]],
    [24, [35, 39, 95, 99]],
    [28, [40, 55, 85, 100]],
    [29, [35, 39, 96, 99]],
    [31, [66, 67, 68]],
  ]),
  DOUBLE_DEFAULT_OFFSET: new Map<number, Array<number>>([
    [1, [-1, 0]],
    [2, [1, 0]],
  ]),
  ITEM_POS_OFFSET: new Map<number, Map<number, Array<number>>>([
    [8, new Map<number, Array<number>>([[1, [0, 1]]])],
    [27, new Map<number, Array<number>>([[1, [0, -3]]])],
    [28, new Map<number, Array<number>>([[1, [-1, 0]]])],
    [30, new Map<number, Array<number>>([[1, [2, 0]]])],
    [31, new Map<number, Array<number>>([[1, [0, 2]]])],
    [
      37,
      new Map<number, Array<number>>([
        [1, [2, 0]],
        [2, [-2, 0]],
      ]),
    ],
    [
      38,
      new Map<number, Array<number>>([
        [1, [2, 2]],
        [2, [-2, -2]],
      ]),
    ],
    [
      52,
      new Map<number, Array<number>>([
        [1, [1, 0]],
        [2, [-1, 0]],
      ]),
    ],
    [
      54,
      new Map<number, Array<number>>([
        [1, [1, 0]],
        [2, [-1, 0]],
      ]),
    ],
    [
      55,
      new Map<number, Array<number>>([
        [1, [0, 0]],
        [2, [0, 0]],
      ]),
    ],
  ]),
  GRID_OFFSET: new Map<number, Map<number, number>>([
    [
      4,
      new Map<number, number>([
        [65, 64],
        [69, 70],
      ]),
    ],
    [
      5,
      new Map<number, number>([
        [66, 64],
        [68, 70],
      ]),
    ],
    [
      7,
      new Map<number, number>([
        [65, 64],
        [69, 70],
      ]),
    ],
    [
      15,
      new Map<number, number>([
        [51, 35],
        [53, 39],
        [81, 95],
        [83, 99],
      ]),
    ],
  ]),
} as const;
