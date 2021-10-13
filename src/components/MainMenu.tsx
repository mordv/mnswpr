import React, { useState } from 'react';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import { Box, Text, useApp, useInput } from 'ink';
import { difficulties, DifficultyType, useGameStore } from '../state/state';
import { capitalize } from '../utils/utils';
import { useSymbol } from '../hooks/useSymbol';
import Link from 'ink-link';
import { ControlsHints } from './Field';

export const MainMenu: React.FC = () => {
  const { exit } = useApp();
  useInput((_, { escape }) => escape && exit());

  const startGame = useGameStore((s) => s.startGame);
  const bomb = useSymbol(`bomb`);
  const faceWin = useSymbol(`faceWin`);
  const star = useSymbol(`star`);

  return (
    <>
      <Box marginBottom={1}>
        <Gradient name={`morning`}>
          <Text>
            {bomb} MINESWEEPER {bomb}
          </Text>
        </Gradient>
      </Box>
      <SelectDifficulty onSelect={startGame} />
      <Box height={1} />
      <Link url={`https://github.com/mordv`}>
        <Gradient name={`morning`}>
          <Text>
            {star}Star project on GitHub{faceWin}
          </Text>
        </Gradient>
      </Link>
      <ControlsHints />
    </>
  );
};

interface SelectDifficultyProps {
  onSelect: (difficulty: DifficultyType) => void;
}

const items = difficulties.map((value) => ({ value, label: capitalize(value) }));
const colors = [`cristal`, `teen`, `morning`];
const colorMapping = Object.fromEntries(items.map(({ label }, i) => [label, colors[i]]));
const SelectDifficulty: React.FC<SelectDifficultyProps> = ({ onSelect }) => {
  const [highlighted, setHighlighted] = useState(items[0].label);
  const legacyMode = useGameStore((s) => s.drawingMode === `legacy`);
  return (
    <>
      <Text>Choose difficulty:</Text>
      <SelectInput
        items={items}
        initialIndex={0}
        onSelect={(item) => onSelect(item.value)}
        onHighlight={(item) => setHighlighted(item.label)}
        itemComponent={({ isSelected, label }) =>
          isSelected ? (
            <Gradient name={colorMapping[label]}>
              <Text>{label}</Text>
            </Gradient>
          ) : (
            <Text>{label}</Text>
          )
        }
        indicatorComponent={({ isSelected }) => (
          <Gradient name={colorMapping[highlighted]}>
            <Text>{isSelected ? (legacyMode ? `> ` : `❯ `) : `  `}</Text>
          </Gradient>
        )}
      />
    </>
  );
};
