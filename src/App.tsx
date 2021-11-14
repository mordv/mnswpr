import React, { FC, useEffect } from 'react';
import { CliFlagsType } from './cli';
import { Field } from './components/Field';
import { useGameStore } from './state/state';
import { MainMenu } from './components/MainMenu';
import { CustomFieldMenu } from './components/CustomFieldMenu';
import { Box } from 'ink';

export const App: FC<CliFlagsType> = ({ legacy }) => {
  const switchDrawingMode = useGameStore((s) => s.switchDrawingMode);
  useEffect(() => {
    legacy && switchDrawingMode();
  }, [legacy, switchDrawingMode]);
  const gameStatus = useGameStore((s) => s.gameStatus);
  return (
    <Box>
      <Box width={2} />
      <Box flexDirection={`column`}>
        {gameStatus === `startScreen` ? (
          <MainMenu />
        ) : gameStatus === `customFieldSetup` ? (
          <CustomFieldMenu />
        ) : (
          <Field />
        )}
      </Box>
    </Box>
  );
};
