import React, {Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import { Multiselect } from 'multiselect-react-dropdown';
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
    type: 'Select Type',
    months: [{name: 'January', id:1}, {name: 'February', id:2},{name: 'March', id:3},{name: 'April', id:4},],
    selectedValues: [],
    selectedPnlYear: '2019',
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
    let totalSum = 0, totalCreditSum = 0, totalDebitSum = 0;
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
            sum += parseFloat(c.sum,10)
            debitSum += parseFloat(c.sum,10);
            sumType = "debit"
        }
      });
      totalSum += sum;
      totalCreditSum += creditSum;
      totalDebitSum += debitSum;
      groupedData[k] = {
        data: reportData[k],
        sum: sum,
        sumType: sumType
      }
    });

    return {  totalSum, groupedData, totalCreditSum,totalDebitSum  };
  }

  prepareAndDownloadPdf() {
    axios.post(
      'http://54.245.6.3:8085/profitAndLossPdf',
      {report: this.state.report, reportYear: this.state.selectedPnlYear, userName: this.state.selectedUserName, userniD: this.state.selectedUserNID}, { responseType: 'blob' })
    .then((r)=> {
      console.log(r);
        const pdfBlob = new Blob([r.data], { type: 'application/pdf' });
        saveAs(pdfBlob, "("+this.state.selectedPnlYear+") ["+this.state.selectedUserNID+ " - " + this.state.selectedUserName+"] דוח רווח והפסד.pdf")
        return;
    }).catch((err)=> console.log(err));
  }

  render() {
    const {apiCallInProgress, report, selectedUserId, selectedPnlYear, type } = this.state;

    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedUserId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    } else if (!report){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> No report data </Caption>);
    }
    const selectType = e => {
      console.log('ev',e.target.value)
      this.setState({type:e.target.value});
    }
    const selectYear = e => {
      console.log('ev',e.target.value)
      this.setState({selectedPnlYear:e.target.value});
    }
    const selectMonth = e => {
      console.log('ev',e.target.value)
      this.setState({month:e.target.value});
    }
    const onSelect = ev => {
      console.log('onselect event',ev);
    }
    const onRemove = ev => {
      console.log('On remove event',ev);
    }

    return (
     
      <div className="canvas-container ita-container">
        <Grid container>
          <Grid item md={1}></Grid>
          <Grid item md={12}>
          <select className="dropdown" id="type" onChange={selectType} value={this.state.type}>
                  <option value="select">Type</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Monthly">Monthly</option>
            </select>
            <select className="dropdown" id="year" onChange={selectYear} value={this.state.selectedPnlYear}>
                  <option value="year">Year</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
            </select>
            <Multiselect
              className="multi-select"
              options={this.state.months} 
              selectedValues={this.state.selectedValue} 
              onSelect={onSelect}
              onRemove={onRemove}
              displayValue="name"
            />
          </Grid>
          <Grid className="d-none" item container md={10} >
            <Grid item md={12}>
            
            <Divider />
              <Caption style={{paddingLeft: 20}}>
                {selectedPnlYear} {this.type}
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
              <ColoredHeader leftLabel={Math.abs(report.totalCreditSum-report.totalDebitSum)} rightLabel="Total" variant="grey" style={{marginTop: "12px"}}/>
            </Grid>
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(ProfitAndLoss);