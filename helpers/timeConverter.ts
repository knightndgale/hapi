export const convertTimeToMilliseconds = (timeString: string): number => {
  const timeRegex = /^(\d+)([smhd])$/;
  const match = timeString.match(timeRegex);

  if (!match) {
    throw new Error(`Invalid time format: ${timeString}. Expected format: number followed by s, m, h, or d`);
  }

  const [, value, unit] = match;
  const numericValue = parseInt(value, 10);

  switch (unit) {
    case "s":
      return numericValue * 1000; // seconds to milliseconds
    case "m":
      return numericValue * 60 * 1000; // minutes to milliseconds
    case "h":
      return numericValue * 60 * 60 * 1000; // hours to milliseconds
    case "d":
      return numericValue * 24 * 60 * 60 * 1000; // days to milliseconds
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
};
