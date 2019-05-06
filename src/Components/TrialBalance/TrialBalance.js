import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';

import './TrialBalance.css'
import Caption from '../Common/Caption';
import Divider from '../Common/Divider';
import ColoredHeader from '../Common/ColoredHeader';
import {ExpansionPanel, CompactExpansionPanelDetails, ExpansionPanelSummary} from '../Common/ExpansionPanel';
import {BootstrapTable} from '../Common/Table';
import {InvisibleTable, TableBody, TableCell, TableRow} from '../Common/InvisibleTable';
import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import {tbDD} from '../../Reports/trialBalance';
import PdfAndExcelDownloader from '../Common/PdfAndExcelDownloader';

class TrialBalance extends Component {

  state = {
    selectedTrailBalanceYear: this.props.match.params.trailBalanceYear,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: this.props.selectedUserId,
    selectedUserName : this.props.selectedUserName,
    selectedUserNID  : this.props.selectedUserNID
  }

  componentDidMount() {
    this.fetchTrailBalanceReport(this.state.selectedTrailBalanceYear, this.state.selectedUserId,this.state.selectedUserName, this.props.selectedUserNID);
  }
  
  componentWillReceiveProps(nextProps) {
    const {trailBalanceYear} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    const {selectedUserName} = nextProps;
    const {selectedUserNID}  = nextProps;
    console.log("props received", trailBalanceYear, selectedUserId, selectedUserName, selectedUserNID)
    if (trailBalanceYear !== this.state.selectedTrailBalanceYear || selectedUserId !== this.state.selectedUserId){
      console.log("updating state of ITA", trailBalanceYear, selectedUserId)
      this.setState({
        selectedTrailBalanceYear: trailBalanceYear,
        selectedUserId: selectedUserId,
        selectedUserName: selectedUserName,
        selectedUserNID: selectedUserNID
      });
      this.fetchTrailBalanceReport(trailBalanceYear, selectedUserId, selectedUserName, selectedUserNID);
    }
  }

