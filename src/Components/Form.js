import React, { Component } from 'react';
import './Form.css';
import 'bulma/css/bulma.css'
import Axios from 'axios';
import { Formik } from 'formik'
import * as Yup from 'yup'
const emptyImage = require('../empty-image.png')

class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageLoading: true,
            image: null,
            buttonLoading: '',
            retakeButtonLoading: '',
            irrelevantButtonLoading: ''
        }
    }
    componentWillMount() {
        console.log("image id", this.props.imageID)
    }

    saveImageDataCallback = (response) =>{
        if(response){
            this.setState({buttonLoading: ''})
        }else{
            this.setState({buttonLoading: ''})
        }
    }

    irrelevantPicture = () =>{
    this.setState({irrelevantButtonLoading: 'is-loading'})
    this.props.irrelevantPicture(this.props.imageID,()=>this.setState({irrelevantButtonLoading: ''}))
    }

    retakePicture = () => {
    this.setState({retakeButtonLoading: 'is-loading'})
    this.props.retakePicture(this.props.imageID,()=>this.setState({retakeButtonLoading: ''}))
    }
 

    render() {
        const validationSchema =
            Yup.object().shape({
                reference: Yup.string().required("נדרש"),
                date: Yup.date().required("נדרש"),
                detail: Yup.string().required("נדרש"),
                category: Yup.string().required("נדרש"),
                sum: Yup.string().required("נדרש"),
                vat: Yup.string().required("נדרש"),
                image: Yup.string().required("נדרש")
            })

        return (
            <Formik
                initialValues={{ reference: '', date: '', detail: '', category: '', vat: '', sum: '', image: this.props.imageID || '' }}
                onSubmit={(values, actions) => {
                    this.setState({ buttonLoading: 'is-loading' })
                    this.props.saveImageData(values,this.saveImageDataCallback)
    
                    console.log("HELOOOOO",values)

                }}
                enableReinitialize ={true}
                validationSchema={validationSchema}
                render={({ values, touched, errors, handleSubmit, handleChange, handleBlur }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="box">
                            <div className="columns">
                                <div className="column is-half">
                                    <div className="columns form-columns">
                                        <input
                                            name="image"
                                            type="hidden"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={this.props.imageID || ''}
                                        />
                                        <div className="column is-half">
                                            <p className="control">
                                                <input
                                                    className={`input is-small ${touched.reference && errors.reference ? 'is-danger' : ''}`}
                                                    type="text"
                                                    placeholder="Reference"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    name="reference" />
                                            </p>
                                            {touched.reference && errors.reference && <p className="help is-danger">{errors.reference}</p>}
                                        </div>
                                        <div className="column is-half">
                                            <p className="control">
                                                <input className="input is-small"
                                                    type="date"
                                                    className={`input is-small ${touched.date && errors.date ? 'is-danger' : ''}`}
                                                    placeholder="Date"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    name="date" />
                                            </p>
                                            {touched.date && errors.date && <p className="help is-danger">{errors.date}</p>}
                                        </div>
                                    </div>

                                    <div className="columns">
                                        <div className="column is-half">
                                            <p className="control">
                                                <input className="input is-small" type="text"
                                                    placeholder="Detail"
                                                    className={`input is-small ${touched.detail && errors.detail ? 'is-danger' : ''}`}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    name="detail" />
                                            </p>
                                            {touched.detail && errors.detail && <p className="help is-danger">{errors.detail}</p>}
                                        </div>
                                        <div className="column is-half">
                                            <p className="control">
                                                <input className="input is-small" type="text"
                                                    placeholder="Category"
                                                    className={`input is-small ${touched.category && errors.category ? 'is-danger' : ''}`}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    name="category" />
                                            </p>
                                            {touched.category && errors.category && <p className="help is-danger">{errors.category}</p>}
                                        </div>
                                    </div>
                                    <div className="columns">
                                        <div className="column is-half">
                                            <p className="control">
                                                <input className="input is-small"
                                                    type="text"
                                                    className={`input is-small ${touched.vat && errors.vat ? 'is-danger' : ''}`}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    name="vat"
                                                    placeholder="מע״מ" />
                                            </p>
                                            {touched.vat && errors.vat && <p className="help is-danger">{errors.vat}</p>}
                                        </div>
                                        <div className="column is-half">
                                            <p className="control">
                                                <input className="input is-small"
                                                    type="text"
                                                    placeholder="Sum"
                                                    className={`input is-small ${touched.sum && errors.sum ? 'is-danger' : ''}`}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    name="sum" />
                                            </p>
                                            {touched.sum && errors.sum && <p className="help is-danger">{errors.sum}</p>}
                                        </div>
                                    </div>

                                </div>
                                <div className="column is-half">
                                    {errors.image && values.image === ''? <p className="help is-danger">{errors.image}</p>:<div/>}
                                    <div className="box form-box">
                                        {this.props.imageID ? 
                                        <img className="image" src={this.props.imageID} alt="receipt" /> : <div>Select an Image</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column is-half">
                                    <div className="buttons">
                                        <button type="submit" onClick={()=>{ console.log("Values",values)}} className={`button receipt-button receipt-button-success is-info ${this.state.buttonLoading}`}>לא רלוונטי</button>
                                    </div>
                                </div>
                                <div className="column is-half">
                                    <div className="buttons">
                                        <button onClick={this.irrelevantPicture} type="button" className={`button receipt-button receipt-button-left ${this.state.irrelevantButtonLoading}`}>לא רלוונטי</button>
                                        <button onClick={this.retakePicture} type="button" className={`button receipt-button receipt-button-right ${this.state.retakeButtonLoading}`}>לצילום מחד</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            />

        );
    }
}

export default Form;