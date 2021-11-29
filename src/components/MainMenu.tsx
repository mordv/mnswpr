import React, { useCallback, useState } from 'react';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import { Box, Text } from 'ink';
import { difficulties, DifficultyType, useGameStore } from '../state/state';
import { capitalize } from '../utils/utils';
import { ControlsHints } from './ControlsHints';

export const MainMenu: React.VFC = () => {
  const startGame = useGameStore((s) => s.startGame);
  const setupCustomField = useGameStore((s) => s.setupCustomField);
  const emojiMode = useGameStore((s) => s.drawingMode === `emoji`);

  const handleSelect = useCallback(
    (diff: DifficultyType) => (diff === `custom` ? setupCustomField() : startGame(diff)),
    [setupCustomField, startGame]
  );

  return (
    <Box flexDirection={`column`} alignItems={`center`} justifyContent={`center`} width={`100%`}>
      {emojiMode && <Text>🚩</Text>}
      <Box justifyContent={`center`} width={`100%`}>
        <Gradient name={`morning`}>
          <Text>MINESWEEPER</Text>
        </Gradient>
      </Box>
      <Box height={1} />
      <SelectDifficulty onSelect={handleSelect} />
      <Box height={1} />
      <ControlsHints />
    </Box>
  );
};

interface SelectDifficultyProps {
  onSelect: (difficulty: DifficultyType) => void;
}

const items = difficulties.map((value) => ({ value, label: capitalize(value) }));
const colors = [`cristal`, `teen`, `morning`, `instagram`];
const colorMapping = Object.fromEntries(items.map(({ label }, i) => [label, colors[i]]));
const SelectDifficulty: React.VFC<SelectDifficultyProps> = ({ onSelect }) => {
  const [highlighted, setHighlighted] = useState(items[0].label);
  const legacyMode = useGameStore((s) => s.drawingMode === `legacy`);
  return (
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
  );
};
