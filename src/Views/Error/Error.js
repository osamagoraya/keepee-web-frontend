import React from 'react';
import "../../Styles/common.scss";
import logo from '../../Assets/Images/logo.png';
import 'bulma/css/bulma.css'

class Error extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            buttonLoading: '',
            loginError: ''
        }
    }
    render() {
        return (
            <div className="section auth-section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-6-desktop is-offset-3-desktop">
                            <div align="center" style={{ marginBottom: 20 }}>
                                <img src={logo} alt="Logo" />
                            </div>
                            <div className="field">
                                <div className="control">
                                    <label>How did you get here?</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Error;
