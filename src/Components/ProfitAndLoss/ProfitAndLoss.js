import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';

import './ProfitAndLoss.css'
import Caption from '../Common/Caption';
import Divider from '../Common/Divider';
import ColoredHeader from '../Common/ColoredHeader';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary} from '../Common/ExpansionPanel';
import {InvisibleTable, TableBody, TableCell, TableRow} from '../Common/InvisibleTable';
import PdfAndExcelDownloader from '../Common/PdfAndExcelDownloader';
import { saveAs } from 'file-saver';

class ProfitAndLoss extends Component {

  state = {
    selectedPnlYear: this.props.match.params.pnlYear,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: this.props.selectedUserId,
    selectedUserName: this.props.selectedUserName,
    selectedUserNID: this.props.selectedUserNID
  }

  componentDidMount() {
    this.fetchPnlReport(this.state.selectedPnlYear, this.state.selectedUserId, this.state.selectedUserName, this.state.selectedUserNID);
  }
  
  componentWillReceiveProps(nextProps) {
    const {pnlYear} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    const {selectedUserName} = nextProps;
    const {selectedUserNID} = nextProps;
    console.log("props received", pnlYear, selectedUserId, selectedUserName, selectedUserNID)
    if (pnlYear !== this.state.selectedItaId || selectedUserId !== this.state.selectedUserId){
      console.log("updating state of ITA", pnlYear, selectedUserId)
      this.setState({
        selectedPnlYear: pnlYear,
        selectedUserId: selectedUserId,
        selectedUserName: selectedUserName,
        selectedUserNID: selectedUserNID
      });
      this.fetchPnlReport(pnlYear, selectedUserId, selectedUserName, selectedUserNID);
    }
  }

  fetchPnlReport(pnlYear, selectedUserId, selectedUserName, selectedUserNID) {
    console.log("fetching PNL report for ", selectedUserId, pnlYear, selectedUserName,selectedUserNID)
    if ( !pnlYear || !selectedUserId) {
      console.log("Incomplete information to fetch the PNL report", pnlYear, selectedUserId, selectedUserName);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/profitAndLossReport",
      "POST", 
      {userId: selectedUserId, reportYear: pnlYear},
      (r) => {
        this.setState({report: this.prepareReport(JSON.parse(r.data.body)), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  prepareReport(reportData) {
    const groupedData = {};
    let totalSum = 0, totalcreditSum = 0, totalDebitSum = 0;
    Object.keys(reportData).forEach(k => {
      let sum = 0, creditSum = 0, debitSum = 0;
      let sumType = "";
      reportData[k].map(c => {
        if(c.type == "credit") {
            sum += parseFloat(c.sum,10)
            creditSum += parseFloat(c.sum,10)
            sumType = "credit"
        }
        else {
            sum -= parseFloat(c.sum,10)
            debitSum += parseFloat(c.sum,10);
            sumType = "debit"
        }
      });
      totalSum += sum;
      totalcreditSum += creditSum;
      totalDebitSum += debitSum;
      groupedData[k] = {
        data: reportData[k],
        sum: sum,
        sumType: sumType
      }
    });

    return {  totalSum, groupedData, totalcreditSum,totalDebitSum  };
  }

  prepareAndDownloadPdf() {
    axios.post(
      'http://54.245.6.3:8085/profitAndLossPdf',
      {report: this.state.report, reportYear: this.state.selectedPnlYear, userName: this.state.selectedUserName, userniD: this.state.selectedUserNID}, { responseType: 'blob' })
    .then((r)=> {
      console.log(r);
        const pdfBlob = new Blob([r.data], { type: 'application/pdf' });
        saveAs(pdfBlob, "Profit & Loss ("+this.state.selectedPnlYear+") ["+this.state.selectedUserName + " - " + this.state.selectedUserNID+"].pdf")
        return;
    }).catch((err)=> console.log(err));
  }

  render() {
    const {apiCallInProgress, report, selectedUserId, selectedPnlYear} = this.state;

    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedUserId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    } else if (!report){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> No report data </Caption>);
    }

    return (
     
      <div className="canvas-container ita-container">
        <Grid container>
          <Grid item md={1}></Grid>
          <Grid item container md={10} >
            <Grid item md={12}>
              <Caption style={{paddingLeft: 20}}>
                {selectedPnlYear} 
                <PdfAndExcelDownloader 
                    onPdf={() => this.prepareAndDownloadPdf()}
                    excelData={this.state.report}
                    year={this.state.selectedPnlYear}
                    user={this.state.selectedUserName}
                    niD={this.state.selectedUserNID}
                    type="pnl"
                />
              </Caption>
              <Divider />
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={8}> 
              {
                Object.keys(report.groupedData).map((groupKey, i) => (
                  <ExpansionPanel key={i}>
                    <ExpansionPanelSummary>
                      <ColoredHeader rightLabel={groupKey.substring(0,1).toUpperCase() + groupKey.substring(1)} />
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <InvisibleTable>
                        <TableBody>
                        {
                          report.groupedData[groupKey].data.map((category, j) => (
                            <TableRow key={j}>
                              <TableCell align="right">{category.sum /* TODO: verify if sum is the key which has the sum for this category */}</TableCell>
                              <TableCell align="right">{category.name}</TableCell>
                            </TableRow>
                          ))
                        }
                          <TableRow >
                            <TableCell align="right">{report.groupedData[groupKey].sum}</TableCell>
                            <TableCell align="right"><strong>Total {groupKey}</strong></TableCell>
                          </TableRow>
                        </TableBody>
                      </InvisibleTable>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                ))
              }
              <ColoredHeader leftLabel={report.totalSum} rightLabel="Total" variant="grey" style={{marginTop: "12px"}}/>
            </Grid>
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(ProfitAndLoss);