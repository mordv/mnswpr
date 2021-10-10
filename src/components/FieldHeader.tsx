import React, { useEffect, useMemo, useState } from 'react';
import { Text } from 'ink';
import { theme } from '../styles/theme';
import { intRange } from '../utils/utils';
import { flagCountSelector, GameStatusType, GameStoreType, useGameStore } from '../state/state';

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

const selector = ({ minesCount, gameStatus, width, startedAt, endedAt }: GameStoreType) => ({
  minesCount,
  gameStatus,
  width,
  startedAt,
  endedAt,
});

export const FieldHeader: React.FC = () => {
  const [secondsSpent, setSecondsSpent] = useState<number>();

  const flagsCount = useGameStore(flagCountSelector);
  const { minesCount, width, gameStatus, startedAt, endedAt } = useGameStore(selector);

  useEffect(
    () =>
      setSecondsSpent(endedAt && startedAt ? Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000) : undefined),
    [endedAt, startedAt]
  );

  const minesLeft = useMemo(() => (minesCount - flagsCount).toString(), [minesCount, flagsCount]);

  const fillLeft = useMemo(
    () =>
      intRange(width - 1 - minesLeft.length)
        .map(() => ` `)
        .join(``),
    [width, minesLeft.length]
  );

  const fillRight = useMemo(
    () =>
      intRange(width - `😎`.length / 2 - (secondsSpent?.toString()?.length + `s`.length || 0))
        .map(() => ` `)
        .join(``),
    [width, secondsSpent]
  );

  return (
    <Text backgroundColor={theme.colors.background}>
      <Text color={theme.colors.counter}>{minesLeft}</Text>
      {fillLeft}
      {statusToSmile(gameStatus)}
      {fillRight}
      {secondsSpent && <Text color={theme.colors.counter}>{secondsSpent}s</Text>}
    </Text>
  );
};
