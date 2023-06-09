import React, { Component } from "react";
import Cell from "../components/Cell";
import * as dijkstra from "../algorithms/dijkstraAlgo";
import * as astar from "../algorithms/astarAlgo";
import * as recursiveMaze from "../mazeAlgorithms/recursiveMaze";
import HeaderBar from '../components/HeaderBar';
export default class Visualizer extends Component {
  constructor(props) {
    super(props);
    this.cellRefs = new Map();
    this.state = {
      grid: [],
      rows: 32,
      cols: 58,
      startCell: { row: 7, col: 15},
      finishCell: { row: 13, col: 32 },
      iteration: 0,
      cellSelectionMode: false,
      cellToChange: null, // 1 : start cell , 0 : finish cell, 2: edit walls
      drawing: false,
      newWallsSet: new Set(),
      inAnimation: false,

      
    };
    this.loadGrid = this.loadGrid.bind(this);
  }
  componentDidMount() {
    this.loadGrid();
  }
  //Cell object init
  createCell(row, col, startCell, finishCell) {
    return {
      row,
      col,
      isStart: row === startCell.row && col === startCell.col,
      isFinish: row === finishCell.row && col === finishCell.col,
      isWall: false,
      background: "white",
    };
  }
  loadGrid() {
    const {
      rows,
      cols,
      startCell: startNode,
      finishCell: finishNode,
    } = this.state;
    const newGrid = [];

    for (let row = 0; row < rows; row++) {
      let curRow = [];
      for (let col = 0; col < cols; col++) {
        curRow.push(this.createCell(row, col, startNode, finishNode));
      }
      newGrid.push(curRow);
    }
    this.setState({ grid: newGrid });
  }
  clearBoard = (all) => {
    return new Promise((resolve) => {
      this.state.grid.forEach((row, rowID) => {
        row.forEach((cell, cellIndex) => {
          const cellId = `${rowID}:${cellIndex}`;
          const cellRef = this.cellRefs.get(cellId);
          if (cellRef) {
            cellRef.setVisited(false);
            cellRef.setIsPath(false);
          }
        });
      });
  
      if(all){
        this.loadGrid();
        this.setState({ newWallsSet: new Set() }, resolve);
      }else{
        resolve();
      }
    });
  };
  clearHighlight = () => {

  }
  //Enable inAnimation state to disable header buttons
  setInAnimation = (inAnimation) => {
    this.setState({ inAnimation: inAnimation });
  };
  //Generate Recursive backtracking maze
  genRBTMaze = async () => {
    await this.clearBoard(true);
    const { rows, cols, startCell, finishCell } = this.state;
    const contextProps = { rows, cols, startCell, finishCell };
  
    const grid = recursiveMaze.recursiveBT(contextProps);
    this.placeMaze(grid);
  };
  //Generate Prim's maze
  genPrimsMaze = async ()=>{
    await this.clearBoard(true);
    const { rows, cols, startCell, finishCell} = this.state;
    const contextProps = { rows, cols, startCell, finishCell};
    const animatedGrid = recursiveMaze.primsGen(contextProps);
    this.removeWalls(animatedGrid);
    // this.setState({grid: animatedGrid});
  }

  // Animated wall removal config
  removeWalls =(animatedGrid)=>{
    let iteration = 0;
    const updatedGrid = this.state.grid.slice();
    updatedGrid.forEach((row, rowID) =>{
      row.forEach((cell, cellIndex) =>{
        if(!cell.isStart && !cell.isFinish){
          cell.isWall = true;
        }
      })
    });
    let startTime;
    const batchSize = 4;

    const animate = (timestamp) => {
      if(!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        
        if(progress >= 5){
          const endBatch = Math.min(iteration + batchSize, animatedGrid.length);
          for(; iteration < endBatch; iteration++){
            
            const currentWall = animatedGrid[iteration];
            updatedGrid[currentWall.row][currentWall.col].isWall = false;
          }
          if(iteration < animatedGrid.length){
            this.setState({grid: updatedGrid});
            startTime = undefined;
          }else{
            this.setState({ grid: updatedGrid});
            this.setState({inAnimation: false});
            return;
          }
        }
        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);

    this.setState({grid:updatedGrid});
  };

  // Animated wall placement config
  placeMaze = (animatedGrid) => {
    const wallArray = Array.from(animatedGrid);
    let iteration = 0;
    const updatedGrid = this.state.grid.slice();

    let startTime;
    const batchSize = 7;
    
    const animate = (timestamp) => {
      if(!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        
        if(progress >= 5){
          const endBatch = Math.min(iteration + batchSize, wallArray.length);
          for(; iteration < endBatch; iteration++){
            
            const currentWall = wallArray[iteration];
            updatedGrid[currentWall.row][currentWall.col].isWall = true;
          }
          if(iteration < wallArray.length){
            this.setState({grid: updatedGrid});
            startTime = undefined;
          }else{
            this.setState({ grid: updatedGrid});
            this.setState({inAnimation: false});
            return;
          }
        }
        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);

  };
  //Call A* algorithm
  visualizeAStar=()=>{
    const {grid, startCell, finishCell} = this.state;
    const {visited, reconstructedPath} = astar.aStar(grid, startCell, finishCell);
    this.highlight(visited, reconstructedPath );
  }
  //Call Dijkstra's algorithm
  pathFinder = () => {
    const { grid, startCell, finishCell } = this.state;
    const { visitedCellsInOrder, reconstructedPath } = dijkstra.dijkstra(
      grid,
      startCell,
      finishCell,
    );

    if (!visitedCellsInOrder) {
      console.error("cellsInOrder is undefined");
      return;
    }
    this.highlight(visitedCellsInOrder, reconstructedPath);
  };

  //visualization animation
  highlight = async(cellsInOrder, reconstructedPath) => {
    await this.clearBoard(false);
    const animatedGrid = this.state.grid.slice();
    let startTime;
    let iteration = 0;
    const batchSize = 5;
  
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
  
      if (progress >= 5) {
        // const startBatch = iteration;
        const endBatch = Math.min(iteration + batchSize, cellsInOrder.length);
        
        for (; iteration < endBatch; iteration++) {
          
          const cellRef = this.cellRefs.get(`${cellsInOrder[iteration].row}:${cellsInOrder[iteration].col}`);
          if (cellRef) {
            cellRef.setVisited(true);
          }
        }
  
        if (iteration < cellsInOrder.length) {
          this.setState({ grid: animatedGrid});
          startTime = undefined;
        } else {
          this.setState({ grid: animatedGrid});
          this.highlightPath(reconstructedPath);
          this.setState({inAnimation: true});
          return;
        }
      }
      window.requestAnimationFrame(animate);
    };
  
    window.requestAnimationFrame(animate);
  };
  //Highlight shortest path
  highlightPath = (reconstructedPath) => {
    const animatedGrid = this.state.grid.slice();
    let startTime;
    let iteration = 0;
    const batchSize = 2;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
  
      if (progress >= 5) {
        const endBatch = Math.min(iteration + batchSize, reconstructedPath.length);
        
        for (; iteration < endBatch; iteration++) {
          const cellRef = this.cellRefs.get(`${reconstructedPath[iteration].row}:${reconstructedPath[iteration].col}`);
          if (cellRef) {
            cellRef.setIsPath(true);
            cellRef.setVisited(false);

          }
        }
        if (iteration < reconstructedPath.length) {
          this.setState({ grid: animatedGrid});
          startTime = undefined;
        } else {
          this.setState({ grid: animatedGrid});
          this.setState({inAnimation : false});
          return;
        }
      }
      window.requestAnimationFrame(animate);
      };
    
      window.requestAnimationFrame(animate);
    }


