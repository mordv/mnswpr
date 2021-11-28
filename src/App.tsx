import React from 'react';
import { CliFlagsType } from './cli';
import { Field } from './components/Field';
import { useGameStore } from './state/state';
import { MainMenu } from './components/MainMenu';
import { CustomFieldMenu } from './components/CustomFieldMenu';
import { Box } from 'ink';

export const App: React.VFC<Pick<CliFlagsType, 'center'>> = ({ center }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);

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
