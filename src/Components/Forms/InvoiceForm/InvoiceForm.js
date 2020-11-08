import React, { Component } from 'react';
import './InvoiceForm.css';

import { Formik } from 'formik'
import * as Yup from 'yup'
import Select from '../../Common/Select';
import TextField from '../../Common/TextField';
import {sendAsyncRequestToOCR} from '../../../Services/AsyncRequestService';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';
import swal from 'sweetalert';
import {withRouter} from 'react-router-dom';
import InvoiceDocumentModal from './drawPop';
import Button from '../../Common/Button';

import SwalAdvance from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Swal2 = withReactContent(SwalAdvance)

class InvoiceForm extends Component {
  selectedVendorName = "";
  constructor(props){
    super(props);
    this.state = {
      showModal: this.props.showModal,
      selectedImageID: this.props.imageId,
      selectedUserId: this.props.selectedUserId,
      loggedInUser: this.props.loggedInUser,
      categories: [],
      vendors: this.props.vendors,
      journalEntryPassed: this.props.isJournalEntryPassed, // EDIT MODE IF TRUE
      journalEntry: this.props.journalEntry,
      vendorSelected : false,
    //  response: this.props.response
    }
  }

  componentDidMount() {
    this.fetchCategories();
  }
  
  componentWillReceiveProps(nextProps,nextContext) { 
  if ( nextProps.imageId !== this.state.selectedImageID || 
       nextProps.journalEntry !== this.state.journalEntry ||
       nextProps.vendors != this.state.vendors
     //  nextProps.response != this.state.response
       ) {
      this.setState({
        selectedImageID: nextProps.imageId,
        selectedUserId: nextProps.selectedUserId,
        loggedInUser: nextProps.loggedInUser,
        journalEntry: nextProps.journalEntry,
        journalEntryPassed: nextProps.isJournalEntryPassed,
        vendors: nextProps.vendors
       // response: nextProps.response
      });
    }
  }

