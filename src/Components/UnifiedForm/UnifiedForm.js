import React from 'react';


import Grid from '@material-ui/core/Grid';
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
    this.fetchClientDetails(this.state.selectedClientId);
  }

  componentWillReceiveProps(nextProps){
    const {clientId} = nextProps.match.params;
    if (clientId !== this.state.client) {
      this.setState({clientId}, this.fetchClientDetails(clientId));
    }
  }

  fetchClientDetails = (clientId) => {
    if (!clientId) {
      console.log("No client id found to fetch details for", clientId,);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getUser",
      "POST", 
      {userId: clientId},
      (r) => {
        console.log("response received business profile", r);
        this.setState({client: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none', profile: null});
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

  generateIniFile = () => {
    
    let currentyear = moment().year().toString();
    let currentMonth = moment().month() + 1 > 9 ? moment().month() + 1 :  "0"+ (moment().month() + 1);
    let currentHours = moment().hours().toString();
    let currentMinutes = moment().minutes().toString();
    let currentDay = moment().dates().toString();
    let client = this.state.client;
    let iniPath = "OPENFRMT/"+client.nId+"."+currentyear[2]+currentyear[3]+"/"+currentMonth+currentDay+currentHours+currentMinutes+"/INI.txt";
    

    
    let data = "A000\t00000\t000000000000015\t"+client.nId+"\t"+"X"+Date.now().toString()+"Y"+"\t&OF1.31&"+"\t12345678\tKEEPEE\t00000000000000000020\tAVIID\tAvi Babai\t1\t"+iniPath+"\t1\t1,2\t&OF1.31&\t000000009\t0000000010\t"+client.name;
    
    var zip = new JSZip();
    zip.file(iniPath, data);
    zip.generateAsync({type:"blob"})
    .then(function(content) {
    // see FileSaver.js
        window.saveAs(content,"OPENFRMT.zip");
    });
  }

  render () {
    const {apiCallInProgress, client, selectedClientId} = this.state;

    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedClientId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    } else if (!client){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Could not fetch profile data </Caption>);
    }
    
    console.log(client);
    return (
      <Grid container className="canvas-container bp-container" alignContent="flex-start" >
          <Button onClick={this.generateIniFile}>Click to generate Unified Form Files</Button>
      </Grid>
    );
  }
}

export default UnifiedForm;