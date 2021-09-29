import React, { FC } from 'react';
import { CliFlagsType } from './cli';
import { Field } from './components/Field';
import { useGameStore } from './state/state';
import { MainMenu } from './components/MainMenu';

export const App: FC<CliFlagsType> = () => {
  const gameMode = useGameStore((s) => s.gameMode);
  return gameMode === `settings` ? <MainMenu /> : <Field />;
};
