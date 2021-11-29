const enterAltScreenCommand = `\x1b[?1049h`;
const leaveAltScreenCommand = `\x1b[?1049l`;

export const enterFullscreen = (): void => void process.stdout.write(enterAltScreenCommand);
export const exitFullscreen = (): void => void process.stdout.write(leaveAltScreenCommand);