  fetchTrailBalanceReport(trailBalanceYear, selectedUserId, selectedUserName, selectedUserNID) {
    console.log("fetching PNL report for ", selectedUserId, trailBalanceYear, selectedUserName, selectedUserNID)
    if ( !trailBalanceYear || !selectedUserId) {
      console.log("Incomplete information to fetch the TB report", trailBalanceYear, selectedUserId);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/trialBalanceReport",
      "POST", 
      {userId: selectedUserId, reportYear: trailBalanceYear},
      (r) => {
        console.log("response received TB", r);
        this.setState({report: this.prepareReport(JSON.parse(r.data.body)), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  prepareReport(reportData) {
    const groupedData = {};
    let totalSum = 0;
    Object.keys(reportData).forEach(k => {
      let sum = 0;
      reportData[k].map(c => c.sum).forEach(s => sum += parseFloat(s,10));
      totalSum += sum;
      groupedData[k] = {
        data: reportData[k],
        sum: sum
      }
    });

    return { totalSum, groupedData };
  }

  prepareAndDownloadPdf() {
    const {vfs} = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    // pdfMake.vfs.fonts = {
    //   hebrew : {
    //     normal : 'HeeboBold.ttf',
    //     bold   : 'HeeboBlack.ttf',
    //     italics : 'HeeboBold.ttf',
    //     bolditalics : 'HeeboBold.ttf'
    //   }
    // }

    let { report } = this.state;  
    let data = Object.keys(report.groupedData).map(function(groupKey, i)
                {    
                  return ( 
                    [
                      {
                        style: 'input',
                        "dontBreakRows": true,
                        table: {
                          widths: [140,'*'],
                          heights: [20],
                          margin: [0,0,0,0],
                          unbreakable: true,
                          "dontBreakRows": true,
                            body: [
                                [
                                  {
                                    text: {text:report.groupedData[groupKey].sum,alignment:'left',bold: true},
                                    fillColor: '#94D3D2',
                                    border: [false, false, false, false],
                                    margin: [15,10]
                                  },
                                  {
                                    text: {text:groupKey.substring(0,1).toUpperCase() + groupKey.substring(1),alignment:'right',bold: true},
                                    fillColor: '#94D3D2',
                                    border: [false, false, false, false],
                                    margin: [40,10]
                                  },
                                ]
                            ]
                        }
                      },
                      report.groupedData[groupKey].data.map((category, j) => {
                        return ([
                          {
                            style: 'tableExample',
                            "dontBreakRows": true,
                            unbreakable: true,
                            table: {
                                widths: [140,'*','*','*'],
                                "dontBreakRows": true,
                                heights: [10,10],
                              body: [
                                [
                                  {
                                    text: {text:category.name,alignment:'center'},
                                    border: [false, false, false, false],
                                    fillColor: '#ffffff',
                                    margin: [5,10]
                                  },
                                  {
                                    text: {text: category.type === "credit" ? category.sum : 0 ,alignment:'center',color: '#c4c0c0'},
                                    fillColor: '#ffffff',
                                    border: [false, false, false, false],
                                    margin: [5,10]
                                  },
                                  {
                                    text: {text: category.type === "debit" ? category.sum : 0 ,alignment:'center',color: '#c4c0c0'},
                                    fillColor: '#ffffff',
							                      border: [false, false, false, false],
							                      margin: [5,10]
                                  },
                                  {
                                    text: {text:category.sum,alignment:'center'},
                                    fillColor: '#ffffff',
                                    border: [false, false, false, false],
                                    margin: [5,10]
                                  },
                                ]
                              ]
                            }
                          }
                        ])
                      }),
                      { 
                      style: 'tableExample',
                      "dontBreakRows": true,
                      table: {
                        "dontBreakRows": true,
                        widths: [140,'*','*','*'],
                        heights: [20],
                        body: [
                          [
                            {
                              text: {text:'Total '+ groupKey,alignment:'center',bold: true},
                              colSpan: 2,
                              border: [false, false, false, false],
                              margin: [5,5]
                            },
                            {
                              border: [false, false, false, false],
                              text: ''
                            },
                            {
                              border: [false, false, false, false],
                              text: ''
                            },
                            {
                              text: {text:report.groupedData[groupKey].sum,alignment:'center',color: '#796f6f',bold: true},
                              border: [false, false, false, false],
                              margin: [5,5]
                            },
                            
                          ]
                        ]
                      },
                      }, // Total
                ]
                  )
              }
    );
    pdfMake.createPdf(tbDD(data,this.state.selectedUserName,this.state.selectedTrailBalanceYear, this.state.selectedUserNID)).download(`TrialBalance - ${this.state.selectedTrailBalanceYear}.pdf`);
  }

  render() {
    const {apiCallInProgress, report, selectedUserId, selectedTrailBalanceYear} = this.state;
    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedUserId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    } else if (!report){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> No report data </Caption>);
    }

    return (
      <div className="canvas-container tb-container">
        <Grid container>
          <Grid item md={1}></Grid>
          <Grid item container md={10} >
            <Grid item md={12}>
              <Caption style={{paddingLeft: 20}}>
              {selectedTrailBalanceYear} <PdfAndExcelDownloader onPdf={() => this.prepareAndDownloadPdf()}/>
              </Caption>
              <Divider />
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={8}>
              <BootstrapTable 
                keyField='id' 
                data={[]} 
                columns={[
                  {
                    dataField: 'account',
                    text: 'Account',
                    headerClasses: 'k-header-cell',
                    classes: 'k-body-cell',
                    formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
                  },
                  {
                    dataField: 'credit',
                    text: 'Credit',
                    headerClasses: 'k-header-cell',
                    classes: 'k-body-cell',
                    formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
                  },
                  {
                    dataField: 'debit',
                    text: 'Debit',
                    headerClasses: 'k-header-cell',
                    classes: 'k-body-cell',
                    formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
                  },
                  {
                    dataField: 'balance',
                    text: 'Balance',
                    headerClasses: 'k-header-cell',
                    classes: 'k-body-cell',
                    formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
                  },
                ]} 
                bordered={false}
                headerClasses="k-header-row"
                />
               {
                Object.keys(report.groupedData).map((groupKey, i) => (
                  <ExpansionPanel key={i}>
                    <ExpansionPanelSummary>
                      <ColoredHeader rightLabel={groupKey.substring(0,1).toUpperCase() + groupKey.substring(1)} />
                    </ExpansionPanelSummary>
                    <CompactExpansionPanelDetails>
                      <InvisibleTable>
                        <TableBody>
                        {
                          report.groupedData[groupKey].data.map((category, j) => (
                            <TableRow key={j}>
                              <TableCell align="right">{category.name}</TableCell>
                              <TableCell align="right">{category.type === "credit" ? category.sum : 0 /* TODO: verify if sum is the key which has the sum for this category */}</TableCell>
                              <TableCell align="right">{category.type === "debit" ? category.sum : 0}</TableCell>
                              <TableCell align="right">{category.sum}</TableCell>
                            </TableRow>
                          ))
                        }
                          <TableRow>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">{report.groupedData[groupKey].sum}</TableCell>
                          </TableRow>
                        </TableBody>
                      </InvisibleTable>
                    </CompactExpansionPanelDetails>
                  </ExpansionPanel>
                ))
              }
           </Grid>
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(TrialBalance);