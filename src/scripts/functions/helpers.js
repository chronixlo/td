export const rand = (min, max) =>
  Math.floor(Math.random() * (max + 1 - min)) + min;

export const color = () =>
  '#' +
  Math.floor(Math.random() * 4096)
    .toString(16)
    .padStart(3, '0');

export const flip = () => Math.random() < 0.5;
