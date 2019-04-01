import React from 'react';

import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik'
import * as Yup from 'yup'


import Select from '../Common/Select';
import TextField from '../Common/TextField';
import './BusinessProfile.css';

class BusinessProfile extends React.Component {

  editUser (values) {
    alert("user updated");
  }

  render () {
    const commonTextfieldClasses = "little-bottom-spacer";
    return (
      <Grid container className="canvas-container bp-container" alignContent="flex-start" >
        <Grid item md={12} className="bp-title strong-font">
          Personal Details
        </Grid>
        <Grid item md={12}>
        <Formik
          initialValues={{ 
            represantationOfVatIncomeReports: '', socialInsurance: '', assessingOfficerNumber: '', incomeTaxAdvances: '', reportingFrequency: '', 
            withholdingFile: '', foundationYear: '', assessbusinessDomainingOfficerNumber: '', type: '', name: '', nId: '', birthDate: '',
            email: '', address: '', vendorName: '', supervisedBy: 'Supervisor'
          }}    
          onSubmit={(values,  { setSubmitting }) => {
            this.editUser(values)
            setSubmitting(false);
          }}
          enableReinitialize={true}
          // validationSchema={validationSchema} 
          >
          {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, submitForm }) => {
            const formFields = [
                {
                  columnLabel: "Report Factors",
                  fields: [
                    {type: "text", name: "represantationOfVatIncomeReports", value: values.represantationOfVatIncomeReports, label: "Representation of VAT and Income TAX"},
                    {type: "text", name: "socialInsurance", value: values.socialInsurance, label: "Representation of Social Insurance"},
                    {type: "text", name: "assessingOfficerNumber", value: values.assessingOfficerNumber, label: "Assessing Officer Number"},
                    {type: "text", name: "incomeTaxAdvances", value: values.incomeTaxAdvances, label: "Income Tax Advances"},
                    {type: "text", name: "reportingFrequency", value: values.reportingFrequency, label: "Reporting Frequency"},
                    {type: "text", name: "withholdingFile", value: values.withholdingFile, label: "Withholding File"},
                    {type: "text", name: "foundationYear", value: values.foundationYear, label: "Foundation Year"},
                  ]
                },{
                  columnLabel: "Business Details",
                  fields: [
                    {type: "text", name: "businessDomain", value: values.businessDomain, label: "Business Domain"},
                    {type: "text", name: "type", value: values.type, label: "Employee/ Employer"},
                  ]
                },{
                  columnLabel: "User Details",
                  fields: [
                    {type: "text", name: "name", value: values.name, label: "Full Name"},
                    {type: "text", name: "nId", value: values.nId, label: "ID"},
                    {type: "date", name: "birthDate", value: values.birthDate, label: "Birth Date"},
                    {type: "text", name: "email", value: values.email, label: "Email"},
                    {type: "text", name: "address", value: values.address, label: "Address"},
                    {type: "select", name: "license", value: values.license, label: "Licensed", options: [{label: "ONE", value: 1}], onChange: (option) => alert(option), placeholder: "Licensed" },
                    {type: "text", name: "supervisedBy", value: values.supervisedBy, label: "Supervised by", disabled: true},
                  ]
                }
              ]
              return (
              <form onSubmit={handleSubmit} style={this.props.formStyle}>
                <Grid container>
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
                                value={field.value}
                                onChange={field.onChange}
                                options={field.options}
                                onBlur={handleBlur}
                                containerClasses={commonTextfieldClasses}
                                feedback={touched[field.name] && errors[field.name] ? errors[field.name] : null}
                              />
                            : <TextField
                                type={field.type}
                                name={field.name}
                                value={field.value}
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

export default BusinessProfile;