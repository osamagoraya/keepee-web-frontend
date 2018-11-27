import React, { Component } from 'react';
import './Form.css';
import 'bulma/css/bulma.css'
import { Formik } from 'formik'
import * as Yup from 'yup'


const categories = [
    { type: 'VAT deals', vat: 0 },
    { type: 'VAT effords', vat: 0 },
    { type: 'VAT equipment effords', vat: 0 },
    { type: 'Sales', vat: 100 },
    { type: 'Content suppliers', vat: 66.66 },
    { type: 'Income w/o taxes', vat: 0 },
    { type: 'Shopping', vat: 100 },
    { type: 'Other shopping', vat: 100 },
    { type: 'Pro tasks', vat: 75 },
    { type: 'Development task', vat: 85 },
    { type: 'Custom', vat: 0 }

]

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
            alertMessage: '',
            dropdownState: '',
            imageAngle: 90,
        }
    }
    componentWillMount() {
        console.log("image id", this.props.imageID)
    }

    dropdownToggle = () => {
        console.log("In dropdown")
        if (!this.state.dropdownState) {
            this.setState({ dropdownState: 'is-active' })
        } else {
            this.setState({ dropdownState: '' })
        }
    }
    irrelevantPicture = () => {
        if (this.props.imageID) {
            this.setState({ irrelevantButtonLoading: 'is-loading' })
            this.props.irrelevantPicture(this.props.imageID, this.showAlert)
        }

    }

    retakePicture = () => {
        if (this.props.imageID) {
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

    transformImage = () => {
        let angle = this.state.imageAngle
        angle = parseInt(angle) + 90
        this.setState({ imageAngle: angle })
    }

    getVat = (values, _category) => {
        console.log("Category", values)
        let result = categories.find(category => {
            return category.type === _category
        })

        if (result) {
            if (result.type === 'Custom') {
                return values.vat
            }
            console.log(result.vat)
            values.vat = result.vat
        } else {
            values.vat = 0
        }

        return values.vat
    }

    getPercentageSum(vat, sum, values) {

        let percentage = (parseInt(vat) / 100) * parseInt(sum ? sum : 0)
        let result = (parseInt(percentage) + parseInt(sum ? sum : 0))
        values.sum = result
        return result

    }
    categoryChanged = (handleChange, _vat, _category) => {
        handleChange()
        this.getVat(_vat, _category)

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
                amount: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
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
                                                                placeholder="התייחסות"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.reference}
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
                                                                value={values.date}
                                                                name="date" />
                                                        </p>
                                                        {touched.date && errors.date && <p className="help is-danger">{errors.date}</p>}
                                                    </div>
                                                </div>

                                                <div className="columns">
                                                    <div className="column is-half">
                                                        <p className="control">
                                                            <input className="input is-small" type="text"
                                                                placeholder="ספק"
                                                                className={`input is-small ${touched.vendor && errors.vendor ? 'is-danger' : ''}`}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.vendor}
                                                                name="vendor" />
                                                        </p>
                                                        {touched.vendor && errors.vendor && <p className="help is-danger">{errors.vendor}</p>}
                                                    </div>
                                                    <div className="column is-half">
                                                        <div className="select">
                                                            <select name="category"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.category} >
                                                                <option value={null}> בחר קטגוריה</option>
                                                                {categories.map(category => {
                                                                    return (<option value={category.type}>{category.type}            </option>)
                                                                })}

                                                            </select>
                                                        </div>
                                                        {touched.category && errors.category && <p className="help is-danger">{errors.category}</p>}
                                                    </div>
                                                </div>


                                                <div className="columns">
                                                    <div className="column is-half">
                                                        <p className="control has-icons-left">
                                                            <input className="input is-small"
                                                                type="text"
                                                                className={`input is-small ${touched.vat && errors.vat ? 'is-danger' : ''}`}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={this.getVat(values, values.category)}
                                                                name="vat"
                                                                placeholder="מע״מ"

                                                            />
                                                            <span class="icon is-small is-left">
                                                                <i class="fas fa-percentage"></i>
                                                            </span>
                                                        </p>
                                                        {touched.vat && errors.vat && <p className="help is-danger">{errors.vat}</p>}
                                                    </div>
                                                    <div className="column is-half">
                                                        <p className="control">
                                                            <input className="input is-small"
                                                                type="text"
                                                                placeholder="סכום"
                                                                className={`input is-small ${touched.sum && errors.sum ? 'is-danger' : ''}`}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.sum}
                                                                name="sum" />
                                                        </p>
                                                        {touched.sum && errors.sum && <p className="help is-danger">{errors.sum}</p>}
                                                    </div>
                                                </div>
                                                {/* <div className="column">
                                                    <p className="control">
                                                        <input className="input is-small"
                                                            type="text"
                                                            placeholder="סכום"
                                                            className={`input is-small ${touched.sum && errors.sum ? 'is-danger' : ''}`}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={this.getPercentageSum(values.vat, values.amount, values)}
                                                            name="sum"
                                                            disabled />
                                                    </p>
                                                    {touched.detail && errors.detail && <p className="help is-danger">{errors.detail}</p>}
                                                </div> */}
                                                <div className="column">
                                                    <p className="control">
                                                        <input className="input is-small"
                                                            type="text"
                                                            placeholder="Detail"
                                                            className={`input is-small ${touched.detail && errors.detail ? 'is-danger' : ''}`}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.detail}
                                                            name="detail" />
                                                    </p>
                                                    {touched.detail && errors.detail && <p className="help is-danger">{errors.detail}</p>}
                                                </div>
                                            </div> : null}
                                    </div>
                                    <div className="column is-half">
                                        {errors.image && values.image === '' ? <p className="help is-danger">{errors.image}</p> : <div />}
                                        <div className="image-box form-box">
                                            {this.props.imageID ?
                                                <img className="image" style={{ transform: `rotate(${this.state.imageAngle}deg)` }} src={this.props.imageID} alt="receipt" /> : <div>בחר תמונה</div>}
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
                                            <a onClick={this.transformImage} class="button transform-button-icon-color" style={{ borderRadius: 40, backgroundColor: '#87cefa' }}>
                                                <span class="icon is-small">
                                                    <i class="fas fa-undo"></i>
                                                </span>
                                            </a>
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