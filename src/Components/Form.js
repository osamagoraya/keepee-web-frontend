import React, { Component } from 'react';
import './Form.css';
import 'bulma/css/bulma.css'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select';


const categories = [
    { label: '-101 VAT effords', value: 0.1, vat: 0, type: '-101 VAT effords', },
    { label: '-102 VAT equipment effords', value: 0.2, vat: 0, type: '-102 VAT equipment effords', },
    { label: '-100 VAT deals', value: 0.3, vat: 0, type: '-100 VAT deals', },
    { label: ' 101001 Sales', value: 100.1, vat: 100, type: '101001 Sales', },
    { label: ' 701002 Content suppliers', value: 66.66, vat: 66.66, type: '701002 Content suppliers', },
    { label: ' 102001 incomes without taxes', value: 0.4, vat: 0, type: '102001 incomes without taxes' },
    { label: ' 201001 shoping', value: 100.2, vat: 100, type: '201001 shoping', },
    { label: ' 201002 other shopping', value: 100, vat: 100, type: '201002 other shopping', },
    { label: ' 201003 Pro tasks', value: 75, vat: 75, type: '201003 Pro tasks', }
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
            customPercentage: false
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

        const { selectedOption } = this.state;
        return (
            <div className="box content-overflow-form" style={{ direction: 'rtl', overflow: 'hidden' }}>
                <div className="content" style={{ direction: 'ltr' }}>
                    <Formik
                        initialValues={{ reference: '', date: '', detail: '', category: '', vat: '', sum: '', image: this.props.imageID || '', vendor: '' }}
                        onSubmit={(values, actions) => {
                            this.setState({ buttonLoading: 'is-loading' })
                            this.props.saveImageData(values, this.showAlert)
                        }}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        render={({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
                            <form onSubmit={handleSubmit}>
                                {this.state.visible ? <div class={`notification ${this.state.alertType}`}>{this.state.alertMessage}</div> : null}
                                <div className="columns">
                                    <div className="column is-half form-inputs-column">
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
                                                                placeholder="אסמכתא"
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
                                                        <Select
                                                            value={categories.filter(category => category.type === values.category)}
                                                            onChange={(selectedOption) => {
                                                                setFieldValue('category', selectedOption.type)
                                                                setFieldValue('vat', selectedOption.vat)
                                                            }}
                                                            options={categories}
                                                            getOptionLabel={option => option.type}
                                                            isMulti={false}
                                                            placeholder="חשבון"
                                                            isRtl={true}
                                                            className="is-small"
                                                        />
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
                                                                value={values.vat}
                                                                name="vat"
                                                                placeholder="מע״מ"
                                                            />
                                                            <span className="icon is-small is-left" >
                                                                <i className="fal fa-percent"></i>
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
                                                <div className="columns">
                                                    <div className="column">
                                                        <p className="control">
                                                            <input className="input is-small"
                                                                type="text"
                                                                placeholder="פירוט"
                                                                className={`input is-small ${touched.detail && errors.detail ? 'is-danger' : ''}`}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.detail}
                                                                name="detail" />
                                                        </p>
                                                        {touched.detail && errors.detail && <p className="help is-danger">{errors.detail}</p>}
                                                    </div>
                                                </div>
                                            </div> : null}
                                    </div>
                                    <div className="column is-half form-inputs-column">
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
                                            <button type="submit" onClick={() => console.log("Errors", errors)} className={`button receipt-button receipt-button-success ${this.state.buttonLoading}`}>המשך</button>
                                        </div>
                                    </div>
                                    <div className="column is-half buttons-three">

                                        <button onClick={this.irrelevantPicture} type="button" className={`button receipt-button receipt-button-left ${this.state.irrelevantButtonLoading}`}>לא רלוונטי</button>


                                        <button onClick={this.retakePicture} type="button" className={`button receipt-button receipt-button-right ${this.state.retakeButtonLoading}`}>לצילום מחד</button>


                                        <a onClick={this.transformImage} class="button is-small transform-button-icon-color" style={{ borderRadius: '50%', backgroundColor: 'rgba(148, 211, 210, 1)' }}>
                                            <span class="icon is-small">
                                                <i class="fal fa-undo"></i>
                                            </span>
                                        </a>

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