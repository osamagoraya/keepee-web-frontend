import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import {InvisibleTable, TableBody, TableCell, TableRow} from '../Common/InvisibleTable';
import './IncomeTaxAdvances.css'
import Caption from '../Common/Caption';
import Divider from '../Common/Divider';

import PdfAndExcelDownloader from '../Common/PdfAndExcelDownloader';
import { saveAs } from 'file-saver';

class IncomeTaxAdvances extends Component {

  state = {
    selectedStartDate: this.props.match.params.startDate,
    selectedEndDate: this.props.match.params.endDate,
    reportTitle : this.props.match.params.reportTitle,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: this.props.selectedUserId,
    selectedUserName : this.props.selectedUserName,
    selectedUserNID : this.props.selectedUserNID
  }

  componentDidMount() {
    this.fetchItaReport(this.state.selectedStartDate,this.state.selectedEndDate, this.state.selectedUserId, this.state.selectedUserName, this.state.selectedUserNID);
  }
  
  componentWillReceiveProps(nextProps) {
    const {selectedStartDate} = nextProps.match.params;
    const {selectedEndDate} = nextProps.match.params;
    const {reportTitle} = nextProps.match.params;
    const {selectedUserId} = nextProps;

    console.log("props received", selectedUserId,selectedStartDate,selectedEndDate)
    if (selectedStartDate !== this.state.selectedStartDate || selectedUserId !== this.state.selectedUserId || selectedEndDate !== this.state.selectedEndDate ){
      console.log("updating state of ITA", selectedStartDate, selectedEndDate, selectedUserId)
      this.setState({
        selectedStartDate: selectedStartDate,
        selectedEndDate: selectedEndDate,
        selectedUserId: selectedUserId,
        reportTitle: reportTitle
      });
      this.fetchItaReport(selectedStartDate,selectedEndDate,selectedUserId);
    }
  }

  fetchItaReport(selectedStartDate,selectedEndDate,selectedUserId, selectedUserName, selectedUserNID) {
    if ( !selectedStartDate || !selectedEndDate || !selectedUserId) {
      console.log("Incomplete information to fetch the ITA report", selectedStartDate,selectedEndDate, selectedUserId, selectedUserName, selectedUserNID);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getIncomeTaxReport",
      "POST", 
      {userId: selectedUserId, startDate: selectedStartDate, endDate: selectedEndDate},
      (r) => {
        console.log("response received ITA", r);
        
        this.setState({report: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  prepareAndDownloadPdf() {
    axios.post(
      'http://54.245.6.3:8085/incomeTaxAdvancesPdf',
      {report: this.state.report, reportYear: this.state.reportTitle, userName: this.state.selectedUserName, userniD: this.state.selectedUserNID}, { responseType: 'blob' })
    .then((r)=> {
      console.log(r);
        const pdfBlob = new Blob([r.data], { type: 'application/pdf' });
        saveAs(pdfBlob, "Income Tax Advances ("+this.state.reportTitle+") ["+this.state.selectedUserName + " - " + this.state.selectedUserNID+"].pdf")
        return;
    }).catch((err)=> console.log(err));
  }

  render() {
    const {apiCallInProgress, report, selectedUserId, reportTitle} = this.state;

    console.log("Rendering ITA report",apiCallInProgress, report, selectedUserId);
    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedUserId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    } else if (!report){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> No report data </Caption>);
    }

    const CustomChip = (props) => <Chip style={{color: "#827978", fontWeight: 600, marginLeft: 15}} label={props.label} as="div" />;
    return (
      <div className="canvas-container ita-container">
        <Grid container>
          <Grid item md={1}></Grid>
          <Grid item container md={10} >
            <Grid item md={12}>
              <Caption style={{paddingLeft: 20}}>
                {this.state.reportTitle} 
                <PdfAndExcelDownloader 
                  onPdf={() => this.prepareAndDownloadPdf()}
                  excelData={report}
                  year={this.state.reportTitle}
                  user={this.state.selectedUserName}
                  niD={this.state.selectedUserNID}
                  type="ita"
                /> 
              </Caption>
              <Divider />
            </Grid>
            <Grid item md={12}> 
              <InvisibleTable>
              <TableBody>
                <TableRow height="-high">
                  <TableCell align="right">{Math.round(report.businessCycle)}</TableCell>
                  <TableCell align="right">Business Cycle <CustomChip label="a" /></TableCell>
                  <TableCell align="right">{Math.round(report.advancesByBusinessCycle)}</TableCell>
                  <TableCell align="right">Advance by Business Cycle %<CustomChip label="d" /></TableCell>
                </TableRow>
                <TableRow height="-high">
                  <TableCell align="right">{Math.round(report.withHoldingTax)}</TableCell>
                  <TableCell align="right">Witholding Tax <CustomChip label="b" /></TableCell>
                  <TableCell align="right">{Math.round(report.withholdingTaxByAdvances)}</TableCell>
                  <TableCell align="right">Witholding Tax by Advances <CustomChip label="e" /></TableCell>
                </TableRow>
                <TableRow height="-high">
                  <TableCell align="right">{Math.round(report.advances)}</TableCell>
                  <TableCell align="right">Advances <CustomChip label="c" /></TableCell>
                  <TableCell align="right">{Math.round(report.totalPayments)}</TableCell>
                  <TableCell align="right">Total Payment <CustomChip label="f" /></TableCell>
                </TableRow>
              </TableBody>
              </InvisibleTable>
            </Grid>
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(IncomeTaxAdvances);