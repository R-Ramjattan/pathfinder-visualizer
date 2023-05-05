export function aStar(grid, startCell, finishCell) {
    //open list, close list
    const toVisit = []; const visited = [];

    const predecessorMap = new Map();

    const startingPoint = {row: startCell.row, col: startCell.col, gScore: 0, fScore: 0};
    toVisit.push(startingPoint);
    while(toVisit.length > 0){

        //Pull lowest fScore move
        const curMove = toVisit.shift();
        //Add current cell to visited list
        visited.push(grid[curMove.row][curMove.col]);
        //Calculate neighbouring cells from current cell
        const nextMoves = getNextMove(curMove);
        //Add neighbouring cells to the toVisit list
        for(const moves of nextMoves) toVisit.push(moves);
        //Sort toVisit by lowest fScore
        toVisit.sort((a, b) => a.fScore - b.fScore);
        
        if(curMove.row === finishCell.row && curMove.col === finishCell.col){
            break;
        }
        
    }
    const reconstructedPath = reconstructPath(predecessorMap, finishCell);
    return {visited, reconstructedPath};
    

    //Manhattan distance for f score = g score (start to node n || accumulated distances from start to node n ) + h score (node n to end)
    function calcFscore(cur, next, destination){
        //G Score
        const gScore = cur.gScore + 1;
        //H Score
        const rowCost =  Math.abs(next.row - destination.row);
        const colCost = Math.abs(next.col - destination.col);
        const hScore = rowCost + colCost;
        //F Score
        const fScore = gScore + hScore;
        return {gScore, fScore};
    }
    

    function getNextMove(currentCell) {
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
            newCol < grid[0].length &&
            grid[newRow][newCol].isWall === false
          ) {
                //Calculate gScore and Fscore of new cell
                const {gScore, fScore} = calcFscore(currentCell, grid[newRow][newCol], finishCell);

                const targetObject = {row: newRow, col: newCol, gScore: gScore, fScore: fScore};
                
                //if cell exists in openlist, check if new fscore is lower, if so replace
                if(toVisit.some(obj => obj.row === targetObject.row && obj.col === targetObject.col && obj.gScore > targetObject.gScore)){
                  const index = toVisit.findIndex(obj => obj.row === targetObject.row && obj.col === targetObject.col && obj.gScore > targetObject.gScore);
                  // console.log("REPLACED OCCURENCE WITH LOWER FSCORE");
                  predecessorMap.set(`${newRow}:${newCol}`, grid[currentCell.row][currentCell.col]);
                  if (index !== -1) toVisit[index] = targetObject;
                
                } 
                //Do not add repeated cells to open/close list
                if(!visited.some(obj => obj.row === targetObject.row && obj.col === targetObject.col) && 
                  !toVisit.some(obj => obj.row === targetObject.row && obj.col === targetObject.col)){
                      predecessorMap.set(`${newRow}:${newCol}`, grid[currentCell.row][currentCell.col]);
                      neighbors.push({row:newRow, col: newCol, gScore: gScore, fScore: fScore});
                    } 
          }

        }
        return neighbors;
      }

      
}
//Destruct the predecessor map for shortest path
export const reconstructPath = (predecessorMap, finishCell) => {
  let cur = predecessorMap.get(`${finishCell.row}:${finishCell.col}`);
  const path = [];
  
  while(cur.isStart === false){
    let cellKey = `${cur.row}:${cur.col}`;
    path.unshift(cur);
    cur = predecessorMap.get(cellKey);
  }
  return path;
}