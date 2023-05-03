//cell: row, col, isStart, isFinish

export function dijkstra(grid, startCell, finishCell) {
  const distances = {};
  const predecessorMap = {};
  const visitedCellKeys = new Set();
  const visitedCellsInOrder = [];
  //May replace with priority queue or min-heap
  const unvisitedCells = [];
  //Edge case where there is no start or finish, or they overlap
  //
  // Initialize distances and unvisited cells

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      const cellKey = `${cell.row}:${cell.col}`;
      distances[cellKey] = Infinity;
      unvisitedCells.push(cell);
    }
  }
  //Set start node distance to 0
  distances[`${startCell.row}:${startCell.col}`] = 0;

  while (unvisitedCells.length > 0) {
    //Sort unvisitedCells by distance
    unvisitedCells.sort(
      (a, b) => distances[`${a.row}:${a.col}`] - distances[`${b.row}:${b.col}`]
    );

    const currentCell = unvisitedCells.shift();
    const currentCellKey = `${currentCell.row}:${currentCell.col}`;

    //Continue to next iter
    if (currentCell.isWall) continue;
    //All remaining cells unreachable
    if (distances[currentCellKey] === Infinity) break;

    //Add visited unique cellkey to set
    visitedCellKeys.add(currentCellKey);
    //Add visited cell to array in the order we visited them

    visitedCellsInOrder.push(currentCell);

    if (
      currentCell.row === finishCell.row &&
      currentCell.col === finishCell.col
    ) {
      break;
    }

    //Update distance of neighbouring cells
    const neighbors = getNeighbors(currentCell, grid);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}:${neighbor.col}`;

      if (visitedCellKeys.has(neighborKey)) continue;

      const newDistance = distances[currentCellKey] + 1;
      if (newDistance < distances[neighborKey]) {
        distances[neighborKey] = newDistance;
        predecessorMap[neighborKey] = currentCell;
      }
    }
  }
  const reconstructedPath = reconstructPath(
    predecessorMap,
    startCell,
    finishCell
  );

  return {
    reconstructedPath: reconstructedPath,
    visitedCellsInOrder: visitedCellsInOrder,
  };
}

function getNeighbors(currentCell, grid) {
  const neighbors = [];
  const { row, col } = currentCell;
  const directions = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ];
  //Array destructuring of directions
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    //Check if new position is within grid boundaries
    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }
  return neighbors;
}
//export const dijkstra = (grid, startCell, finishCell) => {

export const reconstructPath = (predecessorMap, startCell, finishCell) => {
  const path = [];
  let currentCell = finishCell;

  while (currentCell !== startCell) {
    path.unshift(currentCell);
    const cellKey = `${currentCell.row}:${currentCell.col}`;

    if (!predecessorMap.hasOwnProperty(cellKey)) {
      break;
    }
    currentCell = predecessorMap[cellKey];
  }

  path.unshift(startCell);

  return path;
};
