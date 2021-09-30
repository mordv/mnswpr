import React, { Key } from 'react';
import { Box, Newline, Text, useInput } from 'ink';
import { CellStateType, GameStatusType, MinesAroundType, useGameStore } from '../state/state';
import { intRange } from '../utils/utils';
import { theme } from '../styles/theme';

// export const selector = ({ goDown, goUp, goLeft, goRight, width, height, position: [x, y] }: GameStoreType) => ({
//   goDown,
//   goUp,
//   goLeft,
//   goRight,
//   width,
//   height,
//   x,
//   y,
// });

const mineNumberToColor = (amount: MinesAroundType): string => theme.colors.numbers[amount - 1];
const statusToSmile = (status: GameStatusType): string => {
  switch (status) {
    case `waitingForFirstHit`:
    case `game`:
      return `🙂`;
    case `gameOver`:
      return `💀`;
    case `win`:
      return `😎`;
  }
};

export const Field: React.FC = () => {
  // fixme can't import shallow
  const {
    position: [x, y],
    height,
    width,
    goDown,
    goLeft,
    goRight,
    goUp,
    cells,
    flag,
    open,
    restartGame,
    gameStatus,
  } = useGameStore();

  useInput((input, { ctrl, downArrow, leftArrow, rightArrow, upArrow }) =>
    leftArrow
      ? goLeft()
      : rightArrow
      ? goRight()
      : upArrow
      ? goUp()
      : downArrow
      ? goDown()
      : input.toLowerCase() === `f`
      ? flag()
      : input.toLowerCase() === ` `
      ? open()
      : input.toLowerCase() === `r` && ctrl
      ? restartGame()
      : undefined
  );

  const fill = intRange(width - 1)
    .map(() => ` `)
    .join(``);
  return (
    <Box flexDirection={`column`}>
      <Text backgroundColor={theme.colors.background}>
        {fill}
        {statusToSmile(gameStatus)}
        {fill}
      </Text>
      <Box />
      <Text backgroundColor={theme.colors.background}>
        {intRange(height).map((i) => (
          <Text key={i as Key}>
            {intRange(width).map((j) => (
              <Cell
                key={j as Key}
                gameOver={gameStatus === `gameOver`}
                state={cells[i][j]}
                selected={i === x && j === y}
              />
            ))}
            <Newline />
          </Text>
        ))}
      </Text>
    </Box>
  );
};

interface CellProps {
  state: CellStateType;
  gameOver: boolean;
  selected?: boolean;
}

// todo don't like than the number isn't centered.
const Cell: React.FC<CellProps> = ({ state: { flagged, mine, opened, minesAround, diedAt }, selected, gameOver }) => (
  <Text backgroundColor={gameOver && diedAt ? `#ff0000` : selected ? `#ffffff` : undefined}>
    {minesAround > 0 && opened ? (
      <Text color={mineNumberToColor(minesAround)} bold>
        {` `}
        {minesAround}
      </Text>
    ) : opened && !mine ? (
      `  `
    ) : (opened || gameOver) && mine ? (
      `💣`
    ) : flagged ? (
      `🚩`
    ) : (
      `⬛`
    )}
  </Text>
);
