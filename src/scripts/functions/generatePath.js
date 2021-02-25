import { rand, flip } from './helpers';

export default function generatePath(cellsX, cellsY, length) {
  const randX = () => rand(1, cellsX - 2);
  const randY = () => rand(1, cellsY - 2);

  let bigCounter = 0;
  let path = [];
  let longest = [];

  while (bigCounter < 50) {
    bigCounter++;

    if (path.length === length) {
      break;
    }

    let startPoint;

    if (flip()) {
      const y = randY();
      startPoint = [1, y];
    } else {
      const x = randX();
      startPoint = [x, 1];
    }

    if (path.length > longest.length) {
      longest = path;
    }

    path = [startPoint];
    const illegalCells = [];

    while (path.length !== length) {
      const point = getNextPossible(path, illegalCells, cellsX - 2, cellsY - 2);
      if (!point) {
        break;
      }
      illegalCells.push(...[point, ...getNeighbors(path[path.length - 1])]);
      path.push(point);
    }
  }

  if (path.length !== length) {
    path = longest;
  }

  return path;
}

const getNextPossible = (path, illegalCells, maxX, maxY) => {
  const last = path[path.length - 1];

  const possibilities = getNeighbors(last).filter((cell) => {
    const [x, y] = cell;
    return (
      x >= 1 &&
      x <= maxX &&
      y >= 1 &&
      y <= maxY &&
      !illegalCells.some((illegal) => cellEquals(illegal, cell))
    );
  });
  return possibilities[rand(0, possibilities.length - 1)];
};

const getNeighbors = (cell) => {
  const [x, y] = cell;
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
};

const cellEquals = (c1, c2) => {
  return c1[0] === c2[0] && c1[1] === c2[1];
};
