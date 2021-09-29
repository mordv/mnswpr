import create from 'zustand';
import { addInRing, subInRing } from '../utils/utils';

export interface GameStoreType {
  width: number;
  height: number;
  position: [number, number];
  goLeft: () => void;
  goRight: () => void;
  goUp: () => void;
  goDown: () => void;
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
  goLeft: () => set(({ width, position: [x, y] }) => ({ position: [x, subInRing(y, width)] })),
  goRight: () => set(({ width, position: [x, y] }) => ({ position: [x, addInRing(y, width)] })),
  goUp: () => set(({ height, position: [x, y] }) => ({ position: [subInRing(x, height), y] })),
  goDown: () => set(({ height, position: [x, y] }) => ({ position: [addInRing(x, height), y] })),
}));
