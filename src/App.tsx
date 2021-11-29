import React from 'react';
import { CliFlagsType } from './cli';
import { Field } from './components/Field';
import { useGameStore } from './state/state';
import { MainMenu } from './components/MainMenu';
import { CustomFieldMenu } from './components/CustomFieldMenu';
import { Box } from 'ink';
import { useScreenSize } from './hooks/useScreenSize';
import { useClearExit } from './hooks/useClearExit';

export const App: React.VFC<Pick<CliFlagsType, 'fullscreen'>> = ({ fullscreen }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);

  useClearExit();
  const { width, height } = useScreenSize();

  return (
    <Box
      flexDirection={`column`}
      alignItems={`center`}
      justifyContent={`center`}
      width={width}
      marginTop={fullscreen ? undefined : 2}
      height={fullscreen ? height : undefined}
    >
      {gameStatus === `startScreen` ? (
        <MainMenu />
      ) : gameStatus === `customFieldSetup` ? (
        <CustomFieldMenu />
      ) : (
        <Field />
      )}
    </Box>
  );
};
