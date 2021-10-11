#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { App } from './App';

const cli = meow(
  `
	Usage
	  $ minesweeper

	Options
		--legacy  Legacy mode. Use this if your terminal doesn't support emojis
`,
  {
    flags: {
      legacy: {
        type: `boolean`,
      },
    },
  }
);

export type CliFlagsType = Partial<typeof cli.flags>;

render(<App {...cli.flags} />);
