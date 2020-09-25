import React, { Component } from 'react';
import './InvoiceForm.css';

import { Formik } from 'formik'
import * as Yup from 'yup'
import Select from '../../Common/Select';
import TextField from '../../Common/TextField';

import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';
import swal from 'sweetalert';
import {withRouter} from 'react-router-dom';
import InvoiceDocumentModal from './drawPop';
import moment from 'moment';
import { Button } from 'react-bootstrap';

class InvoiceForm extends Component {
    
  constructor(props){
    super(props);
    this.state = {
      selectedImageID: this.props.imageId,
      selectedUserId: this.props.selectedUserId,
      loggedInUser: this.props.loggedInUser,
      categories: [],
      journalEntryPassed: this.props.isJournalEntryPassed, // EDIT MODE IF TRUE
      journalEntry: this.props.journalEntry
    }
  }

  componentDidMount() {
    console.log("passed JE",this.state.journalEntry)
    this.fetchCategories();
  }
  
  componentWillReceiveProps(nextProps,nextContext) { 
  if (nextProps.imageId !== this.state.selectedImageID || nextProps.journalEntry !== this.state.journalEntry){
      this.setState({
        selectedImageID: nextProps.imageId,
        selectedUserId: nextProps.selectedUserId,
        loggedInUser: nextProps.loggedInUser,
        journalEntry: nextProps.journalEntry,
        journalEntryPassed: nextProps.isJournalEntryPassed
      });
    }
  }

  fetchCategories() {
    if (this.state.categories.length !== 0){
      console.log("not fetching categories, they exist", this.state.categories);
      return;
    }

    sendAuthenticatedAsyncRequest(
      "/getCategoriesWithDetails",
      "POST", 
      { userId : this.state.selectedUserId},
      (r) => this.setState({categories: JSON.parse(r.data.body)})
    );

  }
  
