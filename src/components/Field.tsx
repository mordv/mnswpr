import React, { Key } from 'react';
import { Box, Newline, Text, useInput } from 'ink';
import { useGameStore } from '../state/state';
import { intRange } from '../utils/utils';

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
  } = useGameStore();

  useInput((input, { downArrow, leftArrow, rightArrow, upArrow }) =>
    leftArrow ? goLeft() : rightArrow ? goRight() : upArrow ? goUp() : downArrow ? goDown() : undefined
  );

  return (
    <Box flexDirection={`column`}>
      <Text>
        {intRange(width).map((i) => (
          <Text key={i as Key}>
            {intRange(height).map((j) => (
              <Text key={j as Key}>{i === x && j === y ? `🟩` : `⬜`}</Text>
            ))}
            <Newline />
          </Text>
        ))}
      </Text>
    </Box>
  );
};
