import React from 'react';
import test from 'ava';
import { render } from 'ink-testing-library';
import { App } from './App';

test(`render App`, (t) => {
  const { lastFrame } = render(<App />);

  t.is(lastFrame(), ``);
});
