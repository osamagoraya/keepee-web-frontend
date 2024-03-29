import React, { Component } from 'react';
import Moment from 'moment';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import ColoredHeader from '../Common/ColoredHeader';
import Button from '../Common/Button';
import {InvisibleTable, TableBody, TableHead, TableCell, TableRow} from '../Common/InvisibleTable';
import './Vat.css'
import Caption from '../Common/Caption';
import PdfAndExcelDownloader from '../Common/PdfAndExcelDownloader';
import VatDetailModal from './VatDetailModal';
import { saveAs } from 'file-saver';
import swal from 'sweetalert';

class Vat extends Component {

  state = {
    selectedVatId: this.props.match.params.vatId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: this.props.selectedUserId,
    selectedUserName: this.props.selectedUserName,
    selectedUserNID : this.props.selectedUserNID,
    selectedUserEmail: this.props.selectedUserEmail,
    selectedUserItaFrequency: this.props.selectedUserItaFrequency,
    selectedUserVatFrequency: this.props.selectedUserVatFrequency,
    selectedUserLicense : this.props.selectedUserLicense,
    selectedUserIncomeTaxAdvances: this.props.selectedUserIncomeTaxAdvances,
    detailModalOpen : false,
    selectedField: null
  }

  componentDidMount() {
    this.fetchVatReport(this.state.selectedVatId, this.state.selectedUserId, this.state.selectedUserName, this.state.selectedUserNID,this.state.selectedUserEmail);
  }
  
  componentWillReceiveProps(nextProps) {
    const {vatId} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    const {selectedUserName} = nextProps;
    const {selectedUserNID} = nextProps;
    const {selectedUserEmail} = nextProps;
    const {selectedUserItaFrequency} = nextProps;
    const {selectedUserVatFrequency} = nextProps;
    const {selectedUserLicense} = nextProps;
    const {selectedUserIncomeTaxAdvances} = nextProps;
    console.log("props received", vatId, selectedUserId, selectedUserName, selectedUserNID, selectedUserEmail,selectedUserItaFrequency,selectedUserVatFrequency,selectedUserLicense)
    if (vatId !== this.state.selectedVatId || selectedUserId !== this.state.selectedUserId){
      console.log("updating state of vat", vatId, selectedUserId)
      this.setState({
        selectedVatId: vatId,
        selectedUserId: selectedUserId,
        selectedUserName : selectedUserName,
        selectedUserNID: selectedUserNID,
        selectedUserEmail: selectedUserEmail,
        selectedUserItaFrequency : selectedUserItaFrequency,
        selectedUserVatFrequency : selectedUserVatFrequency,
        selectedUserLicense: selectedUserLicense,
        selectedUserIncomeTaxAdvances: selectedUserIncomeTaxAdvances
      });
      this.fetchVatReport(vatId, selectedUserId, selectedUserName, selectedUserNID, selectedUserEmail);
    }
  }

