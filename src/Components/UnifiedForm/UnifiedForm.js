import React from 'react';


import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik'

import * as Yup from 'yup'
import Select from '../Common/Select';
import TextField from '../Common/TextField';
import Button from '../Common/Button';
import Caption from '../Common/Caption';
import './UnifiedForm.css';
import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import JSZip from "jszip"
import moment from 'moment';

class UnifiedForm extends React.Component {

  state = {

    apiCallInProgress: false,
    apiCallType: 'fetch',
  }

  componentDidMount() {
    this.getUsers();
  }

  
  getUsers = () => {
    sendAuthenticatedAsyncRequest(
      "/getAllUsers",
      "POST", 
      {},
      (r) => this.setState({ userList: this.filterUsersForSelect(JSON.parse(r.data.body)), isLoadingUsers: false})
    );
  }

  filterUsersForSelect (list) {
    console.log("list",list);
    if(!list)
      return;

    return list.map(userRow => {
      return {
        value: parseInt(userRow.userId,10),
        label: userRow.name,
        userNID: userRow.nid ,
        userEmail: userRow.email,
        incomeTaxReportFrequency: userRow.incomeTaxReportFrequency,
        vatReportFrequency : userRow.vatReportFrequency,
        license: userRow.license,
        incomeTaxAdvances: userRow.incomeTaxAdvances
      }
    });

  }

  getUnifiedFile = (values) => {
      sendAuthenticatedAsyncRequest(
        "/getUnifiedFiles",
        "POST", 
        { userId: values.clientId, startDate: values.unifiedStartDate, endDate: values.unifiedEndDate},
        (r) => {
           // download the zip file
        }
      );
  }

  render () {
    const {apiCallInProgress, client, selectedClientId} = this.state;

    const commonTextfieldClasses = "little-bottom-spacer";
    const validationSchema = Yup.object().shape({
      unifiedStartDate: Yup.date().required("נדרש"),
      unifiedEndDate: Yup.date().required("נדרש")
    })


    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    }
    return (
      <Grid container className="canvas-container bp-container" alignContent="flex-start" justify="flex-end">
         <Formik
          initialValues={{ 
            unifiedStartDate: moment().startOf('year').format('YYYY-MM-DD'), unifiedEndDate : moment().format('YYYY-MM-DD')
          }}    
          onSubmit={async(values,  { setSubmitting }) => {
            this.getUnifiedFile(values);
            setSubmitting(false);
          }}
          enableReinitialize={true}
          validationSchema={validationSchema} 
          >
          {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, submitForm }) => {
            const formFields = [
                {
                  columnLabel: "Report Filters",
                  fields: [
                    {type: "select", name: "clientId", value: values.selectedClientId, label: "Business Name", options: this.state.userList, placeholder: "Select the client" },
                    {type: "date", name: "unifiedStartDate", value: values.unifiedStartDate, label: "Start Date"},
                    {type: "date", name: "unifiedEndDate", value: values.unifiedEndDate, label: "End Date"},
                  ]
                }
              ]
              return (
              <form onSubmit={handleSubmit} style={this.props.formStyle}>
                <Grid container justify="flex-end"> 
                {
                  formFields.map((column, cidx) => (
                    <Grid item md={12} key={cidx} className="fields-column">
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
                              EmailSetting={false} 
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
                            <Button type="submit" variant="blue" className="submit-bp-btn">Click to generate Unified Form Files</Button>
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
    );
  }
}

export default UnifiedForm;