import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Register } from "./Register";
import { Login } from "./Login";
import { Home } from "./Home";

export class Main extends React.Component {
    getLogin = () => {
        return this.props.isLoggedIn ? <Redirect to="/home"/> : <Login handleLogin={ this.props.handleLogin }/>;
    }

    getRoot = () => {
        return <Redirect to="/login"/>;
    }

    getHome = () => {
        return this.props.isLoggedIn ? <Home/> : <Redirect to="/login"/>;
    }
    render() {
        return(
            <div className="main">
                <Switch>
                    <Route exact path="/" render={this.getRoot}/>
                    <Route path="/home" render={this.getHome}/>
                    <Route path="/login" render={this.getLogin}/>
                    <Route path="/register" component={Register}/>
                    <Route render={this.getRoot}/>
                </Switch>
            </div>
        );
    }
}