  //Change state for editting start, finish or walls
  changeCellType=(cellType)=>{
    this.setState({ cellToChange: cellType }, () => {
    });
  }
  //Rendering new cell types/changes
  updateCell =(newCell, newCellToChange)=>{
    const {grid, startCell, finishCell} = this.state;
    const updatedGrid = grid.slice();
    if(newCellToChange === 1){
      updatedGrid[startCell.row][startCell.col].isStart = false;
      this.setState({startCell:newCell, grid: updatedGrid});
    }
    else if(newCellToChange === 0){
      updatedGrid[finishCell.row][finishCell.col].isFinish = false;
      this.setState({finishCell:newCell, grid: updatedGrid});
    }
    else if(newCellToChange === 2){
      for(const cell of newCell){
        updatedGrid[cell.row][cell.col].isWall = true;
      }
      this.setState({grid:updatedGrid});
      
    }
  }
  //Function that HeaderBar (Child) calls to toggle cellSelectionMode
  cellSelectionToggle=(newState)=>{
    this.setState({cellSelectionMode: newState});
    
  }
  //Enable cell highlighting during editting phase
  toggleDrawing=(isDrawing)=>{
    this.setState({drawing:isDrawing});
  }
  //Pass cellToggle function to toggle parent's cellSelectionMode
  headerContextProps =()=> ({
    cellSelectionToggle: this.cellSelectionToggle,
    cellSelectionMode: this.state.cellSelectionMode,
    changeCellType: this.changeCellType,
    genRBTMaze: this.genRBTMaze,
    pathFinder: this.pathFinder,
    visualizeAStar: this.visualizeAStar,
    clearBoard: this.clearBoard,
    genPrimsMaze: this.genPrimsMaze,
    setInAnimation: this.setInAnimation,
    inAnimationState: this.state.inAnimation,
  });
  //Group of State updating functions to pass to HeaderBar (Child)
  cellContextProps=()=>({
    cellSelectionMode: this.state.cellSelectionMode,
    cellSelectionToggle: this.cellSelectionToggle,
    updateCell: this.updateCell,
    grid: this.state.grid,
    cellToChange: this.state.cellToChange,
    drawing: this.state.drawing,
    toggleDrawing: this.toggleDrawing,
    newWallsSet: this.state.newWallsSet,
    setVisited: this.setVisited,
    setIsPath: this.setIsPath,

  });
  

  render() {
    const { grid } = this.state;

    return (
      <>
      <div className="tool-bar">
          <HeaderBar
            headerContextProps={this.headerContextProps()}
          ></HeaderBar>
      </div>

        <div className="flex-container">
          
          <div

            className="grid-container"
            style={{
              gridTemplateColumns: `repeat(${this.state.cols}, 24px)`,
              gridTemplateRows: `repeat(${this.state.rows}, 24px)`,
            }}
          >
            {grid.map((row, rowIdx) => {
              return row.map((cell, cellIdx) => {
                const { isStart, isFinish, isWall, background } = cell;
                return (
                  <Cell
                    ref={(cellRef) => this.cellRefs.set(`${cell.row}:${cell.col}`, cellRef)}
                    key={cellIdx}
                    cell={cell}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
                    background={background}
                    cellContextProps={this.cellContextProps()}
                  ></Cell>
                );
              });
            })}
          </div>
        </div>
      </>
    );
  }
}
