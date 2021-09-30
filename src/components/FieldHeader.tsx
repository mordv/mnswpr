import React, { useEffect, useMemo, useState } from 'react';
import { Text } from 'ink';
import { theme } from '../styles/theme';
import { intRange } from '../utils/utils';
import { flagCountSelector, gameActive, GameStatusType, GameStoreType, useGameStore } from '../state/state';

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

const selector = ({ minesCount, gameStatus, width, startedAt }: GameStoreType) => ({
  minesCount,
  gameStatus,
  width,
  startedAt,
});

export const FieldHeader: React.FC = () => {
  const [secondsSpent, setSecondsSpent] = useState(0);

  const flagsCount = useGameStore(flagCountSelector);
  const { minesCount, width, gameStatus, startedAt } = useGameStore(selector);

  useEffect(() => setSecondsSpent(0), [startedAt]);
  useEffect(() => {
    const interval = setInterval(
      () => gameActive(gameStatus) && setSecondsSpent(Math.floor((new Date().getTime() - startedAt.getTime()) / 1000)),
      1000
    );
    return () => clearInterval(interval);
  }, [gameStatus, startedAt]);

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
      intRange(width - 1 - secondsSpent.toString().length)
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
      <Text color={theme.colors.counter}>{secondsSpent}</Text>
    </Text>
  );
};
