import React, { useState } from 'react';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import { Box, Text } from 'ink';
import { difficulties, DifficultyType, useGameStore } from '../state/state';

export const MainMenu: React.FC = () => {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <>
      <Box marginY={1}>
        <Gradient name={`morning`}>
          <Text>💣 MINESWEEPER 💣</Text>
        </Gradient>
      </Box>
      <SelectDifficulty onSelect={startGame} />
    </>
  );
};

interface SelectDifficultyProps {
  onSelect: (difficulty: DifficultyType) => void;
}

const items = difficulties.map((value) => ({ value, label: value.replace(/^\w/, (c) => c.toUpperCase()) }));
const colors = [`cristal`, `teen`, `morning`];
const colorMapping = Object.fromEntries(items.map(({ label }, i) => [label, colors[i]]));
const SelectDifficulty: React.FC<SelectDifficultyProps> = ({ onSelect }) => {
  const [highlighted, setHighlighted] = useState(items[0].label);
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
            <Text>{isSelected ? `❯ ` : `  `}</Text>
          </Gradient>
        )}
      />
    </>
  );
};