  imageStamp = (imageName) => {
    let parts = imageName.split('/');
    return parts[parts.length - 1];
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
        
        if(r.data.body === '"Journal Entry Already Exists!"') {
          swal ( "Oops" ,  "Journal Entry With this data Already Exists!" ,  "error" );
        }
        else if(r.data.body === '"No More JE!"') {
          swal ( "Done" ,  "Journal Entry Added! No More JE Left" ,  "info" );
          this.props.onSubmit();
        } 
        else {
              this.props.onSubmit();
              var nextImage = JSON.parse(r.data.body);
              var path = `/workspace/invoice/${nextImage.imageId}/${nextImage.imageType}/${this.imageStamp(nextImage.imageLink)}`;
              this.props.history.push(path);
          }
      },
      (r) => {
        swal("Oops", "System Error! Try Again","error");
      }
    );
  }

  updateInvoiceData = (values) => {
    console.log("modal update",values);
    const {selectedUserId,loggedInUser} = this.state;
    if (!selectedUserId){
      alert ("No client id present, please select a client first");
      return;
    }
    values.userId = selectedUserId ? selectedUserId : 0;
    values.accountantId = loggedInUser.userId;
    
    sendAuthenticatedAsyncRequest(
      "/updateOpenJournalEntry",
      "POST", 
      values,
      (r) => {
        console.log("JE updated", r);
        swal ( "Success" ,  "Journal Entry Updated Successfully!" ,  "success" )
        this.props.setApiCallForBatchJEModal();
      },
      (r) => {
        console.log("JE update failed", r);
        swal ( "Success" ,  "Journal Entry Update Failed!" ,  "error" )
      },
    );
  }
  // To enable form submitting from outside form tag. Can't put this in state. Causes too many renders and depth exceeds
  // formSubmitter = null;
  // bindFormSubmitter(submitter) {
  //   this.formSubmitter = submitter ;
  // }

  
  
  render(){
    const {bindSubmitForm, onValidationFailed, selectedImageFileType, selectedImagePath, onSubmitCoord, response, setCoords, setType} = this.props;
    const { categories, selectedImageID} = this.state;

    const titleFunc = () => {
      setType("title");
      console.log('title','titleee');
    };
    const amountFunc = () => {
      setType("payment");
    };
    const invoiceFunc = () => {
      setType("invoice");
    };
    const dateFunc = () => {
      setType("date");
    };



    const validationSchema = Yup.object().shape({
      reference_1: Yup.string().required("נדרש"),
      reference_2: Yup.string(),
      jeDate: Yup.date().required("נדרש"),
      details: Yup.string().required("נדרש"),
      categoryId: Yup.string().required("נדרש"),
      vendorName: Yup.string(),
      sum: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
      vat: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
    })

    const commonTextfieldClasses = "bottom-spacer";
    let { journalEntryPassed, journalEntry} = this.state;

    

    return (
      <Formik
        initialValues={ journalEntryPassed ? { 
          id: journalEntry.id, jeId: journalEntry.jeId, reference_1: journalEntry.reference_1, reference_2: journalEntry.reference_2, jeDate: journalEntry.jeDate, details: journalEntry.details, categoryId: journalEntry.categoryId, 
          vat: journalEntry.vat, sum: journalEntry.sum, vatAmount: Math.round(journalEntry.sum*(1-1/(1+0.17))*(journalEntry.vat/100)), imageId: selectedImageID || '', vendorName: journalEntry.vendorName , category : { categoryLabel: journalEntry.categoryLabel, categoryId: journalEntry.categoryId}
        } : { reference_1: '', reference_2: '', jeDate: '', details: '', categoryId: '', 
        vat: '', sum: '', imageId: selectedImageID || '', vendorName: '', vatAmount: '' }}
        onSubmit={(values,  { setSubmitting }) => {
          journalEntryPassed ? this.updateInvoiceData(values) : this.uploadInvoice(values)
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
          let vatVal = 0;
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
              <div className="clearfix d-flex flex-row">
                <div className="width">
                <TextField
                  type="text"
                  placeholder="Vendor"
                  name="vendorName"
                  value={response.title ? response.title : values.vendorName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth={true} 
                  containerClasses={commonTextfieldClasses}
                  feedback={touched.vendorName && errors.vendorName ? errors.vendorName : null}
                  />
                  </div>
                  { response.title === null && ( <div className="pull-right mt-2">
                  <Button className='pop-button' onClick={titleFunc}><InvoiceDocumentModal
                    documentType={selectedImageFileType}
                    documentPath={selectedImagePath}
                    selectedImageId={selectedImageID}
                    uniqueKey={`invoicepopup${selectedImageID}`}
                    onSubmitCoord={onSubmitCoord}
                    setCoords={setCoords}
                    
                  /></Button>
                  </div>)}
              </div>
              <div className="clearfix d-flex flex-row"> 
              <div className="width">
                <TextField
                  type="date"
                  placeholder="Date"
                  name="jeDate"
                  value={response.date ? moment(response.date).format('YYYY-MM-MM') : values.jeDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth={true}
                  containerClasses={commonTextfieldClasses}
                  feedback={touched.jeDate && errors.jeDate ? errors.jeDate : null}
                  />
                  </div>
                  {response.title && response.date === null && ( <div className={response.date ? 'd-none': "pull-right mt-2"}>
                  <a onClick={dateFunc}><InvoiceDocumentModal 
                    documentType={selectedImageFileType}
                    documentPath={selectedImagePath}
                    selectedImageId={selectedImageID}
                    uniqueKey={`invoicepopup${selectedImageID}`}
                    onSubmitCoord={onSubmitCoord}
                    setCoords={setCoords}
                  /></a>
                  </div>)}
              </div>
              <div  className="clearfix d-flex flex-row">
              <div className="width">
                <TextField
                  type="text"
                  placeholder="Reference One"
                  name="reference_1"
                  value={response.invoice ? response.invoice : values.reference_1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth={true}
                  containerClasses={commonTextfieldClasses}
                  feedback={touched.reference_1 && errors.reference_1 ? errors.reference_1 : null}
                  />
                  </div>
                  { response.title && response.invoice === null && ( <div className={response.invoice ? 'd-none': "pull-right mt-2"}>
                  <a onClick={invoiceFunc}><InvoiceDocumentModal 
                    documentType={selectedImageFileType}
                    documentPath={selectedImagePath}
                    selectedImageId={selectedImageID}
                    uniqueKey={`invoicepopup${selectedImageID}`}
                    type={'invoice'}
                    onSubmitCoord={onSubmitCoord}
                    setCoords={setCoords}
                  /></a>
                  </div>)}
              </div>
              <div className="clearfix d-flex flex-row">
              <div className="width">
                <TextField
                  // type="number"
                  placeholder="Sum"
                  name="sum"
                  value={response.payment ? response.payment : values.sum}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue('vatAmount',Math.round(e.target.value*(1-1/(1+0.17))*(values.vat/100)));
                  }}
                  onBlur={handleBlur}
                  fullWidth={true} 
                  containerClasses={commonTextfieldClasses}
                  feedback={touched.sum && errors.sum ? errors.sum : null}
                  />
                  </div>
                  { response.title && response.payment === null && (<div className={response.payment ? 'd-none': "pull-right mt-2"}>
                  <a onClick={amountFunc}><InvoiceDocumentModal 
                    documentType={selectedImageFileType}
                    documentPath={selectedImagePath}
                    selectedImageId={selectedImageID}
                    uniqueKey={`invoicepopup${selectedImageID}`}
                    onSubmitCoord={onSubmitCoord}
                    setCoords={setCoords}
                  /></a>
                  </div>)}
              </div>
              <div>
                <Select
                  value={values.category}
                  onChange={(selectedOption) => {
                      setFieldValue('category',selectedOption)
                      setFieldValue('categoryId', selectedOption.categoryId)
                      setFieldValue('vat', selectedOption.vatpercent)
                      setFieldValue('vatAmount',Math.round(values.sum*(1-1/(1+0.17))*(selectedOption.vatpercent/100)));
                      setFieldValue('details', selectedOption.lastDetails);
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
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue('vatAmount',Math.round(values.sum*(1-1/(1+0.17))*(e.target.value/100)));
                  }}
                  onBlur={handleBlur}
                  fullWidth={true} 
                  disabled={values.vat > 0 ? false : true}
                  containerClasses={commonTextfieldClasses}
                  feedback={touched.vat && errors.vat ? errors.vat : null}
                  />
              </div>
              <div>
                <TextField
                  type="text"
                  placeholder="VAT Amount"
                  name="vatAmount"
                  value={values.vatAmount}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue('vat',Math.round((e.target.value*100)/(values.sum*(1-1/(1+0.17)))))
                  }}
                  onBlur={handleBlur}
                  fullWidth={true}
                  disabled={values.vat > 0 ? false : true}
                  containerClasses={commonTextfieldClasses}
                  feedback={touched.vatAmount && errors.vatAmount ? errors.vatAmount : null}
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
              

            </form>
          )
        }}
      </Formik>
    );
  }
}

export default withRouter(InvoiceForm);