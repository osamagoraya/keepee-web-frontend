import React from 'react';
import { Formik } from 'formik'
import  * as Yup from 'yup'
import Auth from '../../Services/Auth'
import "../../Styles/common.scss";
import logo from '../../Assets/Images/logo.png';
import swal from 'sweetalert';

class GetToken extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            buttonLoading: '',
            loginError: ''
        }
    }
    render() {
        const validationSchema =
        Yup.object().shape({
            email: Yup.string().required("נדרש").email("אימייל שגוי")
        })
        return (
            <div className="section auth-section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-6-desktop is-offset-3-desktop">
                            <div align="center" style={{ marginBottom: 20 }}>
                                <img src={logo} alt="Logo" />
                            </div>
                            <Formik
                                initialValues={{ email: '' }}
                                onSubmit={(values, actions) => {
                                    this.setState({buttonLoading: 'is-loading'})
                                    Auth.resetPassword(values,(status,user,errorMessage)=>{
                                        if(status === 200){
                                            this.setState({buttonLoading: ''});
                                            swal ( "Success" ,  "Check Your Email!" ,  "success" );
                                            this.props.history.push({pathname: "/securelogin/token-id=r$3easd"});
                                        }else{
                                            this.setState({buttonLoading: '',loginError: errorMessage})
                                        }
                                    })

                                }}
                                validationSchema = {validationSchema}
                                render={props => (
                                    <form onSubmit={props.handleSubmit}>
                                        <div className="field field-input">
                                            <div className="control">
                                                <input
                                                    className={`input is-rounded ${props.touched.email && props.errors.email? 'is-danger': ''}`}
                                                    type="text"
                                                    placeholder="Email"
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                    value={props.values.email}
                                                    name="email" />
                                            </div>
                                            {props.touched.email && props.errors.email && <p className="help is-right is-danger">{props.errors.email}</p>}
                                        </div>
                                        <div className="field field-input">
                                            {this.state.loginError && <p className="help is-right is-danger">{this.state.loginError}</p>}
                                        </div>
                                        <div align="center" className="field field-button">
                                            <button className={`button auth-button is-primary is-rounded is-small ${this.state.buttonLoading}`} type="submit">
                                                Get Reset Token
                                            </button>
                                        </div>
                                    </form>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GetToken;
