import React, { Component } from 'react';
import './Home.css';
import logo from '../logo.png';
import avatar from '../kk.jpg'
import 'bulma/css/bulma.css'
import Form from "./Form";
import ImageList from "./ImageList";
import UserList from "./UserList";

class Home extends Component {

    render() {
        return (
            <div className="section">
                <nav className="level navbar is-transparent" style={{ background : 'transparent'}}>
                    <div className="level-left">
                        <div className="level-item">
                            <img className="avatar" src={avatar} alt="Avatar"/>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <img className="app-logo" src={logo} alt="App Logo" />
                        </div>
                    </div>
                </nav>
                    <div className="columns">
                        <div className="column is-three-fifths">
                            <Form/>
                        </div>
                        <div className="column is-one-fifth" style={{ width: '15%'}}>
                            <ImageList/>
                        </div>
                        <div className="column is-one-quarter">
                            <UserList/>
                        </div>
                    </div>
            </div>
        );
    }
}

export default Home;