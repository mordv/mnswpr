import React from 'react';
import { useGameStore } from '../state/state';
import { Box, Newline, Text, useInput } from 'ink';
import { useSymbol } from '../hooks/useSymbol';

export const ControlsHints: React.FC = () => {
  const drawingMode = useGameStore((s) => s.drawingMode);
  const switchDrawingMode = useGameStore((s) => s.switchDrawingMode);
  const showHelp = useGameStore((s) => s.showHelp);
  const helpWasShown = useGameStore((s) => s.helpWasShown);
  const toggleHints = useGameStore((s) => s.toggleHelp);
  const gameStatus = useGameStore((s) => s.gameStatus);

  useInput((i) =>
    i.toLowerCase() === `l` ? switchDrawingMode() : i.toLowerCase() === `h` ? toggleHints() : undefined
  );

  const flag = useSymbol(`flag`);
  const bomb = useSymbol(`bomb`);

  return showHelp || !helpWasShown ? (
    <Box flexDirection={`column`} borderStyle={`round`} width={26}>
      <Text>[h] {showHelp ? `Hide help` : `Show help`}</Text>
      {showHelp && (
        <Text>
          [l] {drawingMode === `emoji` ? `Emoji mode ` : `Legacy mode`}
          {flag}
          {bomb}
          <Newline />
          [arrows] Move
          <Newline />
          [f] Flag
          <Newline />
          [space|enter] Open cell
          <Newline />
          [ctrl+r] Restart
          <Newline />
          [escape] {gameStatus === `startScreen` ? `Exit` : `Menu`}
        </Text>
      )}
    </Box>
  ) : null;
};
