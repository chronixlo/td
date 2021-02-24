import { rand } from './helpers';

export default function generatePath(cellsX, cellsY) {
  const randX = () => rand(1, cellsX - 2);
  const randY = () => rand(1, cellsY - 2);

  const path = [];

  // start point
  if (Math.random() >= 0.5) {
    const y = randY();
    path.push([-1, y]);
    path.push([0, y]);
    path.push([1, y]);
  } else {
    const x = randX();
    path.push([x, -1]);
    path.push([x, 0]);
    path.push([x, 1]);
  }

  [
    ...new Array(3).fill().map(() => [randX(), randY()]),
    ...(() => {
      // end point
      let x, y;
      if (Math.random() >= 0.5) {
        x = cellsX - 2;
        y = randY();
        return [
          [x, y],
          [x + 1, y],
          [x + 2, y],
        ];
      }
      x = randX();
      y = cellsY - 2;
      return [
        [x, y],
        [x, y + 1],
        [x, y + 2],
      ];
    })(),
  ].map((segment) => {
    path.push(...route(path[path.length - 1], segment));
  });

  return path;
}

const route = (from, to) => {
  const path = [];
  const distanceX = Math.abs(to[0] - from[0]);
  const distanceY = Math.abs(to[1] - from[1]);
  const distance = distanceX + distanceY;
  const segment = [...from];

  for (let i = 0; i < distance; i++) {
    const deltaX = to[0] - segment[0];
    const deltaY = to[1] - segment[1];

    if (deltaX && deltaY) {
      if (Math.random() >= 0.5) {
        segment[0] += deltaX > 0 ? 1 : -1;
      } else {
        segment[1] += deltaY > 0 ? 1 : -1;
      }
    } else if (deltaX) {
      segment[0] += deltaX > 0 ? 1 : -1;
    } else {
      segment[1] += deltaY > 0 ? 1 : -1;
    }
    path.push([...segment]);
  }

  return path;
};
