import React, { useCallback, useLayoutEffect } from 'react';
import { clear, CliFlagsType } from './cli';
import { Field } from './components/Field';
import { useGameStore } from './state/state';
import { MainMenu } from './components/MainMenu';
import { CustomFieldMenu } from './components/CustomFieldMenu';
import { Box, useApp, useInput, useStdin } from 'ink';

const useExitWithClear = () => {
  const { exit } = useApp();
  return useCallback(() => {
    clear();
    exit();
  }, [exit]);
};

const ctrlC = `\x03`;
export const App: React.VFC<Pick<CliFlagsType, 'center'>> = ({ center }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);

  // manually handle ctrl+c, as ink doesn't allow clean before exit;
  const { stdin } = useStdin();
  const exit = useExitWithClear();
  useLayoutEffect(() => {
    const listener = (input: string) => input === ctrlC && exit();
    stdin.addListener(`data`, listener);
    return () => void stdin.removeListener(`data`, listener);
  });
  useInput((_, { escape }) => escape && exit(), { isActive: gameStatus === `startScreen` });

  return (
    <Box marginLeft={2} marginRight={2} marginTop={1} flexDirection={`column`}>
      {gameStatus === `startScreen` ? (
        <MainMenu />
      ) : gameStatus === `customFieldSetup` ? (
        <CustomFieldMenu />
      ) : (
        <Field center={center} />
      )}
    </Box>
  );
};
