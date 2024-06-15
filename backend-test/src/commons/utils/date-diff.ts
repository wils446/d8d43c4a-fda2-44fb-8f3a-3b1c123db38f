export const dateDiff = (first: Date, second: Date) =>
  Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
