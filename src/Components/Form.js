import React, { Component } from 'react';
import './Form.css';
import 'bulma/css/bulma.css'
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
            irrelevantButtonLoading: '',
            alertType: '',
            visible: false,
            alertMessage: ''
        }
    }
    componentWillMount() {
        console.log("image id", this.props.imageID)
    }

    irrelevantPicture = () => {
        if(this.props.imageID){
            this.setState({ irrelevantButtonLoading: 'is-loading' })
            this.props.irrelevantPicture(this.props.imageID, this.showAlert)
        }
      
    }

    retakePicture = () => {
        if(this.props.imageID){
            this.setState({ retakeButtonLoading: 'is-loading' })
            this.props.retakePicture(this.props.imageID, this.showAlert)
        }
       
    }

    showAlert = (response) => {
        if (response) {
            this.setState({ visible: true, alertType: 'is-success', buttonLoading: '', irrelevantButtonLoading: '', retakeButtonLoading: '', alertMessage: 'Request Completed Successfully' })
        } else {
            this.setState({ visible: true, alertType: 'is-danger', buttonLoading: '', irrelevantButtonLoading: '', retakeButtonLoading: '', alertMessage: 'Request Failed Completing. Please Try Again!' })
        }
        setTimeout(() => {
            this.onDismiss()
        }, 3000)
    }

    onDismiss() {
        this.setState({ visible: false, alertType: '', alertMessage: '' });
    }

    render() {
        const validationSchema =
            Yup.object().shape({
                reference: Yup.string().required("נדרש"),
                date: Yup.date().required("נדרש"),
                detail: Yup.string().required("נדרש"),
                category: Yup.string().required("נדרש"),
                vendor: Yup.string().required("נדרש"),
                sum: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
                vat: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
                image: Yup.string().required("נדרש")
            })

        return (
            <div className="box content-overflow">
                <div className="content">
                    <Formik
                        initialValues={{ reference: '', date: '', detail: '', category: '', vat: '', sum: '', image: this.props.imageID || '', vendor: '' }}
                        onSubmit={(values, actions) => {
                            this.setState({ buttonLoading: 'is-loading' })
                            this.props.saveImageData(values, this.showAlert)
                        }}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        render={({ values, touched, errors, handleSubmit, handleChange, handleBlur }) => (
                            <form onSubmit={handleSubmit}>
                                {this.state.visible ? <div class={`notification ${this.state.alertType}`}>{this.state.alertMessage}</div> : null}
                                <div className="columns">

                                    <div className="column is-half">
                                        {this.props.imageID ?
                                        <div>
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
                                                            placeholder="Vendor"
                                                            className={`input is-small ${touched.vendor && errors.vendor ? 'is-danger' : ''}`}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.password}
                                                            name="vendor" />
                                                    </p>
                                                    {touched.vendor && errors.vendor && <p className="help is-danger">{errors.vendor}</p>}
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
                                            <div className="column">
                                                <p className="control">
                                                    <input className="input is-small"
                                                        type="text"
                                                        placeholder="Detail"
                                                        className={`input is-small ${touched.sum && errors.sum ? 'is-danger' : ''}`}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.password}
                                                        name="detail" />
                                                </p>
                                                {touched.detail && errors.detail && <p className="help is-danger">{errors.detail}</p>}
                                            </div>
                                        </div>: null}
                                    </div>
                                    <div className="column is-half">
                                        {errors.image && values.image === '' ? <p className="help is-danger">{errors.image}</p> : <div />}
                                        <div className="box form-box">
                                            {this.props.imageID ?
                                                <img className="image" src={this.props.imageID} alt="receipt" /> : <div>Select an Image</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="columns">
                                    <div className="column is-half">
                                        <div className="buttons">
                                            <button type="submit" onClick={() => { console.log("Values", values) }} className={`button receipt-button receipt-button-success is-info ${this.state.buttonLoading}`}>לא רלוונטי</button>
                                        </div>
                                    </div>
                                    <div className="column is-half">
                                        <div className="buttons">
                                            <button onClick={this.irrelevantPicture} type="button" className={`button receipt-button receipt-button-left ${this.state.irrelevantButtonLoading}`}>לא רלוונטי</button>
                                            <button onClick={this.retakePicture} type="button" className={`button receipt-button receipt-button-right ${this.state.retakeButtonLoading}`}>לצילום מחד</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default Form;