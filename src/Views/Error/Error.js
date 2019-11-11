import React from 'react';
import './Error.css';
import logo from '../../Assets/Images/logo.png';

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
            <div className="section">
                <div className="main-container container">
                    <div className="field" style={{ marginTop: '10%', marginLeft: '47%' }}>
                        <div className="control">
                            <img src={logo} alt="Logo" />
                        </div>
                    </div>
                    <div className="field" style={{ marginTop: '10%', marginLeft: '47%' }}>
                        <div className="control">
                            <label>How did you get here?</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Error;