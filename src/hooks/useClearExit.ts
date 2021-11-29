import { useCallback, useLayoutEffect } from 'react';
import { useApp, useInput, useStdin } from 'ink';
import { useGameStore } from '../state/state';
import { clear } from '../cli';

const ctrlC = `\x03`;
export const useClearExit = (): void => {
  const gameStatus = useGameStore((s) => s.gameStatus);

  const { exit } = useApp();
  const exitWithClear = useCallback(() => {
    clear();
    exit();
  }, [exit]);

  // manually handle ctrl+c, as ink doesn't allow clean before exit;
  const { stdin } = useStdin();
  useLayoutEffect(() => {
    const listener = (input: string) => input === ctrlC && exitWithClear();
    stdin.addListener(`data`, listener);
    return () => void stdin.removeListener(`data`, listener);
  });
  useInput((_, { escape }) => escape && exitWithClear(), { isActive: gameStatus === `startScreen` });
};
