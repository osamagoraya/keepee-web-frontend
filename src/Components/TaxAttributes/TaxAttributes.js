import React from 'react';

import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik'


import Select from '../Common/Select';
import TextField from '../Common/TextField';
import Button from '../Common/Button';
import Caption from '../Common/Caption';
import './TaxAttributes.css';
import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import swal from 'sweetalert';

class TaxAttributes extends React.Component {

  state = {
    selectedYear: this.props.match.params.year,
    taxAttributes: null,
    apiCallInProgress: false,
    apiCallType: 'fetch',
  }

  componentDidMount() {
    this.fetchTaxAttributes(this.state.selectedYear);
  }

  componentWillReceiveProps(nextProps){
    const {year} = nextProps.match.params;
    if (year !== this.state.taxAttributes) {
      this.setState({selectedYear : year, taxAttributes: this.fetchTaxAttributes(year)});
    }
  }

  fetchTaxAttributes = (year) => {
    if (!year) {
      console.log("No year to fetch details for", year);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getTaxAttributesForAccountant",
      "POST", 
      {year: year},
      (r) => {
        console.log("response received taxAttributes", r);
        this.setState({taxAttributes: r.data, apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none', taxAttributes: null});
      }
    );
  }

  updateTaxAttributes (values) {
    values.year = this.state.selectedYear;
    values.accumulatedIncomes = values.ac_income.join(",");
    values.taxes = values.taxes.map(e => e/100).join(",");
    values.healthInsuranceAccumulatedIncomes = values.health_income.join(",");
    values.healthInsuranceRate = values.health_tax.map(e => e/100).join(",");
    values.socialInsuranceAccumulatedIncomes = values.social_income.join(",");
    values.socialInsuranceRate = values.social_tax.map(e => e/100).join(",");
    console.log(values);
    sendAuthenticatedAsyncRequest(
      "/updateTaxAttributesForAccountant",
      "POST", 
      {values: values},
      (r) => {
        console.log("response received from updating taxAttributes", r);
        swal("Success", "Tax Attributes Updated Successfully!","success");
        this.setState({taxAttributes: r.data, apiCallInProgress: false, apiCallType: 'none'})
        this.props.history.push("/settings/tax-attributes/"+this.state.selectedYear);
      },
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none', taxAttributes: null});
      }
    );
  }


  render () {
    const {apiCallInProgress, taxAttributes, selectedYear} = this.state;

    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedYear) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a year is mandatory </Caption>);
    } else if (!taxAttributes){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Could not fetch taxAttributes data </Caption>);
    }
    
    let taxBrackets = taxAttributes.accumulatedIncomes.split(',');
    let taxPercentages = taxAttributes.taxes.split(',');
    let healthInsurenceBrackets = taxAttributes.healthInsuranceAccumulatedIncomes.split(",");
    let healthInsurancePercentages = taxAttributes.healthInsuranceRate.split(",");
    let socialInsurenceBrackets = taxAttributes.socialInsuranceAccumulatedIncomes.split(",");
    let socialInsurancePercentages = taxAttributes.socialInsuranceRate.split(",");

    const commonTextfieldClasses = "little-bottom-spacer";
    return (
      <Grid container className="canvas-container bp-container" alignContent="flex-start" >
        <Grid item md={12} className="bp-title strong-font">
          Yearly Tax Attributes
        </Grid>
        <Grid item md={12}>
        <Formik
          initialValues={{
            taxes:  taxPercentages.map(e => parseFloat(e*100).toFixed(2)),
            ac_income: taxAttributes.accumulatedIncomes.split(','),
            health_tax: healthInsurancePercentages.map(e => parseFloat(e*100).toFixed(2)),
            social_tax: socialInsurancePercentages.map(e => parseFloat(e*100).toFixed(2)),
            health_income: healthInsurenceBrackets,
            social_income: socialInsurenceBrackets,
            taxCreditPointValue : taxAttributes.taxCreditPointValue,
            minimumIncomeForSocialAndHealthInsurance : taxAttributes.minimumIncomeForSocialAndHealthInsurance,
            qualifiedPensionIncome : taxAttributes.qualifiedPensionIncome, 
            qualifiedTrainingFund  : taxAttributes.qualifiedTrainingFund,
            maxDepositTrainingFund : taxAttributes.maxDepositTrainingFund,
            averageSalary : taxAttributes.averageSalary,
            employeeDepositRate: taxAttributes.employeeDepositRate,
            compulsoryPensionFirstRate: taxAttributes.compulsoryPensionFirstRate,
            compulsoryPensionSecondRate: taxAttributes.compulsoryPensionSecondRate,
            pensionDepositRate: taxAttributes.pensionDepositRate,
            trainingFundRecognizedRate: taxAttributes.trainingFundRecognizedRate,
            monthsForRequestedPension: taxAttributes.monthsForRequestedPension,
            requestedPensionCoeffiecit: taxAttributes.requestedPensionCoeffiecit
          }}    
          onSubmit={(values,  { setSubmitting }) => {
            this.updateTaxAttributes(values)
            setSubmitting(false);
          }}
          enableReinitialize={false} 
          >
          {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, submitForm }) => {
            console.log("SOL",values);
            const formFields = [
                {
                columnLabel: "Taxes on Accoumulated Incomes %",
                fields: [
                  {type: "number", name: "taxes[0]", value: values.taxes[0], label: "",  placeholder: "" },
                  {type: "number", name: "taxes[1]", value: values.taxes[1], label: "",  placeholder: "" },
                  {type: "number", name: "taxes[2]", value: values.taxes[2], label: "",  placeholder: "" },
                  {type: "number", name: "taxes[3]", value: values.taxes[3], label: "",  placeholder: "" },
                  {type: "number", name: "taxes[4]", value: values.taxes[4], label: "",  placeholder: "" },
                  {type: "number", name: "taxes[5]", value: values.taxes[5], label: "",  placeholder: "" },
                  {type: "number", name: "taxes[6]", value: values.taxes[6], label: "",  placeholder: "" }
                ],
                columnSecondLabel: "",
                secondGroupsFields : []
                },
                {
                  columnLabel: "Accumulated Incomes Taxes",
                  fields: [
                    {type: "number", name: "ac_income[0]", value: values.ac_income[0], label: "",  placeholder: "" },
                    {type: "number", name: "ac_income[1]", value: values.ac_income[1], label: "",  placeholder: "" },
                    {type: "number", name: "ac_income[2]", value: values.ac_income[2], label: "",  placeholder: "" },
                    {type: "number", name: "ac_income[3]", value: values.ac_income[3], label: "",  placeholder: "" },
                    {type: "number", name: "ac_income[4]", value: values.ac_income[4], label: "",  placeholder: "" },
                    {type: "number", name: "ac_income[5]", value: values.ac_income[5], label: "",  placeholder: "" }
                  ],
                  columnSecondLabel: "",
                  secondGroupsFields : []
                },
                {
                    columnLabel: "Health Insurence Accumulated Incomes",
                    fields: [
                      {type: "number", name: "health_income[0]", value: values.health_income[0], label: "",  placeholder: "" },
                      {type: "number", name: "health_income[1]", value: values.health_income[1], label: "",  placeholder: "" }
                    ],
                    columnSecondLabel: "Health Insurence Tax %",
                    secondGroupsFields : [
                      {type: "number", name: "health_tax[0]", value: values.health_tax[0], label: "",  placeholder: "" },
                      {type: "number", name: "health_tax[1]", value: values.health_tax[1], label: "",  placeholder: "" }
                    ],
                },
                {
                  columnLabel: "Social Insurence Accumulated Incomes",
                  fields: [
                    {type: "number", name: "social_income[0]", value: values.social_income[0], label: "",  placeholder: "" },
                    {type: "number", name: "social_income[1]", value: values.social_income[1], label: "",  placeholder: "" }
                  ],
                  columnSecondLabel: "Social Insurence Tax %",
                  secondGroupsFields : [
                    {type: "number", name: "social_tax[0]", value: values.social_tax[0], label: "",  placeholder: "" },
                    {type: "number", name: "social_tax[1]", value: values.social_tax[1], label: "",  placeholder: "" }
                  ],
                },
                {
                  columnLabel: "Employee Deposit Rate",
                  fields: [
                    {type: "number", name: "employeeDepositRate", value: values.employeeDepositRate, label: "",  placeholder: "" },
                  ],
                  columnSecondLabel: "Minimun Income For S&H Insurance",
                  secondGroupsFields : [
                    {type: "number", name: "minimumIncomeForSocialAndHealthInsurance", value: values.minimumIncomeForSocialAndHealthInsurance, label: "",  placeholder: "" },
                  ],
                },
                {
                  columnLabel: "Max Deposit Training Fund",
                  fields: [
                    {type: "number", name: "maxDepositTrainingFund", value: values.maxDepositTrainingFund, label: "",  placeholder: "" },
                  ],
                  columnSecondLabel: "Months For Requested Pension",
                  secondGroupsFields : [
                    {type: "number", name: "monthsForRequestedPension", value: values.monthsForRequestedPension, label: "",  placeholder: "" },
                  ],
                },
                {
                  columnLabel: "Pension Deposit Rate",
                  fields: [
                    {type: "number", name: "pensionDepositRate", value: values.pensionDepositRate, label: "",  placeholder: "" },
                  ],
                  columnSecondLabel: "Compulsory Pension Second Rate",
                  secondGroupsFields : [
                    {type: "number", name: "compulsoryPensionSecondRate", value: values.compulsoryPensionSecondRate, label: "",  placeholder: "" },
                  ],
                },
                {
                  columnLabel: "Average Salary",
                  fields: [
                    {type: "number", name: "averageSalary", value: values.averageSalary, label: "",  placeholder: "" },
                  ],
                  columnSecondLabel: "Compulsory Pension First Rate",
                  secondGroupsFields : [
                    {type: "number", name: "compulsoryPensionFirstRate", value: values.compulsoryPensionFirstRate, label: "",  placeholder: "" },
                  ],
                },
                {
                  columnLabel: "Training Fund Rate",
                  fields: [
                    {type: "number", name: "trainingFundRecognizedRate", value: values.trainingFundRecognizedRate, label: "",  placeholder: "" },
                  ],
                  columnSecondLabel: "",
                  secondGroupsFields : [],
                },
                {
                  columnLabel: "Tax Credit Point Value",
                  fields: [
                    {type: "number", name: "taxCreditPointValue", value: values.taxCreditPointValue, label: "",  placeholder: "" },
                  ],
                  columnSecondLabel: "",
                  secondGroupsFields : [],
                },
                {
                  columnLabel: "Qualified Training Fund",
                  fields: [
                    {type: "number", name: "qualifiedTrainingFund", value: values.qualifiedTrainingFund, label: "",  placeholder: "" },
                  ],
                  columnSecondLabel: "",
                  secondGroupsFields : [],
                },
                {
                  columnLabel: "Qualified Pension Income",
                  fields: [
                    {type: "number", name: "qualifiedPensionIncome", value: values.qualifiedPensionIncome, label: "",  placeholder: "" },
                  ],
                  columnSecondLabel: "Requested Pension Coeffiecient",
                  secondGroupsFields : [
                    {type: "number", name: "requestedPensionCoeffiecit", value: values.requestedPensionCoeffiecit, label: "",  placeholder: "" },
                  ],
                },
              ]
              return (
              <form onSubmit={handleSubmit} style={this.props.formStyle}>
                <Grid container justify="flex-end"> 
                {
                  formFields.map((column, cidx) => (
                    <Grid item md={3} key={cidx} className="fields-column">
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
                                isDisabled={true}
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
                      <div className="light-font">{column.columnSecondLabel}</div>
                      {
                        column.secondGroupsFields.map((field, idx) => 
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
                                isDisabled={true}
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
                        cidx === 8
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

export default TaxAttributes;