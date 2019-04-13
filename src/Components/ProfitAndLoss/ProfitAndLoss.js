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

class ProfitAndLoss extends Component {

  state = {
    selectedPnlId: this.props.match.params.pnlId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: 1, //this.props.selectedUserId
  }

  componentDidMount() {
    this.fetchPnlReport(this.state.selectedPnlId, this.state.selectedUserId);
  }
  
  componentWillReceiveProps(nextProps) {
    const {pnlId} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    console.log("props received", pnlId, selectedUserId)
    if (pnlId !== this.state.selectedItaId || selectedUserId !== this.state.selectedUserId){
      console.log("updating state of ITA", pnlId, selectedUserId)
      this.setState({
        selectedPnlId: pnlId,
        selectedUserId: selectedUserId
      });
      this.fetchPnlReport(pnlId, selectedUserId);
    }
  }

  fetchPnlReport(pnlId, selectedUserId) {
    // remove from here
    this.setState({
      apiCallInProgress: false, 
      apiCallType: 'none', 
      report: {
        id: pnlId, 
        year: "2019",
        incomeFromServices: 500,
        freeTaxIncomes: 230
      }
    });
    
    return;
    // remove till here

    if ( !pnlId || !selectedUserId) {
      console.log("Incomplete information to fetch the PNL report", pnlId, selectedUserId);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getProfileAndLossReport",
      "POST", 
      {userId: selectedUserId, profitAndLossId: pnlId},
      (r) => {
        console.log("response received PNL", r);
        this.setState({report: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  render() {
    const {apiCallInProgress, report, selectedUserId} = this.state;
    console.log("Rendering PNL report",apiCallInProgress, report, selectedUserId);
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
              <Caption style={{paddingLeft: 20}}>{report.year}</Caption>
              <Divider />
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={8}> 
              <ExpansionPanel>
                <ExpansionPanelSummary>
                  <ColoredHeader rightLabel="Income" />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <InvisibleTable>
                    <TableBody>
                      <TableRow >
                        <TableCell align="right">{report.incomeFromServices}</TableCell>
                        <TableCell align="right">Income From Services</TableCell>
                      </TableRow>
                      <TableRow >
                        <TableCell align="right">{report.freeTaxIncomes}</TableCell>
                        <TableCell align="right">Free Tax Incomes</TableCell>
                      </TableRow>
                      <TableRow >
                        <TableCell align="right">{report.incomeFromServices + report.freeTaxIncomes}</TableCell>
                        <TableCell align="right"><strong>Total Income</strong></TableCell>
                      </TableRow>
                    </TableBody>
                    </InvisibleTable>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel>
                <ExpansionPanelSummary>
                  <ColoredHeader rightLabel="Sales Expense" />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel>
                <ExpansionPanelSummary>
                  <ColoredHeader rightLabel="General Expense" />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ColoredHeader rightLabel="Total" variant="grey" style={{marginTop: "12px"}}/>
            </Grid>
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(ProfitAndLoss);