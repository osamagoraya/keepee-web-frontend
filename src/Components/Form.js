import React, { Component } from 'react';
import './Form.css';
import 'bulma/css/bulma.css'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select';
import PDFViewer from './PDFViewer'
import Modal from 'react-awesome-modal';

const categories = [
    { label: 'מע"מ עסקאות 100-', value: 0.1, vat: 0, type: 'מע"מ עסקאות 100-', },
    { label: 'מע"מ תשומות 101-', value: 0, vat: 0, type: 'מע"מ תשומות 101-', },
    { label: 'מע"מ תשומות ציוד 102-', value: 0, vat: 0, type: 'מע"מ תשומות ציוד 102-', },
    { label: 'ניכוי במקור מקוחות 103-', value: 0, vat: 0, type: 'ניכוי במקור מקוחות 103-', },
    { label: 'ניכוי במקור לספקים 104-', value: 0, vat:0, type: 'ניכוי במקור לספקים 104-', },
    { label: 'מכירות 101001', value: 100, vat: 100, type: 'מכירות 101001' },
    { label: 'הכנסות ממתן שירותים 101002', value: 100, vat: 100, type: 'הכנסות ממתן שירותים 101002', },
    { label: 'מכירות פטורות 102001', value: 0, vat: 0, type: 'מכירות פטורות 102001', },
    { label: 'הכנסות פטורות ממתן שירותים 102002', value: 0, vat: 0, type: 'הכנסות פטורות ממתן שירותים 102002', },
    { label: 'הכנסות ממכירת רכוש קבוע 103001', value: 100, vat: 100, type: 'הכנסות ממכירת רכוש קבוע 103001', },
    { label: 'הכנסות חשבונית עצמית 104001', value: 100, vat: 100, type: 'הכנסות חשבונית עצמית 104001' },
    { label: 'הוצאות חשבונית עצמית 104002', value: 100, vat: 100, type: 'הוצאות חשבונית עצמית 104002', },
    { label: 'קניות 201001', value: 100, vat: 100, type: 'קניות 201001', },
    { label: 'קניות אחרות 201002', value: 100, vat: 100, type: 'קניות אחרות 201002', },
    { label: 'עבודות מקצועיות וקבלני משנה 201003', value: 100, vat: 100, type: 'עבודות מקצועיות וקבלני משנה 201003', },
    { label: 'קניות פטורות 202001', value: 0, vat: 0, type: 'קניות פטורות 202001', },
    { label: 'שכירות 301001', value: 100, vat: 100, type: 'שכירות 301001', },
    { label: 'טלפון 301002', value: 100, vat: 100, type: 'טלפון 301002', },
    { label: 'חשמל 301003', value: 100, vat: 100, type: 'חשמל 301003', },
    { label: 'ארנונה 301004', value: 100, vat: 100, type: 'ארנונה 301004', },
    { label: 'פרסום 301005', value: 100, vat: 100, type: 'פרסום 301005', },
    { label: 'הדפסות 301006', value: 100, vat: 100, type: 'הדפסות 301006', },
    { label: 'משרדיות 301007', value: 100, vat: 100, type: 'משרדיות 301007', },
    { label: 'כיבודים 301008', value: 80, vat: 80, type: 'כיבודים 301008', },
    { label: 'אחזקה 301009', value: 100, vat: 100, type: 'אחזקה 301009', },
    { label: 'רכב משתנות 301010', value: 66.66, vat: 66.66, type: 'רכב משתנות 301010', },
    { label: 'רכב קבועות 301011', value: 0, vat: 0, type: 'רכב קבועות 301011', },
    { label: 'שליחויות 301012', value: 100, vat: 100, type: 'שליחויות 301012', },
    { label: 'הנהלת חשבונות וביקורת 301013', value: 100, vat: 100, type: 'הנהלת חשבונות וביקורת 301013', },
    { label: 'משפטיות 301014', value: 100, vat: 100, type: 'משפטיות 301014', },
    { label: 'אחזקת פלאפון 301015', value: 66.66, vat: 66.66, type: 'אחזקת פלאפון 301015', },
    { label: 'אינטרנט 301016', value: 100, vat: 100, type: 'אינטרנט 301016', },
    { label: 'נסיעות 301017', value: 100, vat: 100, type: 'נסיעות 301017', },
    { label: 'סגירת יתרה קטנה 301018', value: 0, vat: 0, type: 'סגירת יתרה קטנה 301018', },
    { label: 'תרומות 301019', value: 0, vat: 0, type: 'תרומות 301019', },
    { label: 'בגדי עבודה 301020', value: 100, vat: 100, type: 'בגדי עבודה 3010020', } ,
    { label: 'הובלות 301021', value: 100, vat: 100, type: 'הובלות 301021', },
    { label: 'מים 301022', value: 100, vat: 100, type: 'מים 301022', },
    { label: 'ביטוחים 301023', value: 100, vat: 100, type: 'ביטוחים 301023', },
    { label: 'ייעוץ עסקי 301024', value: 100, vat: 100, type: 'ייעוץ עסקי 301024', },
    { label: 'כביסה 301025', value: 100, vat: 100, type: 'כביסה 301025', },
    { label: 'חניה 301026', value: 100, vat: 100, type: 'חניה 301026', },
    { label: 'שכירות רכב 301027', value: 0, vat: 0, type: 'שכירות רכב 301027', },
    { label: 'השתלמויות 301028', value: 100, vat: 100, type: 'השתלמויות 301028', },
    { label: 'כשרות והשגחה 301029', value: 100, vat: 100, type: 'כשרות והשגחה 301029', },
    { label: 'דמי ניהול  301030', value: 100, vat: 100, type: 'דמי ניהול  301030', },
    { label: 'קנסות ממוסדות ממשלה 301031', value: 0, vat: 0, type: 'קנסות ממוסדות ממשלה 301031', },
    { label: 'גז 301032', value: 100, vat: 100, type: 'גז 301032', },
    { label: 'מתנות ללקוחות וספקים 301033', value: 100, vat: 100, type: 'מתנות ללקוחות וספקים 301033', },
    { label: 'נסיעות לחו"ל 301034', value: 0, vat: 0, type: 'נסיעות לחו"ל 301034', },
    { label: 'קטנוע קבועות 301035', value: 0, vat: 0, type: 'קטנוע קבועות 301035', },
    { label: 'קטנוע משתנות 301036', value: 100, vat: 100, type: 'קטנוע משתנות 301036', },
    { label: 'מתנות לעובדים 301037', value: 100, vat: 100, type: 'מתנות לעובדים 301037', },
    { label: 'אירוח תושב חו"ל 301038', value: 100, vat: 100, type: 'אירוח תושב חו"ל 301038', },
    { label: 'ריבית ועמלות בנקים 350001', value: 0, vat: 0, type: 'ריבית ועמלות בנקים 350001', },
    { label: 'עמלות כרטיסי אשראי 350002', value: 0, vat: 0, type: 'עמלות כרטיסי אשראי 350002', },
    { label: 'שכר עבודה 360001', value: 0, vat: 0, type: 'שכר עבודה 360001', },
    { label: 'ביטוח לאומי שכ"ע 360002', value: 0, vat: 0, type: 'ביטוח לאומי שכ"ע 360002', },
    { label: 'פנסיה שכ"ע 360003', value: 0, vat: 0, type: 'פנסיה שכ"ע 360003', },
    { label: 'שי לחג גולם בשכ"ע 360004', value: 0, vat: 0, type: 'שי לחג גולם בשכ"ע 360004', },
    { label: 'שכר עבודה -מנהלים 360006', value: 0, vat: 0, type: 'שכר עבודה -מנהלים 360006', },
    { label: 'ביטוח לאומי שכ"ע -מנהלים 360007', value: 0, vat: 0, type: 'ביטוח לאומי שכ"ע -מנהלים 360007', },
    { label: 'פנסיה שכ"ע - מנהלים 360008', value: 0, vat: 0, type: 'פנסיה שכ"ע - מנהלים 360008', },
    { label: 'מקדמות ביטוח לאומי 950001', value: 0, vat: 0, type: 'מקדמות ביטוח לאומי 950001', },
    { label: 'מקדמות מס ההכנסה 950002', value: 0, vat: 0, type: 'מקדמות מס ההכנסה 950002', },
    { label: 'ריהוט וציוד 950003', value: 100, vat: 100, type: 'ריהוט וציוד 950003', },
    { label: 'שיפורים במושכר 950004', value: 100, vat: 100, type: 'שיפורים במושכר 950004', },
    { label: 'רכוש אחר 950005', value: 100, vat: 100, type: 'רכוש אחר 950005', },
    { label: 'כלי רכב 950006', value: 0, vat: 0, type: 'כלי רכב 950006', },
    { label: 'אופנוע/קטנוע 950007', value: 100, vat: 100, type: 'אופנוע/קטנוע 950007', },
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
            customPercentage: false,
            modalVisible: false
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

    openModal = () => {
        this.setState({
            modalVisible : true
        });
    }

    closeModal = () => {
        this.setState({
            modalVisible : false
        });
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
            <div className="box content-overflow-form" style={{ direction: 'rtl' }}>
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
                                            {   (this.props.imageID && this.props.fileType == "image") ?
                                                    <img
                                                        className="image"
                                                        style={{ transform: `rotate(${this.state.imageAngle}deg)` }}
                                                        src={this.props.imageID}
                                                        onClick={this.openModal}
                                                        alt="receipt" /> :
                                                ( this.props.imageID && this.props.fileType == "pdf" ) ?
                                                    <PDFViewer fileUrl={this.props.imageID }/> :
                                                    <div>בחר תמונה</div>
                                            }
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


                                        <button onClick={this.retakePicture} type="button" className={`button receipt-button receipt-button-right ${this.state.retakeButtonLoading}`}>לצילום מחדש</button>


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
                <Modal
                    visible={this.state.modalVisible}
                    effect="fadeInDown"
                    width="800"
                    onClickAway={() => this.closeModal()}
                >
                    <div style={{ direction: 'ltr', overflowX: 'auto', position: 'relative'}}>
                        <img className="image" src={this.props.imageID} />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Form;