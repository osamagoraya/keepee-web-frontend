import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import './Invoice.css';
import iconRotate from '../../Assets/Images/Path_981.svg';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import { Formik } from 'formik'
import * as Yup from 'yup'
import Select from '../Common/Select';
import TextField from '../Common/TextField';
import Button from '../Common/Button';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import Auth from '../../Services/Auth';

const BASE_URL = "https://keepee-images.s3.us-west-2.amazonaws.com/";

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
    { label: 'אופנוע/קטנוע 950007', value: 100, vat: 100, type: 'אופנוע/קטנוע 950007', }
]

class Invoice extends Component {
    
  constructor(props){
    super(props);
    this.state = {
      selectedImageID: this.props.match.params.imageId,
      selectedImageStamp: this.props.match.params.imageStamp,
      selectedImageFileType: this.props.match.params.imageType,
      imageAngle: 90,
      selectedUserId: this.props.selectedUserId,
      loggedInUser: Auth.getLoggedInUser(),
      asyncInProgress: false
    }
  }
  
  componentWillReceiveProps(nextProps,nextContext) {
    const oldImageId = this.state.selectedImageID;
    const { imageId, imageType, imageStamp } = nextProps.match.params;
    if( oldImageId !== imageId ){
      this.setState({ 
        selectedImageID: imageId, 
        selectedImageFileType: imageType, 
        selectedImageStamp: imageStamp,
        selectedUserId: nextProps.selectedUserId
      });
    } else if (nextProps.selectedUserId){
      this.setState({
        selectedUserId: nextProps.selectedUserId
      });
    }

  }

  transformImage = () => {
    let angle = this.state.imageAngle
    angle = parseInt(angle) + 90
    this.setState({ imageAngle: angle })
  }
  
  uploadInvoice = (values) => {
    const {selectedUserId,loggedInUser} = this.state
    if (!selectedUserId){
      alert ("No client id present, please select a client first");
      return;
    }
    values.userId = selectedUserId;
    values.accountantId = loggedInUser.userId;
    this.setState({asyncInProgress: true});
    sendAuthenticatedAsyncRequest(
      "/saveImageData",
      "POST", 
      {values: values},
      (r) => {
        this.setState({asyncInProgress: false}); 
        this.props.history.push("/workspace/invoice");
      }
    );
  }

  formSubmitter = null;

  bindFormSubmitter(submitter) {
    this.formSubmitter = submitter ;
  }
  
