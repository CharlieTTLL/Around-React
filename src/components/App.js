import React, { Component } from 'react';
import { Header } from "./Header"
import { Main } from "./Main"
import { TOKEN_KEY } from "../constants"

import '../styles/App.css';

class App extends Component {
  state = {
    isLoggedIn: !!localStorage.getItem(TOKEN_KEY),
  }

  handleLogIn = (response) => {
    localStorage.setItem(TOKEN_KEY, response);
    this.setState({ isLoggedIn: true });
  }

  handleLogOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    this.setState({ isLoggedIn: false });
  }
  render() {
    return (
      <div className="App">
          <Header isLoggedIn={this.state.isLoggedIn} handleLogOut={this.handleLogOut}/>
          <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogIn}/>
      </div>
    );
  }
}

export default App;
