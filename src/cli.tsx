#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { App } from './App';
import { maxHeight, maxWidth, minHeight, minMines, minWidth, validateFieldSize } from './components/CustomFieldMenu';
import { useGameStore } from './state/state';
import { enterFullscreen, exitFullscreen } from './utils/terminalUtils';

export const customFieldFormat = `[width(${minWidth}-${maxWidth}),height(${minHeight}-${maxHeight}),mines(${minMines}-width*height*0.6)]`;
const { flags } = meow(
  `Usage: mnswpr

Press h to show game controls.

Options:
  --legacy, -L  (or press l)
        Legacy mode. Use this if your terminal doesn't support emojis
        
  --quick [b|i|e|width,height,mines], -Q [b|i|e|width,height,mines] 
        Start game directly with one of the difficulties: [b|i|e]
        or a custom field: ${customFieldFormat}
        
        Examples:
          mnswpr --quick b #start game with beginner difficulty
          mnswpr -Q 10,20,60 #start game with custom field width:10 height:20 mines:60
`,
  {
    flags: {
      legacy: {
        type: `boolean`,
        alias: `L`,
      },
      quick: {
        type: `string`,
        alias: `Q`,
      },
    },
  }
);

export type CliFlagsType = Partial<typeof flags>;

const number = `[1-9][0-9]*`;
if (flags.quick) {
  const match = flags.quick.match(`^(?<width>${number}),(?<height>${number}),(?<mines>${number})$|^(?<diff>[b|i|e])$`);
  if (!match) {
    console.error(`--quick must be either one of [b|i|e] or ${customFieldFormat}, see --help for details.`);
    process.exit(2);
  } else {
    const { width, height, mines, diff } = match.groups;
    if (diff) {
      useGameStore.getState().startGame(diff === `b` ? `beginner` : diff === `i` ? `intermediate` : `expert`);
    } else {
      const validated = validateFieldSize(Number.parseInt(width), Number.parseInt(height), Number.parseInt(mines));
      if (!validated) {
        console.error(`--quick custom field must be within limitations: ${customFieldFormat}, see --help for details.`);
        process.exit(2);
      }
      useGameStore.getState().startGame(`custom`, validated);
    }
  }
}

flags.legacy && useGameStore.getState().switchDrawingMode();
enterFullscreen();
const { clear, waitUntilExit } = render(<App fullscreen={true} />, {
  exitOnCtrlC: false,
});
waitUntilExit().then(() => exitFullscreen());

export { clear };
