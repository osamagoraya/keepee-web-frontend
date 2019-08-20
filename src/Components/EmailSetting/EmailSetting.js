import React from 'react';

import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik'


import Select from '../Common/Select';
import TextField from '../Common/TextField';
import Button from '../Common/Button';
import Caption from '../Common/Caption';
import './EmailSetting.css';
import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import swal from 'sweetalert';

class EmailSetting extends React.Component {

  state = {
    selectedProfileId: this.props.match.params.profileId,
    profile: null,
    apiCallInProgress: false,
    apiCallType: 'fetch',
  }

  componentDidMount() {
    this.fetchProfileDetails(this.state.selectedProfileId);
  }

  componentWillReceiveProps(nextProps){
    const {profileId} = nextProps.match.params;
    if (profileId !== this.state.profile) {
      this.setState({selectedProfileId : profileId, profile: this.fetchProfileDetails(profileId)});
    }
  }

  fetchProfileDetails = (profileId) => {
    if (!profileId) {
      console.log("No user id found to fetch details for", profileId,);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getUser",
      "POST", 
      {userId: profileId},
      (r) => {
        console.log("response received business profile", r);
        this.setState({profile: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none', profile: null});
      }
    );
  }

  updateUser (values) {
    values.userId = this.state.selectedProfileId;
    sendAuthenticatedAsyncRequest(
      "/updateUser",
      "POST", 
      values,
      (r) => {
        console.log("response received from update business profile", r);
        swal("Success", "Client Updated Successfully!","success");
        this.setState({profile: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
        this.props.history.push("/profile/business/"+this.state.selectedProfileId);
      },
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none', profile: null});
      }
    );
  }


  render () {
    const {apiCallInProgress, profile, selectedProfileId} = this.state;

    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedProfileId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    } else if (!profile){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Could not fetch profile data </Caption>);
    }
    
    console.log(profile);

    const commonTextfieldClasses = "little-bottom-spacer";
    return (
      <Grid container className="canvas-container bp-container" alignContent="flex-start" >
        <Grid item md={12} className="bp-title strong-font">
          Email Monitor
        </Grid>
        <Grid item md={12}>
        <Formik
          initialValues={{ 
            businessDomain: profile.businessDomain, represantationOfVatIncomeReports: profile.represantationOfVatIncomeReports, socialInsurance: profile.socialInsurance, assessingOfficerNumber: profile.assessingOfficerNumber, incomeTaxAdvances: profile.incomeTaxAdvacnes, reportingFrequency: profile.reportingFrequency, 
            withHoldingFile: profile.withHoldingFile, foundationYear: profile.foundationYear, assessbusinessDomainingOfficerNumber: profile.assessbusinessDomainingOfficerNumber, type: profile.type, name: profile.name, nId: profile.nId, birthDate: profile.birthDate,
            email: profile.email, address: profile.address, vendorName: profile.vendorName, supervisedBy: 'Supervisor', vatReportStart: profile.vatReportStart, license : profile.license
          }}    
          onSubmit={(values,  { setSubmitting }) => {
            this.updateUser(values)
            setSubmitting(false);
          }}
          enableReinitialize={true}
          // validationSchema={validationSchema} 
          >
          {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, submitForm }) => {
            const formFields = [
                {
                  columnLabel: "User Details",
                  fields: [
                    {type: "select", name: "license", value: values.license, label: "License", options: [{label: "Exempted", value: 2},{label: "Licensed", value: 1}],  placeholder: "License State" },
                    {type: "select", name: "accountInquires", value: values.accountInquires, label: "Account Inquries", options: [{label: "Monthly", value: 1},{label: "Bi-Monthly", value: 2}],  placeholder: "Monthly" },
                    {type: "select", name: "vatReport", value: values.vatReport, label: "Vat report", options: [{label: "Monthly", value: 1},{label: "Bi-Monthly", value: 2}],  placeholder: "Monthly" },
                    {type: "select", name: "incomeTaxAdvances", value: values.incomeTaxAdvances, label: "Income tax advances", options: [{label: "Monthly", value: 1},{label: "Bi-Monthly", value: 2}],  placeholder: "Monthly" },
                    {type: "select", name: "profitAndLoss", value: values.profitAndLoss, label: "P & L", options: [{label: "Monthly", value: 1},{label: "Bi-Monthly", value: 2}],  placeholder: "Monthly" },
                    {type: "select", name: "trialBalance", value: values.trialBalance, label: "Trial Balance", options: [{label: "Monthly", value: 1},{label: "Bi-Monthly", value: 2}],  placeholder: "Monthly" },
                  ]
                }
              ]
              return (
              <form onSubmit={handleSubmit} style={this.props.formStyle}>
                <Grid container justify="flex-end"> 
                {
                  formFields.map((column, cidx) => (
                    <Grid item md={4} key={cidx} className="fields-column">
                      <div className="light-font">{column.columnLabel}</div>
                      {
                        column.fields.map((field, idx) => 
                        <div key={idx}> 
                          <span className="bp-label">{field.label}</span>
                          {
                            field.type === "select" 
                            ? <Select
                                placeholder={field.placeholder}
                                name={field.name}
                                options={field.options}
                                value={(field.options ? field.options.find(option => option.value === field.value) : '')}
                                onChange={option => setFieldValue(field.name, option.value)}
                                onBlur={handleBlur}
                                containerClasses={commonTextfieldClasses}
                                feedback={touched[field.name] && errors[field.name] ? errors[field.name] : null}
                                EmailSetting={true}
                              />
                            : <TextField
                                type={field.type}
                                name={field.name}
                                value={field.value == "null" ? '' :  field.value}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth={true}
                                containerClasses={commonTextfieldClasses}
                                feedback={touched[field.name] && errors[field.name] ? errors[field.name] : null}
                              />
                          }
                          
                        </div>
                        )
                      }
                      {
                        cidx === 0
                        ? <div className="submit-bp-btn-container">
                            <Button type="submit" variant="blue" className="submit-bp-btn"> Update</Button>
                          </div>
                        : null
                      }
                    </Grid>
                  ))
                }
                </Grid>
              </form>
            )
          }}
        </Formik>
        </Grid>
      </Grid>
    );
  }
}

export default EmailSetting;