export function recursiveBT(contextProps) {
    const {rows, cols, startCell, finishCell } = contextProps;
    //let wallOrder = [];
    
    const grid = Array.from({ length: rows }, 
        (_, row) => Array.from({ length: cols }, 
            (_, col) => ({
                row,
                col,
                isStart: false,
                isFinish: false,
                isWall: true,
                background: "white",
      })));
      
      function removeWalls(x, y, newX, newY) {
        if (newX === x - 2) {
          grid[y][x - 1].isWall = false;
        } else if (newX === x + 2) {
          grid[y][x + 1].isWall = false;
        } else if (newY === y - 2) {
          grid[y - 1][x].isWall = false;
        } else if (newY === y + 2) {
          grid[y + 1][x].isWall = false;
        }
      }
    
      function recursiveBacktracking(x, y) {
        grid[y][x].isWall = false;
        
      
        const directions = [
          { x: 0, y: -2 },
          { x: 2, y: 0 },
          { x: 0, y: 2 },
          { x: -2, y: 0 },
        ].sort(() => Math.random() - 0.5);
      
        for (const direction of directions) {
          const newX = x + direction.x;
          const newY = y + direction.y;
      
          if (newX >= 0 && newY >= 0 && newX < cols && newY < rows && grid[newY][newX].isWall) {
            removeWalls(x, y, newX, newY);
            recursiveBacktracking(newX, newY);
          }
        }
      }

    recursiveBacktracking(startCell.row, startCell.col);
    grid[startCell.row][startCell.col].isStart = true;
    grid[finishCell.row][finishCell.col].isFinish = true;
    // Remove walls from start and finish cells, if any
    grid[startCell.row][startCell.col].isWall = false;
    grid[finishCell.row][finishCell.col].isWall = false;

    // Set start and finish cells
    grid[startCell.row][startCell.col].isStart = true;
    grid[finishCell.row][finishCell.col].isFinish = true;

    const animatedGrid = new Set();
    for (let row of grid) {
        for(let cell of row){
            if(cell.isWall){
                animatedGrid.add(cell);
            }
        }
    }
    
    return animatedGrid;
  

}
//contextProps contains rows, cols, startCell, finishCell
export function primsGen(contextProps) {
    const {rows, cols, startCell, finishCell } = contextProps;
    const grid = Array.from({ length: rows }, 
        (_, row) => Array.from({ length: cols }, 
            (_, col) => ({
                row,
                col,
                isStart: false,
                isFinish: false,
                isWall: true,
                background: "white",
      })));
      const frontierCells = new Set();
      grid[startCell.row][startCell.col].isWall = false; grid[startCell.row][startCell.col].isStart = true;
      
      return grid;



      function directions(){

      }
}
