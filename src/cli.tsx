#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { App } from './ui';

const cli = meow(
  `
	Usage
	  $ minesweeper

	Options
		--name  Your name

	Examples
	  $ minesweeper --name=Jane
	  Hello, Jane
`,
  {
    flags: {
      name: {
        type: `string`,
      },
      color: {
        type: `string`,
      },
    },
  }
);

export type CliFlagsType = Partial<typeof cli.flags>;

render(<App {...cli.flags} />);