  fetchVatReport(vatId, selectedUserId, selectedUserName, selectedUserNID, selectedUserEmail) {
    if ( !vatId || !selectedUserId) {
      console.log("Incomplete information to fetch the VAT report", vatId, selectedUserId, selectedUserName, selectedUserNID, selectedUserEmail);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getVatReport",
      "POST", 
      {userId: selectedUserId, vatReportId: vatId},
      (r) => {
        console.log("response received VAT", r);
        this.setState({report: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'});
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  confirmVatReport(){
    let { selectedVatId } = this.state;
    if(!selectedVatId){
      console.log("Incomplete information to confirm the VAT report with id: ", selectedVatId);
      return;
    }
    sendAuthenticatedAsyncRequest(
      "/confirmVatReport",
      "POST",
      {vatReportId : selectedVatId},
      (r) => {
        console.log("response received: ", r);
        this.setState({apiCallInProgress: false, apiCallType: 'none'});
        this.props.history.push("/workspace/report/vat");
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  reOpenVatReport(){
    let { selectedVatId, selectedUserId } = this.state; 
    let vatReportStartDate = this.state.report.start_date;

    if(!selectedVatId || !selectedUserId || !vatReportStartDate){
      console.log("Incomplete information to close the VAT report with id: ", selectedVatId,selectedUserId,vatReportStartDate);
      return;
    }
    sendAuthenticatedAsyncRequest(
      "/reopenVatReport",
      "POST",
      {vatReportId : selectedVatId , vatReportStartDate : vatReportStartDate, userId: selectedUserId },
      (r) => {
        console.log("response received: ", r);
        this.setState({apiCallInProgress: false, apiCallType: 'none'});
        this.props.history.push("/workspace/report/vat");
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  prepareAndDownloadPdf() {
    axios.post(
      'http://54.245.6.3:8085/vatPdf',
      {report: this.state.report, reportYear: `${Moment(this.state.report.start_date).format("MM.YY")} - ${Moment(this.state.report.end_date).format("MM.YY")}`, userName: this.state.selectedUserName, userniD: this.state.selectedUserNID}, { responseType: 'blob' })
    .then((r)=> {
      console.log(r);
        const pdfBlob = new Blob([r.data], { type: 'application/pdf' });
        saveAs(pdfBlob, "("+`${Moment(this.state.report.start_date).format("MM.YY")} - ${Moment(this.state.report.end_date).format("MM.YY")}`+") ["+this.state.selectedUserNID + " - " +this.state.selectedUserName+"] דוח מעמ.pdf")
        return;
    }).catch((err)=> console.log(err));
  }

  handleClickOpen = (field) => {
    this.setState({detailModalOpen : true, selectedField: field});
  };

  handleClose = () => {
    this.setState({detailModalOpen : false});
  };

  sendEmail = (selectedProfileId, userName, userniD, email, itaFrequency, vatFrequency, license, incomeTaxAdvances) => {
    sendAuthenticatedAsyncRequest(
      "/reportsSendingHistory",
      "POST", 
      { userId: selectedProfileId },
      (r) => {
        console.log("response received from send reports history", r);
        let dates = JSON.parse(r.data.body);
        swal({
          title: "Report Sending History!",
          text: "Vat : "+dates.vat_report_date+"\nIncome Tax : "+dates.ita_report_date+"\nExempted Deals : "+dates.ed_report_date+"\nProfit and Loss : "+dates.pnl_report_date+"\nTrial Balance : "+dates.tb_report_date,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          console.log("body at front",selectedProfileId, userName, userniD, email, itaFrequency, vatFrequency, license, incomeTaxAdvances);
          if (willDelete) {
              sendAuthenticatedAsyncRequest(
                "/sendReportsViaEmail",
                "POST", 
                { userId: selectedProfileId, userName : userName, userniD : userniD, email:email, itaFrequency:itaFrequency,vatFrequency:vatFrequency, btn : 'vat',  license:license, incomeTaxAdvances: incomeTaxAdvances},
                (r) => {
                  console.log("response received from send reports via", r);
                  swal("Success", "Reports Sending Process Initiated!","success");
                },
                (r) => {
                  this.setState({apiCallInProgress: false, apiCallType: 'none', profile: null});
                  swal("Success", "Error! Sending Reports","success");
                }
              );
          } else {
            swal("Email Sending Process Stopped!");
          }
        });
      },
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none', profile: null});
        swal("Success", "Error! Sending Reports","success");
      }
    );
  }

  render() {

    const {apiCallInProgress,apiCallType, report, selectedUserId, selectedUserName, selectedUserNID, selectedUserEmail, selectedUserItaFrequency, selectedUserVatFrequency, selectedUserLicense,selectedUserIncomeTaxAdvances} = this.state;
    console.log("Rendering vat report",apiCallInProgress, report, selectedUserId,selectedUserName, selectedUserNID, selectedUserEmail);
    if (apiCallInProgress && apiCallType == 'fetch'){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedUserId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    } else if (!report){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> No report data </Caption>);
    }
    const field1 = Math.round(parseFloat(report.deal_zero));
    const field2 = Math.round(parseFloat(report.deal_seventeen));
    const field3 = Math.round(parseFloat(report.deal_seventeen_tax));
    const field4 = Math.round(((field2 * 0.17) - field3).toFixed(2));
    const field5 = Math.round(parseFloat(report.equipment_deal));
    const field6 = Math.round(parseFloat(report.others_deal));
    const field7 = Math.round((field3 - (field5 + field6)).toFixed(2));

    

    return (
      <div className="canvas-container vat-container">
        <Grid container>
          <Grid item md={2}></Grid>
          <Grid item container md={8} >
            <Grid item md={12}>
              <Caption style={{paddingLeft: 20}}>
                <PdfAndExcelDownloader 
                  onPdf={() => this.prepareAndDownloadPdf()}
                  sendReportsViaEmail={() => this.sendEmail(selectedUserId,selectedUserName,selectedUserNID,selectedUserEmail,selectedUserItaFrequency,selectedUserVatFrequency,selectedUserLicense, selectedUserIncomeTaxAdvances)}
                  excelData={report}
                  year={`${Moment(this.state.report.start_date).format("MM.YY")} - ${Moment(this.state.report.end_date).format("MM.YY")}`}
                  user={this.state.selectedUserName}
                  niD={this.state.selectedUserNID}
                  type="vat"
                />
                 
              </Caption>
              <ColoredHeader rightLabel="Deals"/>
                <InvisibleTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Deals Tax</TableCell>
                    <TableCell align="center">Deals (No VAT)</TableCell>
                    <TableCell align="right">Tax Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow >
                    <TableCell onClick={() => this.handleClickOpen('dealSeventeenTax')} align="right">{field3}</TableCell>
                    <TableCell onClick={() => this.handleClickOpen('dealSeventeen')} align="center">{field2}</TableCell>
                    <TableCell align="right">Deals 17%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right">0</TableCell>
                    <TableCell align="center">0</TableCell>
                    <TableCell align="right">Deals 18%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right">0</TableCell>
                    <TableCell onClick={() => this.handleClickOpen('dealZero')} align="center">{field1}</TableCell>
                    <TableCell align="right">Deals 0%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"> <strong>Total tax {field3}</strong></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableBody>
                </InvisibleTable>
            </Grid>            
            <Grid item md={12} style={{marginTop: "2%"}}> 
              <ColoredHeader rightLabel="Input"/>
                <InvisibleTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Tax Input</TableCell>
                    <TableCell align="center">Others</TableCell>
                    <TableCell align="center">Equipment</TableCell>
                    <TableCell align="right">Tax Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow >
                    <TableCell align="right">{field5 + field6}</TableCell>
                    <TableCell onClick={() => this.handleClickOpen('othersDeal')} align="center">{field6}</TableCell>
                    <TableCell onClick={() => this.handleClickOpen('equipmentDeal')} align="center">{field5}</TableCell>
                    <TableCell align="right">Deals 17%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"><strong>Total input {field5 + field6}</strong></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"><strong>Total {field7}</strong></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableBody>
                </InvisibleTable>
            </Grid>            
            <Grid item md={12} container spacing={24} style={{marginTop: "2%"}}>
              <Grid item md={2}>
                  { report.status == "open" ?
                  <Button 
                      variant="blue" 
                      className="vat-button" 
                      size="small"
                      disabled={apiCallInProgress} 
                      onClick={(e) => {
                      this.setState({apiCallInProgress: true, apiCallType: 'confirm'});
                      this.confirmVatReport()}
                      }
                  >
                    {
                      apiCallInProgress ? apiCallType === 'confirm' ? "closing..." : "confirm" : "confirm"
                    }
                  </Button> : 
                  <Button 
                      variant="red" 
                      className="vat-button" 
                      size="small"
                      disabled={apiCallInProgress} 
                      onClick={(e) => {
                      this.setState({apiCallInProgress: true, apiCallType: 'confirm'});
                      this.reOpenVatReport()}
                      }
                  >
                      {
                      apiCallInProgress ? apiCallType === 'reopen' ? "reopening..." : "reopen" : "reopen"
                    }
                  </Button>
                  }
              </Grid>
            </Grid> 
          </Grid>
          <Grid item md={2}></Grid>
        </Grid>
        <VatDetailModal open={this.state.detailModalOpen} field={this.state.selectedField} vatReportId={this.state.selectedVatId} />
      </div>
      
    );
  }
}


export default withRouter(Vat);