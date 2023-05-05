import React, { Component } from 'react'
import { Navbar, Container, Nav, NavDropdown, NavLink, Toast} from 'react-bootstrap';


export default class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            editStart: false,
            editFinish: false,
            editWalls: false,
            algorithmType: "",
            showToast: false,
        }
    }
  
  handleShow = () => {
    this.setState({ showToast: true });
  };

  handleClose = () => {
    this.setState({ showToast: false });
  };

  setAlgorithmType=(algorithm)=>{
    this.setState({algorithmType: algorithm});
  }
  visualizeAlgorithm = () => {
    const { pathFinder, visualizeAStar,inAnimationState, setInAnimation } = this.props.headerContextProps;
    const { algorithmType } = this.state;
    if(algorithmType === ""){
      this.handleShow();
    }
    if (algorithmType === 'Dijkstra' && !inAnimationState) {
      setInAnimation(true);
      pathFinder();
    } 
    if (algorithmType === 'A*' && !inAnimationState) {
      setInAnimation(true);
      visualizeAStar();
    } 
  };

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
    const {genRBTMaze, genPrimsMaze , clearBoard, inAnimationState, setInAnimation} = this.props.headerContextProps;
    const { showToast } = this.state;
    return (
      <>  
      <div>
        <Toast
          onClose={this.handleClose}
          show={showToast}
          delay={3000}
          autohide
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex:100,
          }}
        >
          <Toast.Header>
            <strong className="mr-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body><strong>Please Select an Algorithm!</strong></Toast.Body>
        </Toast>
      </div>
      
          <Navbar bg="light" expand="lg" className="navbar">
            <Container>
              <Navbar.Brand className="nav-link-custom" >Pathfinder Visualizer</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="w-100">
                
                  <NavDropdown className="nav-link-custom" title="Mazes" id="basic-nav-dropdown" disabled={inAnimationState}>
                    <NavDropdown.Item onClick={()=>{
                    if (!this.props.headerContextProps.inAnimationState) {
                      setInAnimation(true);
                      genRBTMaze();
                    }}}>Recursive Backtracking
                    </NavDropdown.Item>

                    <NavDropdown.Item onClick={()=>{
                    if (!this.props.headerContextProps.inAnimationState) {
                      setInAnimation(true);
                      genPrimsMaze();
                    }
                  }}>Prim's Algorithm</NavDropdown.Item>
                  </NavDropdown>
                  

                  <NavDropdown className="nav-link-custom" title="Algorithms" id="basic-nav-dropdown" disabled={inAnimationState}>
                    <NavDropdown.Item onClick={()=>{this.setAlgorithmType('Dijkstra')}} disabled={inAnimationState}>Dijkstra's Algorithm </NavDropdown.Item>
                    <NavDropdown.Item onClick={()=>{this.setAlgorithmType('A*')}} disabled={inAnimationState}>A* Search </NavDropdown.Item>
                  </NavDropdown>

                  <NavLink className="nav-link-custom" onClick={()=>{this.visualizeAlgorithm()}}
                    disabled={inAnimationState}>
                    Visualize {this.state.algorithmType}
                  </NavLink>

                  <div className="nav-spacer"></div>
                    <NavLink className="nav-link-custom" onClick={() => this.toggleEditMode("editStart")} disabled={inAnimationState}>Source</NavLink>
                    <NavLink className="nav-link-custom" onClick={() => this.toggleEditMode("editFinish")} disabled={inAnimationState}>Destination</NavLink>
                    <NavLink className="nav-link-custom" onClick={() => this.toggleEditMode("editWalls")} disabled={inAnimationState}>Walls</NavLink>
                    <NavLink className="nav-link-custom" onClick={() => clearBoard(true)} disabled={inAnimationState}>Clear Board</NavLink>

                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

      </>
    )
  }
}
