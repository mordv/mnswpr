import React, { useCallback, useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { CustomConfigType, useGameStore } from '../state/state';
import TextInput from 'ink-text-input';

export const minWidth = 5;
export const maxWidth = 50;
export const minHeight = 5;
export const maxHeight = 25;
export const minMines = 1;
export const getMaxMines = (width: number, height: number): number => Math.floor(width * height * 0.6);

export const CustomFieldMenu: React.FC = () => {
  const [config, setConfig] = useState<Partial<CustomConfigType>>({});
  const [value, setValue] = useState(``);
  const [error, setError] = useState(false);

  useEffect(() => {
    setConfig({});
    setValue(``);
    setError(false);
  }, []);

  const startGame = useGameStore((s) => s.startGame);
  const toStartScreen = useGameStore((s) => s.toStartScreen);
  useInput((_, { escape }) => escape && toStartScreen());

  const handleChange = useCallback(
    (s: string) =>
      s.match(/^$|^[1-9][0-9]*$/) &&
      s.length <=
        (!config.width ? maxWidth : !config.height ? maxHeight : getMaxMines(config.width, config.height)).toString()
          .length
        ? setValue(s)
        : undefined,
    [config.height, config.width]
  );

  const handleSubmit = useCallback(
    (s: string) => {
      const parsed = Number.parseInt(s);
      if (!config.width) {
        if (parsed >= minWidth && parsed <= maxWidth) {
          setConfig((c) => ({ ...c, width: parsed }));
          setError(false);
          setValue(``);
        } else {
          setError(true);
        }
      } else if (!config.height) {
        if (parsed >= minHeight && parsed <= maxHeight) {
          setConfig((c) => ({ ...c, height: parsed }));
          setError(false);
          setValue(``);
        } else {
          setError(true);
        }
      } else {
        const maxMines = getMaxMines(config.width, config.height);
        if (parsed >= minMines && parsed <= maxMines) {
          startGame(`custom`, { ...(config as CustomConfigType), mines: parsed });
        } else {
          setError(true);
        }
      }
    },
    [config, startGame]
  );

  return (
    <>
      <Box>
        <Box marginRight={1}>
          <Text color={error ? `red` : undefined}>
            {!config.width
              ? `Width(${minWidth}-${maxWidth}):`
              : !config.height
              ? `Height(${minHeight}-${maxHeight}):`
              : `Mines count(${minMines}-${getMaxMines(config.width, config.height)}):`}
          </Text>
        </Box>
        <TextInput value={value} onChange={handleChange} onSubmit={handleSubmit} />
      </Box>
    </>
  );
};
