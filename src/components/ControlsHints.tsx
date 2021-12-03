import React, { useCallback } from 'react';
import { useGameStore } from '../state/state';
import { Box, Newline, Text, useInput } from 'ink';
import { useSymbol } from '../hooks/useSymbol';
import Link from 'ink-link';
import open from 'open';

const repoUrl = `https://github.com/mordv/mnswpr`;
export const ControlsHints: React.VFC = () => {
  const drawingMode = useGameStore((s) => s.drawingMode);
  const switchDrawingMode = useGameStore((s) => s.switchDrawingMode);
  const showHelp = useGameStore((s) => s.showHelp);
  const helpWasShown = useGameStore((s) => s.helpWasShown);
  const toggleHints = useGameStore((s) => s.toggleHelp);
  const gameStatus = useGameStore((s) => s.gameStatus);

  const handleOpen = useCallback(() => open(repoUrl).then(), []);

  useInput((i) => {
    const input = i.toLowerCase();
    input === `l` ? switchDrawingMode() : input === `h` ? toggleHints() : input === `g` ? handleOpen() : undefined;
  });

  const flag = useSymbol(`flag`);
  const bomb = useSymbol(`bomb`);

  return showHelp || !helpWasShown ? (
    <Box flexDirection={`column`} borderStyle={`round`} minWidth={18}>
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
          <Newline />
          <Newline />
          <Link url={repoUrl}>
            <Text>[g] GitHub</Text>
          </Link>
        </Text>
      )}
    </Box>
  ) : null;
};
