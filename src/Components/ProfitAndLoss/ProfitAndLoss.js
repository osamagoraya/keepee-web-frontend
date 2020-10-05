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
import { Button } from 'react-bootstrap';
import moment from 'moment';

class ProfitAndLoss extends Component {
  

  state = {
    type: 'Select Type',
    months: [{name: 'January', id:1}, {name: 'February', id:2},{name: 'March', id:3},{name: 'April', id:4},{name: 'May', id:5},{name: 'June', id:6},{name: 'July', id:7},{name: 'August', id:8},{name: 'September', id:9},{name: 'October', id:10},{name: 'November', id:11},{name: 'December', id:12}],
    selectedValues: [],
    selectedPnlYear: '2019',
    defaultMonths: ["2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12"],
    selectedMonths: [],
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: this.props.selectedUserId,
    selectedUserName: this.props.selectedUserName,
    selectedUserNID: this.props.selectedUserNID
  }
  
  componentDidMount() {
    //this.fetchPnlReport(this.state.selectedPnlYear, this.state.selectedUserId, this.state.selectedUserName, this.state.selectedUserNID);
    //this.fetchPnlMonthlyReport(this.state.defaultMonths, this.state.selectedUserId, this.state.selectedUserName, this.state.selectedUserNID);
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

  // for months
  fetchPnlMonthlyReport(pnlMonths, selectedUserId, selectedUserName, selectedUserNID) {
    console.log("fetching PNL report for ", selectedUserId, pnlMonths, selectedUserName,selectedUserNID)
    if ( !pnlMonths || !selectedUserId) {
      console.log("Incomplete information to fetch the PNL report", pnlMonths, selectedUserId, selectedUserName);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/profitAndLossMonthlyReports",
      "POST", 
      {userId: selectedUserId, months: pnlMonths},
      (r) => {
        this.setState({reportM: this.prepareMonthlyReport(JSON.parse(r.data.body)), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
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

  prepareMonthlyReport(reportData){
    console.log("Report Prepare k waqt",reportData)
    const groupedData = {};
    let totalSum = [], totalCreditSum = [], totalDebitSum = [];
    this.state.selectedMonths.forEach((month) => {
      totalSum[moment(month).format('MMM')] = 0;
      totalCreditSum[moment(month).format('MMM')] = 0;
      totalDebitSum[moment(month).format('MMM')] = 0;
    });

   Object.keys(reportData).forEach(k => {
      let sum = [], creditSum = [], debitSum = [];
      this.state.selectedMonths.forEach((month) => {
        sum[moment(month).format('MMM')] = 0;
        creditSum[moment(month).format('MMM')] = 0;
        debitSum[moment(month).format('MMM')] = 0;
      });
      
      let sumType = "";
      reportData[k].map(c => {
        if(c.type == "credit") {
          this.state.selectedMonths.forEach((month) => {
                sum[moment(month).format('MMM')] += c[moment(month).format('MMM')] === undefined ? 0 : parseFloat(c[moment(month).format('MMM')],10);
                creditSum[moment(month).format('MMM')] += c[moment(month).format('MMM')] === undefined ? 0 : parseFloat(c[moment(month).format('MMM')],10);
                sumType = "credit"
          });
        }
        else {
          this.state.selectedMonths.forEach((month) => {
            sum[moment(month).format('MMM')] += c[moment(month).format('MMM')] === undefined ? 0 : parseFloat(c[moment(month).format('MMM')],10);
            debitSum[moment(month).format('MMM')] += c[moment(month).format('MMM')] === undefined ? 0 : parseFloat(c[moment(month).format('MMM')],10);
            sumType = "debit"
          });
        }
      });

      this.state.selectedMonths.forEach((month) => {
        totalSum[moment(month).format('MMM')] += sum[moment(month).format('MMM')] === undefined ? 0 : parseFloat(sum[moment(month).format('MMM')],10);
        totalCreditSum[moment(month).format('MMM')] += creditSum[moment(month).format('MMM')] === undefined ? 0 : parseFloat(creditSum[moment(month).format('MMM')],10)
        totalDebitSum[moment(month).format('MMM')] += debitSum[moment(month).format('MMM')]  === undefined ? 0 :  parseFloat(debitSum[moment(month).format('MMM')]);
      });
      
      groupedData[k] = {
        data: reportData[k],
        sum: sum,
        sumType: sumType
      }
    });
    console.log(groupedData);
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

  prepareAndDownloadMonthlyPdf() {
    // axios.post(
    //   'http://localhost:8085/profitAndLossMonthlyPdf',
    //   {report: this.state.reportM, selectedMonths:this.state.selectedMonths,reportYear: this.state.selectedPnlYear, userName: this.state.selectedUserName, userniD: this.state.selectedUserNID}, { responseType: 'blob' })
    // .then((r)=> {
    //   console.log(r);
    //     const pdfBlob = new Blob([r.data], { type: 'application/pdf' });
    //     saveAs(pdfBlob, "("+this.state.selectedPnlYear+") ["+this.state.selectedUserNID+ " - " + this.state.selectedUserName+"] דוח רווח והפסד.pdf")
    //     return;
    // }).catch((err)=> console.log(err));
  }

  onSubmit = () => {
    if(this.state.type == "Monthly")
      this.fetchPnlMonthlyReport(this.state.selectedMonths, this.state.selectedUserId, this.state.selectedUserName, this.state.selectedUserNID)
    else if(this.state.type == "Yearly"){
      this.fetchPnlReport(this.state.selectedPnlYear, this.state.selectedUserId, this.state.selectedUserName, this.state.selectedUserNID);
    }
  }
  

  render() {
    const {apiCallInProgress, report, selectedUserId, selectedPnlYear, type, reportM } = this.state;

    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedUserId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    }

    const selectType = e => {
      console.log('ev',e.target.value)
      this.setState({type:e.target.value});
    }
    const selectYear = e => {
      console.log('ev',e.target.value)
      this.setState({selectedPnlYear:e.target.value});
      if (type === "Yearly"){
      this.fetchPnlReport(e.target.value, selectedUserId, this.state.selectedUserName, this.state.selectedUserNID)
      }
    }
    const onSelect = ev => {
      console.log('onselect event',ev);
      let i = 0;
      let temp = [];
      for (i = 0; i < ev.length; i++) {
        temp.push(selectedPnlYear+'-0'+ev[i].id);
        this.setState({selectedMonths: temp});
      }
      
      
    }
   
    const onRemove = ev => {
      onSelect(ev)
    }

    
    return (
     
      <div className="canvas-container ita-container">
        <Grid container>
          <Grid item md={1}></Grid>
          <Grid item md={12} className="d-flex flex-row">
            <select className="dropdown" id="type" onChange={selectType} value={this.state.type}>
                  <option value="select" disabled>Type</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Monthly">Monthly</option>
            </select>
            <select disabled={type === "Select Type"} className="dropdown" id="year" onChange={selectYear} value={this.state.selectedPnlYear}>
                  <option value="year" disabled>Year</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
            </select>
            <div className={type === "Monthly" ? '' : 'd-none'}>
              <Multiselect
                className='multi-select'
                options={this.state.months} 
                selectedValues={this.state.selectedValue} 
                onSelect={onSelect}
                onRemove={onRemove}
                displayValue="name"
              />
            </div>
            <Button onClick={this.onSubmit}>Submit</Button>
          </Grid>
          {report ?
            <Grid className={type === "Yearly" && selectedPnlYear !== '' ? '' : 'd-none'} item container md={10} >
              <Grid item md={12}>
                <Divider />
                  <Caption style={{paddingLeft: 20}}>
                    {selectedPnlYear} {this.state.type}
                    <PdfAndExcelDownloader 
                        onPdf={() => this.prepareAndDownloadPdf()}
                        excelData={this.state.report}
                        year={this.state.selectedPnlYear}
                        user={this.state.selectedUserName}
                        niD={this.state.selectedUserNID}
                        type="pnl"
                        subType="yearly"
                        selectedMonths=""
                    />
                  </Caption>
                <Divider />
              </Grid>
              <Grid item md={2}></Grid>
              
              <Grid item md={8}>
                  {Object.keys(report.groupedData).map((groupKey, i) => (
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
            :""  
          }
          {reportM ? 
            <Grid className={type === "Monthly" ? '' : 'd-none'} item container md={10} >
              <Grid item md={12}>
                <Divider />
                <Caption style={{paddingLeft: 20}}>
                  Year: {selectedPnlYear} Months: {this.state.selectedMonths+' '}
                  <PdfAndExcelDownloader 
                      onPdf={() => this.prepareAndDownloadMonthlyPdf()}
                      excelData={this.state.reportM}
                      year={this.state.selectedPnlYear}
                      user={this.state.selectedUserName}
                      niD={this.state.selectedUserNID}
                      type="pnl"
                      subType="monthly"
                      selectedMonths={this.state.selectedMonths}
                  />
                </Caption>
                <Divider />
              </Grid>
              <Grid item md={2}></Grid>
              <Grid item md={10}> 
                {Object.keys(reportM.groupedData).map((groupKey, i) => (
                  <ExpansionPanel key={i}>
                      <ExpansionPanelSummary>
                        <div className={`k-header k-green-header`}>
                          {this.state.selectedMonths ? this.state.selectedMonths.slice(0).reverse().map(month => (
                            
                            <div style={{ width: '20%', textAlign: 'center'}}>
                              { i==0 ? moment(month).format('MMMM') : ''}
                            </div>
                          )): ""
                          }
                          <div style={{ width: '20%', textAlign: 'center'}}>
                            {groupKey.substring(0,1).toUpperCase() + groupKey.substring(1)}
                          </div>
                        </div>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails style={{ padding: 'none !important'}}>
                        <InvisibleTable>
                          <TableBody>
                            {
                              reportM.groupedData[groupKey].data.map((category, j) => (
                                <TableRow key={j}>
                                  {this.state.selectedMonths.slice(0).reverse().map(month => (
                                    <TableCell style={{ width: '20%', textAlign: 'center',padding: '0'}}>{category[moment(month).format('MMM')] === undefined ? '0' : category[moment(month).format('MMM')]}</TableCell>  
                                  ))}
                                  <TableCell style={{ width: '20%', textAlign: 'center',padding: '0'}}>{category.name}</TableCell>
                                </TableRow>
                              ))
                            }
                            <TableRow >
                                  {
                                    this.state.selectedMonths.slice(0).reverse().map(month => (
                                      <TableCell style={{ width: '20%', textAlign: 'center',padding: '0'}}>{reportM.groupedData[groupKey].sum[moment(month).format('MMM')] === undefined ? '0' : reportM.groupedData[groupKey].sum[moment(month).format('MMM')]}</TableCell>  
                                    ))
                                  }
                                  <TableCell align="right"><strong>Total {groupKey}</strong></TableCell>
                            </TableRow>
                          </TableBody>
                        </InvisibleTable>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}
                <div className={`k-header k-grey-header`}>
                          {this.state.selectedMonths ? this.state.selectedMonths.slice(0).reverse().map(month => (
                            <div style={{ width: '20%', textAlign: 'center'}}>
                              {Math.abs(reportM.totalCreditSum[moment(month).format('MMM')]-reportM.totalDebitSum[moment(month).format('MMM')])}
                            </div>
                          )): ""
                          }
                          <div style={{ width: '20%', textAlign: 'center'}}>Total</div>
                </div>
              </Grid>
            </Grid>
            : ""  
          }
          {
            !report && !reportM ? <Caption style={{ marginLeft: '60px', marginTop: '10px', }}>No Report Loaded!</Caption> : ""
          }
          <Grid item md={1}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(ProfitAndLoss);