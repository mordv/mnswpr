import React from 'react';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import { Box, Text } from 'ink';
import { difficulties, DifficultyType, useGameStore } from '../state/state';

export const MainMenu: React.FC = () => {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <>
      <Box marginY={1}>
        <Gradient name={`teen`}>
          <Text>💣 minesweeper 💣</Text>
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
const SelectDifficulty: React.FC<SelectDifficultyProps> = ({ onSelect }) => (
  <>
    <Text>Choose difficulty:</Text>
    <SelectInput
      items={items}
      onSelect={(d) => onSelect(d.value)}
      itemComponent={({ isSelected, label }) =>
        isSelected ? (
          <Gradient name={`vice`}>
            <Text>{label}</Text>
          </Gradient>
        ) : (
          <Text>{label}</Text>
        )
      }
      indicatorComponent={({ isSelected }) => (
        <Gradient name={`vice`}>
          <Text>{isSelected ? `❯ ` : `  `}</Text>
        </Gradient>
      )}
    />
  </>
);
