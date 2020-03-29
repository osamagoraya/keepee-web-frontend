import React from 'react';
import { Formik } from 'formik'
import  * as Yup from 'yup'
import Auth from '../../Services/Auth'
import './Reset.css';
import logo from '../../Assets/Images/logo.png';
import swal from 'sweetalert';

class Reset extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            buttonLoading: '',
            loginError: '',
            authToken: this.props.match.params.authToken
        }
    }
    render() {
        const validationSchema =
        Yup.object().shape({
            password: Yup.string().required("נדרש"),
            confirmPassword: Yup.string().required("נדרש")
        })
        return (
            <div className="section">
                <div className="main-container container">
                    <div className="field" style={{ marginTop: '10%', marginLeft: '47%' }}>
                        <div className="control">
                            <img src={logo} alt="Logo" />
                        </div>
                    </div>
                    <Formik
                        initialValues={{ password: '',confirmPassword:'', authToken: this.state.authToken }}
                        onSubmit={(values, actions) => {
                            this.setState({buttonLoading: 'is-loading'})
                         Auth.updatePassword(values,(status,user,errorMessage)=>{
                             console.log('status',status);
                             if(status === 200){
                                this.setState({buttonLoading: ''})
                                swal ( "Success" ,  "Password Updated Successfully!" ,  "success" );
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
                                            className={`input is-rounded ${props.touched.password && props.errors.password? 'is-danger': ''}`}
                                            type="text"
                                            placeholder="Password"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.password}
                                            name="password" />
                                    </div>
                                    {props.touched.password && props.errors.password && <p className="help is-right is-danger">{props.errors.password}</p>}
                                </div>
                                <div className="field field-input">
                                    <div className="control">
                                        <input
                                            className={`input is-rounded ${props.touched.confirmPassword && props.errors.confirmPassword? 'is-danger':''}`}
                                            type="password"
                                            placeholder="Confirm Password"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.confirmPassword}
                                            name="confirmPassword"
                                        />
                                    </div>
                                   {props.touched.confirmPassword && props.errors.confirmPassword && <p className="help is-right is-danger">{props.errors.confirmPassword}</p>}
                                </div>
                                <div className="field field-input">
                                {this.state.loginError && <p className="help is-right is-danger">{this.state.loginError}</p>}
                                </div>
                                <div className="field field-button">
                                    <p className="control">
                                        <button className={`button is-primary is-rounded is-small ${this.state.buttonLoading}`} type="submit">
                                            Reset
                                        </button>
                                    </p>
                                </div>
                              
                            </form>
                        )}
                    />




                </div>
            </div>
        );
    }
}

export default Reset;