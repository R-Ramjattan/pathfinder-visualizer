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
      
      //Set start and finish points
      grid[startCell.row][startCell.col].isWall = false; grid[startCell.row][startCell.col].isStart = true;
      grid[finishCell.row][finishCell.col].isWall = false; grid[finishCell.row][finishCell.col].isFinish = true;

      //For animation
      const wallsRemovedInOrder = [];
      //For Algorithm
      const frontierCells = [];
      const frontierSet = new Set();
      const passageMap = new Map();

      // Add frontier cells
      updateFrontierCells(frontierCells, startCell.col, startCell.row, passageMap);
    
      while (frontierCells.length > 0) {
    
        // Randomly select new frontier cell
        shuffleArray(frontierCells);
        const frontierCell = frontierCells.shift();
        const passageCell = passageMap.get(frontierCell);
    
        // Connect selected frontier cell to neighboring passage by removing wall
        grid[frontierCell.row][frontierCell.col].isWall = false;
        grid[passageCell.row][passageCell.col].isWall = false;
        // Add walls that were removed in-order of removal for animation
        wallsRemovedInOrder.push(frontierCell);
        wallsRemovedInOrder.push(passageCell);
        
        // Update list of frontier cells by adding the neighbors of the selected frontier cell that are walls and not already in the list
        updateFrontierCells(frontierCells, frontierCell.col, frontierCell.row, passageMap);
      }
      
      console.log(wallsRemovedInOrder);
      return wallsRemovedInOrder;



      function updateFrontierCells(frontierCells, x, y){
        //Directions for frontier cells
        const directions = [
          { x: 0, y: -2 },
          { x: 2, y: 0 },
          { x: 0, y: 2 },
          { x: -2, y: 0 },
        ];
        for (const direction of directions) {
            //Calculate frontier cell position in terms of row and col
            const newX = x + direction.x;
            const newY = y + direction.y;
            
            //Consider boundaries of grid
            if (newX >= 0 && newY >= 0 && newX < cols && newY < rows && grid[newY][newX].isWall) {
              //Calculate position of passage between selected cell and frontier cell
              const passageX = x + direction.x / 2;
              const passageY = y + direction.y / 2;
              //Add unique frontier cell to array and create a relation of the passage to the new frontier cell
              if (!frontierSet.has(`${newY}:${newX}`)) {
                frontierSet.add(`${newY}:${newX}`);
                frontierCells.push(grid[newY][newX]);
                passageMap.set(grid[newY][newX], grid[passageY][passageX]);
              }

                
            }
          }
          
          
      }
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      
      

}
