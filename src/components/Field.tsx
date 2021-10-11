import React, { Key } from 'react';
import { Box, Newline, Text, useInput } from 'ink';
import { CellStateType, MinesAroundType, useGameStore } from '../state/state';
import { intRange } from '../utils/utils';
import { theme } from '../styles/theme';
import { FieldHeader } from './FieldHeader';
import { useSymbol } from '../hooks/useSymbol';

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
    toStartScreen,
  } = useGameStore();

  useInput((input, { escape, ctrl, downArrow, leftArrow, rightArrow, upArrow }) =>
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
      : escape
      ? toStartScreen()
      : undefined
  );

  return (
    <Box flexDirection={`column`}>
      <FieldHeader />
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
const Cell: React.FC<CellProps> = ({ state: { flagged, mine, opened, minesAround, diedAt }, selected, gameOver }) => {
  const cell = useSymbol(
    opened && !mine ? `openedCell` : (opened || gameOver) && mine ? `bomb` : flagged ? `flag` : `closedCell`
  );

  return (
    <Text
      backgroundColor={
        gameOver && diedAt
          ? theme.colors.diedAtCell
          : selected
          ? theme.colors.selectedCell
          : !opened
          ? theme.colors.closedCell
          : undefined
      }
    >
      {minesAround > 0 && opened ? (
        <Text color={mineNumberToColor(minesAround)} bold>
          {` `}
          {minesAround}
        </Text>
      ) : (
        cell
      )}
    </Text>
  );
};
