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
    selectedClientId: this.props.match.params.clientId,
    client: null,
    apiCallInProgress: false,
    apiCallType: 'fetch',
  }

  componentDidMount() {
    //this.fetchClientDetails(this.state.selectedClientId);
  }

  componentWillReceiveProps(nextProps){
    const {clientId} = nextProps.match.params;
    if (clientId !== this.state.client) {
      this.setState({clientId});
    }
  }

  fetchClientDetails = (clientId, startDate, endDate) => {
    if (!clientId) {
      console.log("No client id found to fetch details for", clientId,);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getUserForUnifiedForm",
      "POST", 
      {userId: clientId, startDate: startDate, endDate: endDate},
      (r) => {
        console.log("response received business profile", r);
        this.setState({client: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
        console.log("after parsing",JSON.parse(r.data.body));
        this.generateIniFile();
      },
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none'});
      }
    );
  }

 generateRandomString(string_length){
    let random_string = '';
    let random_ascii;
    let ascii_low = 65;
    let ascii_high = 90
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}

padWithZeroes = (number, length) => {

  var my_string = '' + number;
  while (my_string.length < length) {
      my_string = '0' + my_string;
  }

  return my_string;

}

  generateIniFile = () => {
    console.log("Pehly hi hogya!");
    let masterID       = this.generateRandomString(15);
    let currentyear    = moment().year().toString();
    let currentMonth   = (moment().month() + 1) > 9 ? moment().month() + 1 :  "0"+ (moment().month() + 1);
    let currentHours   = moment().hours().toString();
    let currentMinutes = moment().minutes().toString();
    let currentDay     = moment().dates().toString();
    let client         = this.state.client;
    let iniPath        = client.userInfo.nId+"."+currentyear[2]+currentyear[3]+"/"+currentMonth+currentDay+currentHours+currentMinutes+"/INI.txt";

    // "X"+Date.now().toString()+"Y"+
    let data = "A000\t00000\t" 
                + (Number(client.userData.length) + Number(client.categoryData.length))
                + "\t"+client.userInfo.nId+"\t" 
                + masterID 
                + "\t&OF1.31&" 
                + "\t12345678" 
                + "\tKEEPEE" 
                + "\t00000000000000000020"
                + "\tAVIID" 
                + "\tAvi Babai" 
                + "\t1\t" 
                + iniPath 
                + "\t1" 
                + "1,2\t" 
                + "&OF1.31&\t" 
                + "000000009\t" 
                + "0000000010\t" 
                + client.userInfo.name + "\t"
                + client.userInfo.address + "\t"
                + moment().year() + "\t"
                + moment().startOf('year').format('YYYYMMDD') + "\t"
                + moment().format("YYYYMMDD") + "\t"
                + moment().format('YYYYMMDD') + "\t"
                + moment().format('HHMM') + "\t" 
                + "1" + "\t"
                + "1 =ISO-8859-8-i; 2 = CP-862" + "\t"
                + "JsZip React Library" + "\t"
                + "ILS" + "\t"
                + "1- has branches 0-hasn’t any branches" + "\t"
                + "\n";
       
        
        data += "B100\t" + this.padWithZeroes(client.userData.length,19) + "\n";
        data += "B110\t" + this.padWithZeroes(client.categoryData.length,19) +  "\n";
        data += "C100\t" + this.padWithZeroes(0,19) + "\n";
        data += "D110\t" + this.padWithZeroes(0,19) +  "\n";
        data += "D120\t" + this.padWithZeroes(0,19) + "\n";
        data += "M100\t" + this.padWithZeroes(0,19) +  "\n";
    
    var zip = new JSZip();
    
    var mkvdata = new JSZip();

    var entryIndex = 0;
    var MkvdataString = 'A000 \t'+masterID+ '\t&OF1.31&\n';
    this.state.client.userData.forEach((row,index) => {
      var type = row.type == "debit" ? "1" : "2"  + "\t";
      MkvdataString +=    'B100\t'
                          + this.padWithZeroes(index+1,19) + "\t"
                          + client.userInfo.nId + "\t"
                          + row.je_id + "\t"
                          + row.movement_no + "\t"
                          + "הוצאה" + "\t"
                          + row.reference_1 + "\t"
                          + row.reference_2 + "\t"
                          + row.category_id + "\t"
                          + row.details + "\t"
                          + row.je_date + "\t"
                          + row.je_date + "\t"
                          + row.category_no + "\t"
                          + "000000000000000" + "\t"
                          + type + "\t"
                          + "376" + "\t"
                          + row.sum + "\t"
                          + "0" + "\t"
                          + moment(row.date_created).format('YYYY-MM-DD') + "\t"
                          + client.userInfo.name + "\t"
                          + "\n";
                          entryIndex = index+1;
    });
    var catEntryIndex = 0;
    this.state.client.categoryData.forEach((row,index) => {
      var credit = row.type == 'credit' ? row.sum : '0';
      var debit  = row.type == 'debit'  ? row.sum : '0';
      MkvdataString +=    'B110\t'
                          + this.padWithZeroes(entryIndex+index+1,19) + "\t"
                          + client.userInfo.nId + "\t"
                          + row.category_no + "\t"
                          + row.name + "\t"
                          + row.group_no + "\t"
                          + row.group + "\t"
                          + row.sum + "\t"
                          + credit + "\t" 
                          + debit + "\t"
                          + "\n";    
                          catEntryIndex = entryIndex+index+1;               
    });
    MkvdataString +=    'Z900\t' + this.padWithZeroes(catEntryIndex+1,19) + "\t" + client.userInfo.nId + "\t" + '&OF1.31&' + "\t" + this.padWithZeroes(catEntryIndex+1,19)

    mkvdata.file("BKMVDATA.txt",MkvdataString);
    mkvdata.generateAsync({type: 'blob'}).then(content => {
      zip.file(client.userInfo.nId+"."+currentyear[2]+currentyear[3]+"/"+currentMonth+currentDay+currentHours+currentMinutes+ "/BKMVDATA.zip", content);
      zip.file(iniPath, data);
      zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        window.saveAs(content,"OPENFRMT.zip");
    });
    });
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
    } else if (!selectedClientId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    }
    
    //console.log(client);
    return (
      <Grid container className="canvas-container bp-container" alignContent="flex-start" justify="flex-end">
         <Formik
          initialValues={{ 
            unifiedStartDate: moment().startOf('year').format('YYYY-MM-DD'), unifiedEndDate : moment().format('YYYY-MM-DD')
          }}    
          onSubmit={async(values,  { setSubmitting }) => {
            this.fetchClientDetails(selectedClientId, values.unifiedStartDate, values.unifiedEndDate);
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