import React from 'react';
import { Formik } from 'formik'
import  * as Yup from 'yup'
import Auth from '../../Services/Auth'
import './Login.css';
import logo from '../../Assets/Images/logo.png';
import 'bulma/css/bulma.css'

class Login extends React.PureComponent {
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
            email: Yup.string().required("נדרש").email("אימייל שגוי"),
            password: Yup.string().required("נדרש"),
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
                        initialValues={{ email: '',password:'' }}
                        onSubmit={(values, actions) => {
                            this.setState({buttonLoading: 'is-loading'})
                         Auth.login(values,(status,user,errorMessage)=>{
                             if(status){
                                this.setState({buttonLoading: ''})
                                this.props.history.push({pathname: "/"})
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
                                    <div className="control">
                                        <input
                                            className={`input is-rounded ${props.touched.password && props.errors.password? 'is-danger':''}`}
                                            type="password"
                                            placeholder="Password"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.password}
                                            name="password"
                                        />
                                    </div>
                                   {props.touched.password && props.errors.password && <p className="help is-right is-danger">{props.errors.password}</p>}
                                </div>
                                <div className="field field-input">
                                {this.state.loginError && <p className="help is-right is-danger">{this.state.loginError}</p>}
                                </div>
                                <div className="field field-button">
                                    <p className="control">
                                        <button className={`button is-primary is-rounded is-small ${this.state.buttonLoading}`} type="submit">
                                            Login
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

export default Login;