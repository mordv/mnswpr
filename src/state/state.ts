import produce from 'immer';
import create, { State } from 'zustand';
import { addInRing, intRange, randomInt, subInRing } from '../utils/utils';

export type MinesAroundType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface CellStateType {
  mine?: boolean;
  flagged?: boolean;
  opened?: boolean;
  minesAround?: MinesAroundType;
  diedAt?: boolean;
}

export type GameStatusType = 'startScreen' | 'customFieldSetup' | 'waitingForFirstHit' | 'game' | 'gameOver' | 'win';
export type DrawingModeType = 'emoji' | 'legacy';

export interface GameStoreType extends State {
  gameStatus: GameStatusType;

  drawingMode: DrawingModeType;
  switchDrawingMode: () => void;

  showHelp: boolean;
  helpWasShown: boolean;
  toggleHelp: () => void;

  startedAt: Date;
  endedAt?: Date;
  width: number;
  height: number;
  minesCount: number;
  position: [number, number];
  cells: CellStateType[][];
  goLeft: () => void;
  goRight: () => void;
  goUp: () => void;
  goDown: () => void;
  flag: () => void;
  open: () => void;
  toStartScreen: () => void;
  startGame: (difficulty: DifficultyType, config?: CustomConfigType) => void;
  setupCustomField: () => void;
  restartGame: () => void;
}

export const difficulties = [`beginner`, `intermediate`, `expert`, `custom`] as const;
export type DifficultyType = typeof difficulties[number];
export interface CustomConfigType {
  width: number;
  height: number;
  mines: number;
}

export const flagCountSelector = (state: GameStoreType): number => state.cells.flat().filter((f) => f.flagged).length;

export const useGameStore = create<GameStoreType>((set, get) => {
  const winIfNeededMutable = (draft: GameStoreType) => {
    const closed = draft.cells.flat().filter((f) => !f.opened);
    if (closed.length === get().minesCount) {
      closed.forEach((c) => (c.flagged = true));
      draft.endedAt = new Date();
      draft.gameStatus = `win`;
    }
  };

  return {
    gameStatus: `startScreen`,
    drawingMode: `emoji`,
    showHelp: false,
    helpWasShown: false,
    toggleHelp: () => set((s) => ({ showHelp: !s.showHelp, helpWasShown: true })),
    width: 0,
    height: 0,
    minesCount: 0,
    position: [0, 0],
    cells: [],
    startedAt: new Date(),
    goLeft: () =>
      gameActive(get().gameStatus) && set(({ width, position: [x, y] }) => ({ position: [x, subInRing(y, width)] })), // todo jump over opened cells?
    goRight: () =>
      gameActive(get().gameStatus) && set(({ width, position: [x, y] }) => ({ position: [x, addInRing(y, width)] })),
    goUp: () =>
      gameActive(get().gameStatus) && set(({ height, position: [x, y] }) => ({ position: [subInRing(x, height), y] })),
    goDown: () =>
      gameActive(get().gameStatus) && set(({ height, position: [x, y] }) => ({ position: [addInRing(x, height), y] })),
    flag: () =>
      gameActive(get().gameStatus) &&
      set(
        produce<GameStoreType>((draft) => {
          const [x, y] = draft.position;
          const cell = draft.cells[x][y];
          if (!cell.opened) {
            cell.flagged = !cell.flagged;
          }
          winIfNeededMutable(draft);
        })
      ),
    open: () =>
      gameActive(get().gameStatus) &&
      set(
        produce<GameStoreType>((draft) => {
          const [x, y] = draft.position;
          if (draft.gameStatus === `waitingForFirstHit`) {
            draft.cells = generateGameField(draft.width, draft.height, draft.minesCount, draft.position);
            draft.gameStatus = `game`;
            openCellMutable(draft.cells, x, y, draft.width, draft.height);
          } else {
            const cell = draft.cells[x][y];
            if (!cell.opened && !cell.flagged) {
              if (cell.mine) {
                cell.diedAt = true;
                draft.endedAt = new Date();
                draft.gameStatus = `gameOver`;
              } else {
                openCellMutable(draft.cells, x, y, draft.width, draft.height);
                winIfNeededMutable(draft);
              }
            }
          }
        })
      ),
    setupCustomField: () => set({ gameStatus: `customFieldSetup` }),
    startGame: (d, config) => {
      const [width, height, minesCount] = getGameSettings(d, config);
      set({
        width,
        height,
        minesCount,
        position: [0, 0],
        cells: generateEmptyCells(width, height),
        gameStatus: `waitingForFirstHit`,
        startedAt: new Date(),
        endedAt: undefined,
      });
    },
    restartGame: () => {
      const { gameStatus, width, height } = get();
      if (([`game`, `gameOver`, `win`] as GameStatusType[]).includes(gameStatus)) {
        set({
          cells: generateEmptyCells(width, height),
          gameStatus: `waitingForFirstHit`,
          startedAt: new Date(),
          endedAt: undefined,
        });
      }
    },
    toStartScreen: () => set({ gameStatus: `startScreen` }),
    switchDrawingMode: () => set((s) => ({ drawingMode: s.drawingMode === `emoji` ? `legacy` : `emoji` })),
  };
});

export const gameActive = (status: GameStatusType): boolean =>
  ([`game`, `waitingForFirstHit`] as GameStatusType[]).includes(status);

// Beginner: 8*8 10 mines
// Intermediate: 16*16 40 mines
// Expert: 16*30 99 mines
// The first click in any game will never be a mine so as it's 8 neighbour cells
const getGameSettings = (
  difficulty: DifficultyType,
  config?: CustomConfigType
): [width: number, height: number, minesCount: number] =>
  difficulty === `beginner`
    ? [8, 8, 10]
    : difficulty === `intermediate`
    ? [16, 16, 40]
    : difficulty === `expert`
    ? [30, 16, 99]
    : difficulty === `custom` && config
    ? [config.width, config.height, config.mines]
    : [8, 8, 10];

const generateMinesPositions = (
  width: number,
  height: number,
  minesCount: number,
  firstHit: [number, number]
): [number, number][] => {
  const res = [] as [number, number][];
  const firstHitNeighbourhood = [...generateNeighbourIndexes(...firstHit, width, height), [...firstHit]]; // don't place mines around first hit;
  while (res.length < minesCount) {
    const newPos = [randomInt(0, height - 1), randomInt(0, width - 1)] as [number, number];
    if (
      res.findIndex(([x, y]) => x === newPos[0] && y === newPos[1]) === -1 &&
      firstHitNeighbourhood.findIndex(([x, y]) => x === newPos[0] && y === newPos[1]) === -1
    ) {
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

const generateEmptyCells = (width: number, height: number) =>
  intRange(height).map(() => intRange(width).map(() => ({} as CellStateType)));

const generateGameField = (width: number, height: number, minesCount: number, firstHit: [number, number]) => {
  const cells = generateEmptyCells(width, height);
  generateMinesPositions(width, height, minesCount, firstHit).forEach(([x, y]) => (cells[x][y].mine = true));
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
    !cell.mine && // fixme don't open flagged cells at first hit;
    generateNeighbourIndexes(x, y, width, height).forEach(([i, j]) => {
      const { opened, flagged, mine } = cells[i][j];
      if (!opened && !flagged && !mine) {
        openCellMutable(cells, i, j, width, height);
      }
    });
};
