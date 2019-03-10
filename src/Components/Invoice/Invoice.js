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
      asyncInProgress: false,
      categories: []
    }
  }

  componentDidMount() {
    this.fetchCategories();
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

  transformImage = () => {
    let angle = this.state.imageAngle
    angle = parseInt(angle) + 90
    this.setState({ imageAngle: angle })
  }

  // To enable form submitting from outside form tag. Can't put this in state. Causes too many renders and depth exceeds
  formSubmitter = null;
  bindFormSubmitter(submitter) {
    this.formSubmitter = submitter ;
  }
  
  render(){
      
    const { selectedImageID , selectedImageFileType, selectedImageStamp, asyncInProgress, categories} = this.state;
    console.log(categories);
    const selectedImagePath = BASE_URL + selectedImageStamp;
    const validationSchema = Yup.object().shape({
      reference_1: Yup.string().required("נדרש"),
      reference_2: Yup.string().required("נדרש"),
      jeDate: Yup.date().required("נדרש"),
      details: Yup.string().required("נדרש"),
      categoryId: Yup.string().required("נדרש"),
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
                            setFieldValue('categoryId', selectedOption.categoryId)
                            setFieldValue('vat', selectedOption.vatpercent)
                        }}
                        options={categories}
                        labelKey="categoryLabel"
                        valueKey="categoryId"
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

export default Invoice;