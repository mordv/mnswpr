import React, { FC, useEffect } from 'react';
import { CliFlagsType } from './cli';
import { Field } from './components/Field';
import { useGameStore } from './state/state';
import { MainMenu } from './components/MainMenu';
import {
  CustomFieldMenu,
  maxHeight,
  maxWidth,
  minMines,
  minHeight,
  minWidth,
  getMaxMines,
} from './components/CustomFieldMenu';
import { Box } from 'ink';

export const App: FC<CliFlagsType> = ({ legacy, center, quick }) => {
  const switchDrawingMode = useGameStore((s) => s.switchDrawingMode);
  useEffect(() => {
    legacy && switchDrawingMode();
  }, [legacy, switchDrawingMode]);
  const startGame = useGameStore((s) => s.startGame);

  const getQuickGame = (quick:string): [number, number, number] => {
    if (quick) {
      const dims = quick.split(`,`);
      if (dims.length == 3) {
        return [+dims[0], +dims[1], +dims[2]];
      }
    }
  };

  const getAlignment = (center:boolean) => (center ? `center` : `flex-start`);

  useEffect(() => {
    const dims = getQuickGame(quick);
    dims &&
      dims[0] > minWidth &&
      dims[0] < maxWidth &&
      dims[1] > minHeight &&
      dims[1] < maxHeight &&
      dims[2] > minMines &&
      dims[2] < getMaxMines(dims[0], dims[1]) &&
      startGame(`custom`, { width: dims[0], height: dims[1], mines: dims[2] });
  }, [quick, startGame]);

  const gameStatus = useGameStore((s) => s.gameStatus);

  return (
    <Box alignItems={getAlignment(center)} marginLeft={2} marginRight={2} marginTop={1} flexDirection={`column`} >
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
