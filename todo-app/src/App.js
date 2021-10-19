import logo from './logo.svg';
import './App.css';
import LoginPage from './Components/LoginPage';
import React, { Component } from 'react';

export class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isLoaded: false,
    }
  }

  componentDidMount() {
    this.setState({
      isLoaded: true,
    }); 
  }

  render() {

    const isLoaded = this.state.isLoaded;

    if(isLoaded){
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>
              Todo App
            </h1>
          </header>
          <LoginPage />
        </div>
      )
    }
    else {
      return(
      <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>
              Loading...
            </h1>
          </header>
        </div>
      )}
  }
}

export default App;
