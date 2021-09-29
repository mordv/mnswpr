import produce from 'immer';
import create from 'zustand';
import { addInRing, intRange, subInRing } from '../utils/utils';

export type MineAmountType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface CellStateType {
  mine?: boolean;
  flagged?: boolean;
  opened?: boolean;
  minesAround?: MineAmountType;
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

const defaultSize = 11;

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
  cells: intRange(defaultSize).map(() =>
    intRange(defaultSize).map(() => ({
      mine: Math.random() > 0.5,
      minesAround: Math.random() < 0.1 ? 4 : Math.random() < 0.5 ? 1 : undefined,
    }))
  ),
  goLeft: () => set(({ width, position: [x, y] }) => ({ position: [x, subInRing(y, width)] })), // todo jump over opened cells
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
        if (cell.mine) {
          // todo BOOM!
        } else if (!cell.flagged) {
          cell.opened = true;
        }
      })
    ),
}));