  fetchCategories() {
    if (this.state.categories.length !== 0){
      console.log("not fetching categories, they exist", this.state.categories);
      return;
    }
    if (this.state.selectedUserId === null){
      console.log("User is not selected to fetch categories!", this.state.selectedUserId);
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
        const response = JSON.parse(r.data.body);
        if(response.message === "Journal Entry Already Exists!") {
          var img = "";
          let parts = response.imageLink.split('/');
          const imageKey =  parts[parts.length - 1];
          if(response.imageType == "pdf")
            img = '<img src="'+"https://keepee-images.s3-accelerate.amazonaws.com/"+imageKey+'.jpeg'+'" />';
          else
            img = '<img src="'+"https://keepee-images.s3-accelerate.amazonaws.com/"+imageKey+'" />';

          Swal2.fire({
            width: 700,
            height: 400,
            title: 'Journal Entry Already Exists!',
            html: img,
            showCloseButton: true,
            showConfirmButton: false
          })
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
        console.log("why:",r);
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
  
  showResetButton = () => {
    this.setState({ vendorSelected : true});
  }

  resetVendorCordinates = () => {
    sendAsyncRequestToOCR(
      "/invoice",
      "PUT",
      {
        vendorName: this.selectedVendorName,
      },
      (r) => {
        this.props.updateResponse({ 
          title: this.selectedVendorName,
          date:  null,
          invoice: null,
          payment: null
        });
      },
      (r) => {
        console.log(r);
        console.log("Error!", "Unable to Clear vendor!");
      }
    );
  }

  render(){
    const {bindSubmitForm, onValidationFailed, selectedImageFileType, selectedImagePath, onSubmitCoord, setCoords, setType, response} = this.props;
    const { categories,vendors, selectedImageID} = this.state;

    const titleFunc = () => {
      setType("title");
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
        } : { reference_1: response.invoice ? response.invoice : '', reference_2: '', jeDate: response.date ? response.date: '', details: '', categoryId: '', 
        vat: '', sum: response.payment ? response.payment : '', imageId: selectedImageID || '', vendor: response.title ? { name: response.title, value: response.id} : '', vatAmount: '' }}
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
          return (
            <form onSubmit={handleSubmit} style={this.props.formStyle}>
              {this.state.visible ? <div class={`notification ${this.state.alertType}`}>{this.state.alertMessage}</div> : null}
              <div>
                {
                  this.state.vendorSelected ? 
                  <div className="clearfix d-flex flex-row">
                    <Button size="small" variant="blue" onClick={this.resetVendorCordinates}>
                        Reset
                    </Button>
                  </div>
                  : 
                  ""
                } 
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
                  <Select
                    value={values.vendor}
                    onChange={(selectedOption) => {
                      this.selectedVendorName = selectedOption.name;
                        this.showResetButton();
                        setFieldValue('vendor',selectedOption)
                        sendAsyncRequestToOCR(
                          "/invoice",
                          "POST",
                          {
                            imageKey: this.props.selectedImageKey,
                            vendorName: selectedOption.name,
                            fieldName: "title",
                            renderedWidth:1,
                            renderedHeight: 1
                          },
                          (r) => {
                            if( r.data.date ) {
                              var dateTokens = res.date.includes('/') ? res.date.split('/') : res.date.split('.');
                              const formatedDate = dateTokens[2] + "-" + dateTokens[1] + "-" + dateTokens[0];
                              r.data.date = formatedDate;
                            }
                            this.props.updateResponse(r.data);
                            this.setState({ response: r.data});
                          },
                          (r) => {
                            console.log("Error!","Unable to fetch vendor data");
                          }
                        );

                      
                    }}
                    options={vendors}
                    labelKey="name"
                    valueKey="id"
                    placeholder="Vendor"
                    onBlur={handleBlur}
                    containerClasses={commonTextfieldClasses}
                    feedback={touched.vendorName && errors.vendorName ? errors.vendorName : null}
                  />
                  </div>
                  { 
                    response.title === null && 
                      ( <div className="pull-right mt-2">
                          <a onClick={titleFunc}>
                              <InvoiceDocumentModal
                                documentType={selectedImageFileType}
                                documentPath={selectedImagePath}
                                selectedImageId={selectedImageID}
                                uniqueKey={`invoicepopup${selectedImageID}`}
                                onSubmitCoord={onSubmitCoord}
                                setCoords={setCoords}
                                modalType="ocr"
                              />
                          </a>
                        </div>
                      )
                  }
              </div>
              <div className="clearfix d-flex flex-row"> 
              <div className="width">
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
                  {response.title && response.date === null && ( <div className={response.date ? 'd-none': "pull-right mt-2"}>
                  <a onClick={dateFunc}>
                    <InvoiceDocumentModal 
                      documentType={selectedImageFileType}
                      documentPath={selectedImagePath}
                      selectedImageId={selectedImageID}
                      uniqueKey={`invoicepopup${selectedImageID}`}
                      onSubmitCoord={onSubmitCoord}
                      setCoords={setCoords}
                      modalType="ocr"
                    />
                  </a>
                  </div>)}
              </div>
              <div  className="clearfix d-flex flex-row">
              <div className="width">
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
                  { response.title && response.invoice === null ? 
                    ( 
                      <div className={response.invoice ? 'd-none': "pull-right mt-2"}>
                      <a onClick={invoiceFunc}>
                        <InvoiceDocumentModal 
                          documentType={selectedImageFileType}
                          documentPath={selectedImagePath}
                          selectedImageId={selectedImageID}
                          uniqueKey={`invoicepopup${selectedImageID}`}
                          type={'invoice'}
                          onSubmitCoord={onSubmitCoord}
                          setCoords={setCoords}
                          modalType="ocr"
                        />
                      </a>
                    </div>) : ""
                  }
              </div>
              <div className="clearfix d-flex flex-row">
              <div className="width">
                <TextField
                  placeholder="Sum"
                  name="sum"
                  value={values.sum}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue('vatAmount',Math.round(e.target.value*(1-1/(1+0.17))*(values.vat/100)));
                  }}
                  onBlur={handleBlur}
                  fullWidth={true} 
                  containerClasses={commonTextfieldClasses}
                  feedback={touched.sum && errors.sum ? errors.sum : null}
                  disabled={false}
                  />
                  </div>
                  { response.title && response.payment === null && (<div className={response.payment ? 'd-none': "pull-right mt-2"}>
                  <a onClick={amountFunc}>
                    <InvoiceDocumentModal 
                      documentType={selectedImageFileType}
                      documentPath={selectedImagePath}
                      selectedImageId={selectedImageID}
                      uniqueKey={`invoicepopup${selectedImageID}`}
                      onSubmitCoord={onSubmitCoord}
                      setCoords={setCoords}
                      modalType="ocr"
                    />
                  </a>
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