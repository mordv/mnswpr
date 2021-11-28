import React, { Key } from 'react';
import { Box, Newline, Text, useInput } from 'ink';
import { CellStateType, MinesAroundType, useGameStore } from '../state/state';
import { intRange } from '../utils/utils';
import { theme } from '../styles/theme';
import { FieldHeader } from './FieldHeader';
import { useSymbol } from '../hooks/useSymbol';
import { ControlsHints } from './ControlsHints';

const mineNumberToColor = (amount: MinesAroundType): string => theme.colors.numbers[amount - 1];

interface FieldProps {
  center?: boolean;
}

export const Field: React.FC<FieldProps> = ({ center }) => {
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

  useInput((input, { escape, ctrl, return: enter, downArrow, leftArrow, rightArrow, upArrow }) =>
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
      : input.toLowerCase() === ` ` || enter
      ? open()
      : input.toLowerCase() === `r` && ctrl
      ? restartGame()
      : escape
      ? toStartScreen()
      : undefined
  );

  return (
    <Box flexDirection={`column`} alignItems={center ? `center` : `flex-start`} justifyContent={`center`}>
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
      <ControlsHints />
    </Box>
  );
};

interface CellProps {
  state: CellStateType;
  gameOver: boolean;
  selected?: boolean;
}

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
