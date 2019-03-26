import React, { Component } from 'react';
import './InvoiceForm.css';

import { Formik } from 'formik'
import * as Yup from 'yup'
import Select from '../../Common/Select';
import TextField from '../../Common/TextField';

import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

class InvoiceForm extends Component {
    
  constructor(props){
    super(props);
    this.state = {
      selectedImageID: this.props.imageId,
      selectedUserId: this.props.selectedUserId,
      loggedInUser: this.props.loggedInUser,
      categories: []
    }
  }

  componentDidMount() {
    this.fetchCategories();
  }
  
  componentWillReceiveProps(nextProps,nextContext) { 
  if (nextProps.imageId !== this.state.selectedImageID){
      this.setState({
        selectedImageID: nextProps.imageId,
        selectedUserId: nextProps.selectedUserId,
        loggedInUser: nextProps.loggedInUser
      });
    }
  }

  fetchCategories() {
    if (this.state.categories.length !== 0){
      console.log("not fetching categories, they exist", this.state.categories);
      return;
    }

    sendAuthenticatedAsyncRequest(
      "/getCategories",
      "POST", 
      null,
      (r) => this.setState({categories: JSON.parse(r.data.body)})
    );

  }
  
  uploadInvoice = (values) => {
    const {selectedUserId,loggedInUser} = this.state;
    if (this.props.isUserIdRequired && !selectedUserId){
      alert ("No client id present, please select a client first");
      return;
    }
    values.userId = selectedUserId ? selectedUserId : 0;
    values.accountantId = loggedInUser.userId;
    
    sendAuthenticatedAsyncRequest(
      "/saveInvoiceData",
      "POST", 
      {values: values},
      (r) => {
        this.props.onSubmit();
      }
    );
  }

  // To enable form submitting from outside form tag. Can't put this in state. Causes too many renders and depth exceeds
  // formSubmitter = null;
  // bindFormSubmitter(submitter) {
  //   this.formSubmitter = submitter ;
  // }
  
  render(){
    const {bindSubmitForm, onValidationFailed} = this.props;
    const { categories, selectedImageID} = this.state;

    const validationSchema = Yup.object().shape({
      reference_1: Yup.string().required("נדרש"),
      reference_2: Yup.string(),
      jeDate: Yup.date().required("נדרש"),
      details: Yup.string().required("נדרש"),
      categoryId: Yup.string().required("נדרש"),
      vendorName: Yup.string().required("נדרש"),
      sum: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
      vat: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
    })

    const commonTextfieldClasses = "bottom-spacer";

    return (
      <Formik
        initialValues={{ 
          reference_1: '', reference_2: '', jeDate: '', details: '', categoryId: '', 
          vat: '', sum: '', imageId: selectedImageID || '', vendorName: '' 
        }}    
        onSubmit={(values,  { setSubmitting }) => {
          this.uploadInvoice(values)
          setSubmitting(false);
        }}
        enableReinitialize={true}
        validationSchema={validationSchema} 
        >
        {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, submitForm }) => {
          bindSubmitForm(submitForm);
          // validation has failed, let the caller know
          if (Object.keys(errors).length !== 0){
            onValidationFailed();
          }
          return (
            <form onSubmit={handleSubmit} style={this.props.formStyle}>
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
                      setFieldValue('categoryId', selectedOption.categoryId)
                      setFieldValue('vat', selectedOption.vatpercent)
                  }}
                  options={categories}
                  labelKey="categoryLabel"
                  valueKey="categoryId"
                  placeholder="Category"
                  onBlur={handleBlur}
                  containerClasses={commonTextfieldClasses}
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
                  feedback={touched.reference_1 && errors.reference_1 ? errors.reference_1 : null}
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
                  feedback={touched.reference_2 && errors.reference_2 ? errors.reference_2 : null}
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
    );
  }
}

export default InvoiceForm;