  render(){
      
    const { selectedImageID , selectedImageFileType, selectedImageStamp, asyncInProgress} = this.state;
    const selectedImagePath = BASE_URL + selectedImageStamp;
    const validationSchema = Yup.object().shape({
      reference_1: Yup.string().required("נדרש"),
      reference_2: Yup.string().required("נדרש"),
      jeDate: Yup.date().required("נדרש"),
      details: Yup.string().required("נדרש"),
      // categoryId: Yup.string().required("נדרש"),
      vendorName: Yup.string().required("נדרש"),
      sum: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
      vat: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
      imageId: Yup.string().required("נדרש")
    })

    const commonTextfieldClasses = "bottom-spacer";

    return (
      <Grid container className="canvas-container">
        <Grid item container sm={2} direction="column" justify="flex-end" alignItems="center">
          <Button className="bottom-btn-container" variant="blue" onClick={(e) => this.formSubmitter(e)}>
            {asyncInProgress ? "submitting ...": "continue"}
          </Button>
        </Grid>
        <Grid item container sm={10} style={{paddingTop:"8%"}}>
          <Grid item container sm={4} direction="column" alignItems="center" >
            <Formik
              initialValues={{ 
                reference_1: '', reference_2: '', jeDate: '', details: '', categoryId: '', 
                vat: '', sum: '', imageId: selectedImageID || '', vendorName: '' 
              }}    
              onSubmit={(values,  { setSubmitting }) => {
              // this.setState({ buttonLoading: 'is-loading' })
                console.log("onSubmit called");
                this.uploadInvoice(values)
                setSubmitting(false);
              }}
              enableReinitialize={true}
              validationSchema={validationSchema} 
              >
              {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, submitForm }) => {
                this.bindFormSubmitter(submitForm);
                return (
                  <form onSubmit={handleSubmit} style={{width: "75%"}}>
                    {this.state.visible ? <div class={`notification ${this.state.alertType}`}>{this.state.alertMessage}</div> : null}
                    <div> 
                      <input
                        name="imageId"
                        type="hidden"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={selectedImageID || ''}
                        variant="filled"
                      />
                    </div>
                    <div> 
                      <TextField
                        type="date"
                        placeholder="Date"
                        name="jeDate"
                        value={values.jeDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth={true}
                        containerClasses={commonTextfieldClasses}
                        feedback={touched.jeDate && errors.jeDate ? errors.jeDate : null}
                        />
                    </div>
                    <div>
                      <Select
                        value={values.category}
                        onChange={(selectedOption) => {
                            setFieldValue('categoryId', selectedOption)
                            setFieldValue('vat', selectedOption.vat)
                        }}
                        options={categories}
                        labelKey="label"
                        valueKey="type"
                        placeholder="Category"
                        onBlur={handleBlur}
                        containerClasses="bottom-spacer"
                        feedback={touched.categoryId && errors.categoryId ? errors.categoryId : null}
                      />
                    </div>
                    <div>
                      <TextField
                        type="number"
                        placeholder="Sum"
                        name="sum"
                        value={values.sum}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth={true} 
                        containerClasses={commonTextfieldClasses}
                        feedback={touched.sum && errors.sum ? errors.sum : null}
                        />
                    </div>
                    <div>
                      <TextField
                        type="text"
                        placeholder="Vendor"
                        name="vendorName"
                        value={values.vendorName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth={true} 
                        containerClasses={commonTextfieldClasses}
                        feedback={touched.vendorName && errors.vendorName ? errors.vendorName : null}
                        />
                    </div>
                    <div>
                      <TextField
                        type="text"
                        placeholder="Details"
                        name="details"
                        value={values.details}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth={true} 
                        containerClasses={commonTextfieldClasses}
                        feedback={touched.details && errors.details ? errors.details : null}
                        />
                    </div>
                    <div>
                      <TextField
                        type="text"
                        placeholder="Reference One"
                        name="reference_1"
                        value={values.reference_1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth={true} 
                        containerClasses={commonTextfieldClasses}
                        // feedback={touched.reference_1 && errors.reference_1 ? errors.reference_1 : null}
                        />
                    </div>
                    <div>
                      <TextField
                        type="text"
                        placeholder="Reference Two"
                        name="reference_2"
                        value={values.reference_2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth={true} 
                        containerClasses={commonTextfieldClasses}
                        // feedback={touched.reference_2 && errors.reference_2 ? errors.reference_2 : null}
                        />
                    </div>
                    <div>
                      <TextField
                        type="text"
                        placeholder="VAT"
                        name="vat"
                        value={values.vat}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth={true} 
                        containerClasses={commonTextfieldClasses}
                        feedback={touched.vat && errors.vat ? errors.vat : null}
                        />
                    </div>
                  </form>
                )
              }}
            </Formik>
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid item container sm={7} >
            <Card className="document-box">
              <CardActionArea style={{ height: '100%'}}>
              { selectedImageID && selectedImageFileType === "image" 
              ? <CardMedia style={{ transform: `rotate(${this.state.imageAngle}deg)`}}
                    component="img"
                    alt="Unable to load"
                    height="inherit"
                    image={selectedImagePath}
                />
              : selectedImageID && selectedImageFileType === "pdf" 
                ? <embed src={selectedImagePath} type="application/pdf" height="100%" width="100%"  /> 
                : <div>בחר תמונה</div>
              }
              {/* force re render pdf when component received new props*/}
              </CardActionArea>
            </Card>
            <div className="doc-action-btn-box">
              <Button size="small" variant="grey" className="doc-action-btns">
                Not Relevant
              </Button>  
              <Button size="small" variant="grey" className="doc-action-btns">
                New picture
              </Button>  
              <Button fab onClick={this.transformImage} className="k-fab">
                <img src={iconRotate} alt="Not Found"/>
              </Button>
            </div>
          </Grid>
        </Grid>
        {/* <Grid item sm={6}>
        </Grid> */}
      </Grid>
    );
  }
}

// export default Invoice;
class MyForm extends React.Component {
  render() {
      const { bindSubmitForm } = this.props;
      return (
          <Formik
              initialValues={{ a: '' }}
              onSubmit={(values, { setSubmitting }) => {
                  console.log({ values });
                  setSubmitting(false);
              }}
          >
              {(formikProps) => {
                  const { values, handleChange, handleBlur, handleSubmit } = formikProps;

                  // bind the submission handler remotely
                  bindSubmitForm(formikProps.submitForm);

                  return (
                      <form noValidate onSubmit={handleSubmit}>
                          <input type="text" name="a" value={values.a} onChange={handleChange} onBlur={handleBlur} />
                      </form>
                  )
              }}
          </Formik>
      )
  }
}

class MyApp extends React.Component {

  // will hold access to formikProps.submitForm, to trigger form submission outside of the form
  submitMyForm = null;

  handleSubmitMyForm = (e) => {
      if (this.submitMyForm) {
          this.submitMyForm(e);
      }
  };
  bindSubmitForm = (submitForm) => {
      this.submitMyForm = submitForm;
  };
  render() {
      return (
          <div>
              <button onClick={this.handleSubmitMyForm}>Submit from outside</button>
              <MyForm bindSubmitForm={this.bindSubmitForm} />
          </div>
      )
  }
}

export default Invoice;