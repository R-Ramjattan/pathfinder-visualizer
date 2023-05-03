import React, { Component } from 'react'
import { NavLink } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export default class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            editStart: false,
            editFinish: false,
            editWalls: false,
        }
    }

  toggleEditMode = (selectedMode) => {
    const { cellSelectionMode, cellSelectionToggle, changeCellType } = this.props.headerContextProps;

    let newState = {
      editStart: false,
      editFinish: false,
      editWalls: false,
    };

    if (!this.state[selectedMode]) {
      newState[selectedMode] = true;
      if (!cellSelectionMode) {
        cellSelectionToggle(true);
      }
    } else {
      cellSelectionToggle(false);
    }

    this.setState(newState);

    if (selectedMode === "editStart") {
      changeCellType(1);
    } else if (selectedMode === "editFinish") {
      changeCellType(0);
    } else if (selectedMode === "editWalls") {
      changeCellType(2);
    }
  };

  render() {
    const {genRBTMaze, genPrimsMaze ,pathFinder, clearBoard, inAnimationState, setInAnimation} = this.props.headerContextProps;

    return (
      <>
          <Navbar bg="light" expand="lg">
            <Container>
              <Navbar.Brand className="nav-link-custom" >Pathfinder Visualizer</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="w-100">
                
                  <NavDropdown className="nav-link-custom" title="Mazes" id="basic-nav-dropdown" disabled={inAnimationState}>
                    <NavDropdown.Item onClick={() => genRBTMaze()}>Recursive Backtracking</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => genPrimsMaze()}>Prim's Algorithm</NavDropdown.Item>
                  </NavDropdown>
                  

                  <NavDropdown className="nav-link-custom" title="Algorithms" id="basic-nav-dropdown" disabled={inAnimationState}>
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>

                  <NavLink className="nav-link-custom" onClick={()=>{
                    if (!this.props.headerContextProps.inAnimationState) {
                      setInAnimation(true);
                      pathFinder();
                    }
                  }}
                  disabled={inAnimationState}>
                  Visualize
                </NavLink>

                  <div className="nav-spacer"></div>
                    <NavLink className="nav-link-custom" onClick={() => this.toggleEditMode("editStart")} disabled={inAnimationState}>Source</NavLink>
                    <NavLink className="nav-link-custom" onClick={() => this.toggleEditMode("editFinish")} disabled={inAnimationState}>Destination</NavLink>
                    <NavLink className="nav-link-custom" onClick={() => this.toggleEditMode("editWalls")} disabled={inAnimationState}>Walls</NavLink>
                    <NavLink className="nav-link-custom" onClick={() => clearBoard()} disabled={inAnimationState}>Clear Board</NavLink>

                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

      </>
    )
  }
}
