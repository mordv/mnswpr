import React, { FC, useEffect } from 'react';
import { CliFlagsType } from './cli';
import { Field } from './components/Field';
import { useGameStore } from './state/state';
import { MainMenu } from './components/MainMenu';

export const App: FC<CliFlagsType> = ({ legacy }) => {
  const switchDrawingMode = useGameStore((s) => s.switchDrawingMode);
  useEffect(() => {
    legacy && switchDrawingMode();
  }, [legacy, switchDrawingMode]);
  const gameStatus = useGameStore((s) => s.gameStatus);
  return gameStatus === `startScreen` ? <MainMenu /> : <Field />;
};
