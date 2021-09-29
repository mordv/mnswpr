import produce from 'immer';
import create from 'zustand';
import { addInRing, intRange, randomInt, subInRing } from '../utils/utils';

export type MinesAroundType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface CellStateType {
  mine?: boolean;
  flagged?: boolean;
  opened?: boolean;
  minesAround?: MinesAroundType;
}

export interface GameStoreType {
  width: number;
  height: number;
  position: [number, number];
  cells: CellStateType[][];
  goLeft: () => void;
  goRight: () => void;
  goUp: () => void;
  goDown: () => void;
  flag: () => void;
  open: () => void;
}

const defaultSize = 16;
const defaultMinesCount = 40;

// Beginner: 8*8 10 mines
// Intermediate: 16*16 40 mines
// Expert: 16*30 99 mines
// The first click in any game will never be a mine.

const generateMinesPositions = (width: number, height: number, minesCount: number): [number, number][] => {
  const res = [] as [number, number][];
  while (res.length < minesCount) {
    const newPos = [randomInt(0, height - 1), randomInt(0, width - 1)] as [number, number];
    if (res.findIndex(([x, y]) => x === newPos[0] && y === newPos[1]) === -1) {
      res.push(newPos);
    }
  }
  return res;
};

const generateNeighbourIndexes = (i: number, j: number, width: number, height: number): [number, number][] =>
  [-1, 0, 1]
    .map((x) => [-1, 0, 1].map((y) => [x, y]))
    .flat()
    .filter(([x, y]) => !(x === 0 && y === 0))
    .map(([x, y]) => [i + x, j + y] as [number, number])
    .filter(([x, y]) => x >= 0 && x < height && y >= 0 && y < width);

const generateField = (width: number, height: number, minesCount: number) => {
  const cells = intRange(height).map(() => intRange(width).map(() => ({} as CellStateType)));
  generateMinesPositions(width, height, minesCount).forEach(([x, y]) => (cells[x][y].mine = true));
  cells.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (!cell.mine) {
        cell.minesAround =
          generateNeighbourIndexes(i, j, width, height)
            .map(([x, y]) => (cells[x][y].mine ? 1 : 0))
            .reduce((acc, current) => (acc + current) as MinesAroundType, 0) || undefined;
      }
    })
  );
  return cells;
};

const openCellMutable = (cells: CellStateType[][], x: number, y: number, width: number, height: number) => {
  const cell = cells[x][y];
  cell.opened = true;
  !cell.minesAround &&
    !cell.mine &&
    generateNeighbourIndexes(x, y, width, height).forEach(([i, j]) => {
      const { opened, flagged, mine } = cells[i][j];
      if (!opened && !flagged && !mine) {
        openCellMutable(cells, i, j, width, height);
      }
    });
};

/**
      y
    ----->
   |
 x |
   |
  \/
 */
export const useGameStore = create<GameStoreType>((set) => ({
  width: defaultSize,
  height: defaultSize,
  position: [Math.floor(defaultSize / 2), Math.floor(defaultSize / 2)],
  cells: generateField(defaultSize, defaultSize, defaultMinesCount),
  goLeft: () => set(({ width, position: [x, y] }) => ({ position: [x, subInRing(y, width)] })), // todo jump over opened cells?
  goRight: () => set(({ width, position: [x, y] }) => ({ position: [x, addInRing(y, width)] })),
  goUp: () => set(({ height, position: [x, y] }) => ({ position: [subInRing(x, height), y] })),
  goDown: () => set(({ height, position: [x, y] }) => ({ position: [addInRing(x, height), y] })),
  flag: () =>
    set(
      produce((draft) => {
        const [x, y] = draft.position;
        const cell = draft.cells[x][y];
        if (!cell.opened) {
          cell.flagged = !cell.flagged;
        }
      })
    ),
  open: () =>
    set(
      produce((draft) => {
        const [x, y] = draft.position;
        const cell = draft.cells[x][y];
        if (!cell.opened) {
          if (cell.mine) {
            // todo BOOM!
          } else if (!cell.flagged) {
            openCellMutable(draft.cells, x, y, draft.width, draft.height);
          }
        }
      })
    ),
}));
