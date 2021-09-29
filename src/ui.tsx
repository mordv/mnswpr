import React, { FC, Key } from 'react';
import { Box, Newline, Text } from 'ink';
import { CliFlagsType } from './cli';

const randomEmoji = (): string => {
  const r = Math.random();
  return r < 0.1 ? `💣` : r < 0.6 ? `🔲` : r < 0.8 ? `🚩` : `🔲`;
};

const size = 20;
export const App: FC<CliFlagsType> = () => (
  <Box flexDirection={`column`}>
    <Text>
      {Array.from({ length: size }).map((_, i) => (
        <Text key={i as Key}>
          {Array.from({ length: size }).map((_, j) => (
            <Text key={j as Key}>{randomEmoji()}</Text>
          ))}
          <Newline />
        </Text>
      ))}
    </Text>
  </Box>
);
