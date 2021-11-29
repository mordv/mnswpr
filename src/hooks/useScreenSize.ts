import { useEffect, useState } from 'react';
import { useStdout } from 'ink';

interface SizeType {
  width: number;
  height: number;
}

export const useScreenSize = (): SizeType => {
  const { stdout } = useStdout();

  const [size, setSize] = useState(() => ({
    width: stdout.columns,
    height: stdout.rows,
  }));

  useEffect(() => {
    const onResize = () =>
      setSize({
        width: stdout.columns,
        height: stdout.rows,
      });

    stdout.on(`resize`, onResize);
    return () => void stdout.off(`resize`, onResize);
  }, [stdout]);

  return size;
};
