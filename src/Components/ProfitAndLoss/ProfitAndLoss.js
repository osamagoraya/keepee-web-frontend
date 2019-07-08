import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';

import './ProfitAndLoss.css'
import Caption from '../Common/Caption';
import Divider from '../Common/Divider';
import ColoredHeader from '../Common/ColoredHeader';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary} from '../Common/ExpansionPanel';
import {InvisibleTable, TableBody, TableCell, TableRow} from '../Common/InvisibleTable';
import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import {PnlDD} from '../../Reports/PnlReport';
import PdfAndExcelDownloader from '../Common/PdfAndExcelDownloader';

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

    let writeTextToDataURL = function(text, color='black', top=1, bottom=13, size = "1px Roboto, sans-serif", height = 3, width = 100)
  {
    var x = document.createElement("CANVAS");
    var context = x.getContext("2d");
  
    x.height = height;
    x.width = width;
  
  
    context.fillStyle = color;
    context.font = size;
    context.textBaseline = "top";
    context.beginPath();
    context.fillText(text, top, bottom,700);
    context.scale(2, 2)
    context.closePath();
    context.fill();
  
  
    return x.toDataURL();
  }

    let { report } = this.state;  
    let data = Object.keys(report.groupedData).map(function(groupKey, i)
                {    
                  return ( 
                    [
                      {
                        style: 'input',
                        table: {
                            widths: ['*'],
                            heights: [20],
                            margin: [0,0,0,0],
                            body: [
                                [
                                    {
                                        image: writeTextToDataURL(groupKey.substring(0,1).toUpperCase() + groupKey.substring(1),'black', 1, 1, "bold 12px Heebo", 20,220),
                                        fillColor: '#94D3D2',
                                        border: [false, false, false, false],
                                        margin: [
                                                groupKey   == "income" ? -55 : groupKey   == "cost of sale" ?   -47  :
                                                groupKey   == "other expenses" ? -40    : 
                                                groupKey   == "finance" ?   -55  : 0 , 10
                                              ],
                                        alignment: 'right'
                                    },
                                ]
                            ]
                        }
                      },
                      report.groupedData[groupKey].data.map((category, j) => {
                        return ([
                          {
                            style: 'tableExample',
                            table: {
                                widths: [40,'*','*','*'],
                                heights: [10,10],
                                dontBreakRows: true,
                              body: [
                                [
                                  {
                                    border: [false, false, false, false],
                                    text : ''
                                  },
                                  {
                                    text: {text:Math.round(category.sum),alignment:'center',color: '#c4c0c0'},
                                    fillColor: '#ffffff',
                                    border: [false, false, false, true],
                                    margin: [5,5]
                                  },
                                  {
                                    image: writeTextToDataURL(category.name,'black', 1, 1, "12px Heebo", 20,220),
                                    alignment:'center',
                                    colSpan: 2,
                                    border: [false, false, false, false],
                                    margin: [5,5]
                                  },
                                  {
                                    
                                  },
                                  
                                ]
                              ]
                            }
                          }
                        ])
                      }),
                      { 
                      style: 'tableExample',
                      table: {
                          widths: [40,'*','*','*'],
                          heights: [10,10],
                        body: [
                          [
                            {
                              border: [false, false, false, false],
                              text : ''
                            },
                            {
                              text: {text:report.groupedData[groupKey].sum,alignment:'center',color: '#796f6f',bold: true},
                              border: [false, false, false, false],
                              margin: [5,5]
                            },
                            {
                              image: writeTextToDataURL('סך הכל','black', 1, 1, "12px Heebo", 20,220),
                              alignment:'center',
                              colSpan: 2,
                              border: [false, false, false, false],
                              margin: [5,5]
                            },
                            {
                              
                            },
                            
                          ]
                        ]
                      },
                      }, // Total
                ]
                  )
              }
    );
    pdfMake.createPdf(PnlDD(data, this.state.selectedUserName, this.state.selectedPnlYear, this.state.selectedUserNID)).download(`ProfitnLoss - ${this.state.selectedPnlYear}.pdf`);
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
              {selectedPnlYear} <PdfAndExcelDownloader onPdf={() => this.prepareAndDownloadPdf()}/>
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