#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { App } from './App';

const cli = meow(
  `Usage: minesweeper

Options:

  --legacy, -L
	    Legacy mode. Use this if your terminal doesn't support emojis
  --center, -C
        Use this flag to align the game to the center of the terminal
  --quick, -Q
        Enter a custom game directly with width, height and mines as 'width,height,mines'
`,
  {
    flags: {
      legacy: {
        type: `boolean`,
        alias: `L`,
      },
      center: {
        type: `boolean`,
        alias: `C`,
        default: false,
      },
      quick: {
        type: `string`,
        alias: `Q`,
      },
    },
  }
);

export type CliFlagsType = Partial<typeof cli.flags>;

render(<App {...cli.flags} />);
