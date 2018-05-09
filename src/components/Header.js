import React from 'react';
import logo from '../assets/images/gw.gif';
import { Icon } from 'antd';

export class Header extends React.Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome</h1>
                {
                    this.props.isLoggedIn ?
                        <a className="logout"
                            onClick={this.props.handleLogOut}
                        >
                            <Icon type="logout" />{' '}Logout
                        </a> : null
                }
            </header>
        );
    }
}

