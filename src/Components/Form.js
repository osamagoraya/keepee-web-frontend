import React, { Component } from 'react';
import './Form.css';
import 'bulma/css/bulma.css'
import receipt from '../receipt.jpg'

class Form extends Component {

    render() {
        return (
            <div className="box">
                <div className="columns">
                    <div className="column is-half">
                            <div className="columns form-columns">
                                <div className="column is-half">
                                    <p className="control">
                                        <input className="input is-small" type="email" placeholder="Reference" />
                                    </p>
                                </div>
                                <div className="column is-half">
                                    <p className="control">
                                        <input className="input is-small" type="email" placeholder="Date" />
                                    </p>
                                </div>
                            </div>
                        <div className="columns">
                            <div className="column is-half">
                                <p className="control">
                                    <input className="input is-small" type="email" placeholder="Detail" />
                                </p>
                            </div>
                            <div className="column is-half">
                                <p className="control">
                                    <input className="input is-small" type="email" placeholder="Category" />
                                </p>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column is-half">
                                <p className="control">
                                    <input className="input is-small" type="email" placeholder="מע״מ" />
                                </p>
                            </div>
                            <div className="column is-half">
                                <p className="control">
                                    <input className="input is-small" type="email" placeholder="Sum" />
                                </p>
                            </div>
                        </div>
                     </div>
                    <div className="column is-half">
                        <div className="box form-box">
                                <img className="image" src={receipt} alt="receipt"/>
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-half">
                        <div className="buttons">
                            <button className="button receipt-button receipt-button-success is-info">לא רלוונטי</button>
                        </div>
                    </div>
                    <div className="column is-half">
                            <div className="buttons">
                                <button className="button receipt-button receipt-button-left">לא רלוונטי</button>
                                <button className="button receipt-button receipt-button-right">לצילום מחד</button>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form;