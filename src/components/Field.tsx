import React, { Key } from 'react';
import { Box, Newline, Text, useInput } from 'ink';
import { CellStateType, MinesAroundType, useGameStore } from '../state/state';
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
  } = useGameStore();

  useInput((input, { downArrow, leftArrow, rightArrow, upArrow }) =>
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
      : undefined
  );

  return (
    <Box flexDirection={`column`}>
      <Text backgroundColor={theme.colors.background}>
        {intRange(height).map((i) => (
          <Text key={i as Key}>
            {intRange(width).map((j) => (
              <Cell key={j as Key} state={cells[i][j]} selected={i === x && j === y} />
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
  selected?: boolean;
}

// todo don't like than the number isn't centered.
const Cell: React.FC<CellProps> = ({ state: { flagged, mine, opened, minesAround }, selected }) => (
  <Text backgroundColor={selected ? `#ffffff` : undefined}>
    {minesAround > 0 && opened ? (
      <Text color={mineNumberToColor(minesAround)} bold>
        {` `}
        {minesAround}
      </Text>
    ) : flagged ? (
      `🚩`
    ) : opened && !mine ? (
      `  `
    ) : opened && mine ? (
      `💣`
    ) : (
      `⬛`
    )}
  </Text>
);
