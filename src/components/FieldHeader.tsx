import React, { useEffect, useMemo, useState } from 'react';
import { Text } from 'ink';
import { theme } from '../styles/theme';
import { intRange } from '../utils/utils';
import { flagCountSelector, GameStoreType, useGameStore } from '../state/state';
import { useStatusSymbol } from '../hooks/useSymbol';

const selector = ({ minesCount, width, startedAt, endedAt }: GameStoreType) => ({
  minesCount,
  width,
  startedAt,
  endedAt,
});

export const FieldHeader: React.FC = () => {
  const [secondsSpent, setSecondsSpent] = useState<string>();

  const flagsCount = useGameStore(flagCountSelector);
  const { minesCount, width, startedAt, endedAt } = useGameStore(selector);

  useEffect(
    () =>
      setSecondsSpent(endedAt && startedAt ? ((endedAt.getTime() - startedAt.getTime()) / 1000).toFixed(1) : undefined),
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

  const statusSymbol = useStatusSymbol();

  const fillRight = useMemo(
    () =>
      intRange(width - 1 - (secondsSpent?.length + `s`.length || 0))
        .map(() => ` `)
        .join(``),
    [width, secondsSpent]
  );

  return (
    <Text backgroundColor={theme.colors.background}>
      <Text color={theme.colors.counter}>{minesLeft}</Text>
      {fillLeft}
      {statusSymbol}
      {fillRight}
      {secondsSpent && <Text color={theme.colors.counter}>{secondsSpent}s</Text>}
    </Text>
  );
};
