import { Text } from 'ink';
import React from 'react';
import { gameActive, useGameStore } from '../state/state';
import { theme } from '../styles/theme';

export type SymbolType = 'flag' | 'bomb' | 'closedCell' | `openedCell` | 'faceAlive' | 'faceWin' | 'faceDead';

const emojiMode: Record<SymbolType, JSX.Element> = {
  flag: <Text>🚩</Text>,
  bomb: <Text>💣</Text>,
  closedCell: <Text>{`  `}</Text>,
  openedCell: <Text>{`  `}</Text>,
  faceAlive: <Text>🙂</Text>,
  faceWin: <Text>😎</Text>,
  faceDead: <Text>💀</Text>,
};

const legacyMode: Record<SymbolType, JSX.Element> = {
  flag: <Text color={theme.colors.flagColor}>{` ►`}</Text>,
  bomb: <Text color={theme.colors.bombColor}>{` ✶`}</Text>,
  closedCell: <Text>{`  `}</Text>,
  openedCell: <Text>{`  `}</Text>,
  faceAlive: <Text color={theme.colors.smileColor}>:)</Text>,
  faceWin: <Text color={theme.colors.bombColor}>;)</Text>,
  faceDead: <Text color={theme.colors.flagColor}>;(</Text>,
};

export const useSymbol = (symbol: SymbolType): JSX.Element => {
  const mode = useGameStore((s) => s.drawingMode);
  return (mode === `emoji` ? emojiMode : legacyMode)[symbol];
};

export const useStatusSymbol = (): JSX.Element => {
  const status = useGameStore((s) => s.gameStatus);
  return useSymbol(gameActive(status) ? `faceAlive` : status === `gameOver` ? `faceDead` : `faceWin`);
};
