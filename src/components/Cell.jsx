import React, { Component } from 'react';

// import '../components/Cell.css';
//Cell rendering stuff
export default class Cell extends Component {
    constructor(props){
        super(props);
        this.state={
          isVisited: false,
          isPath: false,
        }
        this.setVisited = this.setVisited.bind(this);
    }
    
  setVisited = (visited) => {
    this.setState({ isVisited : visited });
  };
  setIsPath = (isPath) => {
    this.setState({isPath : isPath});
  }


  handleMouseLeave = (event) => {
    const { cellSelectionMode } = this.props.cellContextProps;
    if (cellSelectionMode) {
      event.target.classList.remove("hover-isStart", "hover-isFinish", "hover-isWall");
    }
    
  };

  handleMouseEnter = (event) => {
    const {cell} = this.props; 
    const {cellSelectionMode, cellToChange} = this.props.cellContextProps;

    if (cellSelectionMode) {
      if (cellToChange === 1) {
        event.target.classList.add("hover-isStart");
      } else if (cellToChange === 0) {
        event.target.classList.add("hover-isFinish");
      } else if (cellToChange === 2) {
        event.target.classList.add("hover-isWall");
      }
    }
      //Drawing Walls
      const {drawing, newWallsSet, updateCell} = this.props.cellContextProps;
      if(cellSelectionMode && drawing){
        if(!this.isStart || !this.isFinish){
          newWallsSet.add(cell);
          updateCell(newWallsSet, 2);
        }
    
      }

      

  };
  
  //Handle draw state
  handleMouseDown=(event, cellToChange)=>{
    //Turn on drawing state
    const {toggleDrawing } = this.props.cellContextProps;
    if(cellToChange === 2){
      toggleDrawing(true);


    }
  }
  handleMouseUp=()=>{
    //Turn off Draw state
    const {toggleDrawing } = this.props.cellContextProps;
    toggleDrawing(false);

  }
  /////////////////////////////////////////////
  
  //Handle Cell selection
  onClickHandler = (cellToChange) => {
    const {cell} = this.props; 
    const {cellSelectionToggle, cellSelectionMode, updateCell} = this.props.cellContextProps;
    //Cell to change = Starting Cell
    if(cellToChange === 1){
      const newStartCell = cell;
      newStartCell.isStart = true;
      //Turn off cell selection mode
      cellSelectionToggle(!cellSelectionMode);
      updateCell(newStartCell, cellToChange);
    }
    // Cell to change = Finish Cell
    else if(cellToChange === 0){
      const newFinishCell = cell;
      newFinishCell.isFinish = true;
      //Turn off cell selection mode
      cellSelectionToggle(!cellSelectionMode);
      updateCell(newFinishCell, cellToChange);
    }
    
    
  }
  cellStyle=(isStart, isFinish, isWall, background)=>{
    //Add/remove class
    const {isPath} = this.state;
    let classNameVariant = " ";
    if(isStart === true){
      classNameVariant = " isStart-cell";
    }
    else if(isFinish === true){
      classNameVariant = " isFinish-cell";
    }
    else if(isWall === true){
      classNameVariant = " isWall-cell";
    }
    else if(isPath === true){
      classNameVariant = " isPath-cell";
    }
    return classNameVariant;

  }
  
  render() {
    const {isStart, isFinish, isWall, background} = this.props;
    const {cellSelectionMode, cellToChange} = this.props.cellContextProps;
    
    return (
      <div
            className={`grid-box${this.state.isVisited && (!isStart && !isFinish)? " visited-cell" : this.cellStyle(isStart, isFinish, isWall, background)}`}
              onMouseEnter={(event) => this.handleMouseEnter(event)}
              onMouseLeave={this.handleMouseLeave}
              onMouseDown={(event) => {event.preventDefault(); this.handleMouseDown(event, cellToChange)}}
              onMouseUp={this.handleMouseUp}
              onClick={cellSelectionMode ? ()=> this.onClickHandler(cellToChange) : null}

            >
            </div>
    )
  }
}
