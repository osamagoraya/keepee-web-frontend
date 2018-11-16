import React, { Component } from 'react';
import './Login.css';
import logo from '../logo.png';
import 'bulma/css/bulma.css'

class Login extends Component {

   login = () => {
        // check that email should have a valid email
       // fields should not be empty
    }

    render() {
        return (
            <div className="section">
                <div className="main-container container">
                    <div className="field" style={{ marginTop: '10%' , marginLeft: '47%'}}>
                        <div className="control">
                            <img src={logo} alt="Logo"/>
                        </div>
                    </div>
                    <div className="field field-input">
                        <div className="control">
                            <input className="input is-rounded" type="text" placeholder="Email" />
                        </div>
                    </div>
                    <div className="field field-input">
                        <div className="control">
                            <input className="input is-rounded" type="text" placeholder="Password" />
                        </div>
                    </div>
                    <div className="field field-button">
                        <p className="control">
                            <button className="button is-primary is-rounded is-small" onClick={this.login}>
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;