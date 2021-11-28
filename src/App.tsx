import React, { FC, useLayoutEffect } from 'react';
import { CliFlagsType } from './cli';
import { Field } from './components/Field';
import { CustomConfigType, DifficultyType, useGameStore } from './state/state';
import { MainMenu } from './components/MainMenu';
import { CustomFieldMenu } from './components/CustomFieldMenu';
import { Box } from 'ink';

export interface AppProps extends Pick<CliFlagsType, 'legacy' | 'center'> {
  quickGame?: DifficultyType | CustomConfigType;
}

export const App: FC<AppProps> = ({ legacy, center, quickGame }) => {
  const switchDrawingMode = useGameStore((s) => s.switchDrawingMode);
  const startGame = useGameStore((s) => s.startGame);
  const gameStatus = useGameStore((s) => s.gameStatus);

  useLayoutEffect(() => {
    legacy && switchDrawingMode();
    if (quickGame) {
      typeof quickGame === `string` ? startGame(quickGame) : startGame(`custom`, quickGame);
    }
  }, [legacy, quickGame, startGame, switchDrawingMode]);

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
