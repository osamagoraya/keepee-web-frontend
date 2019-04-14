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
    selectedPnlYear: this.props.match.params.pnlYear,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: 1, //TODO: this.props.selectedUserId
  }

  componentDidMount() {
    this.fetchPnlReport(this.state.selectedPnlYear, this.state.selectedUserId);
  }
  
  componentWillReceiveProps(nextProps) {
    const {pnlYear} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    console.log("props received", pnlYear, selectedUserId)
    if (pnlYear !== this.state.selectedItaId || selectedUserId !== this.state.selectedUserId){
      console.log("updating state of ITA", pnlYear, selectedUserId)
      this.setState({
        selectedPnlYear: pnlYear,
        selectedUserId: selectedUserId
      });
      this.fetchPnlReport(pnlYear, selectedUserId);
    }
  }

  fetchPnlReport(pnlYear, selectedUserId) {

    if ( !pnlYear || !selectedUserId) {
      console.log("Incomplete information to fetch the PNL report", pnlYear, selectedUserId);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/profitAndLossReport",
      "POST", 
      {userId: selectedUserId, reportYear: pnlYear},
      (r) => {
        console.log("response received PNL", r);
        this.setState({report: this.prepareReport(JSON.parse(r.data.body)), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  // JE.category_id, C.name , "group", SUM ( JE.Sum) 
  prepareReport(reportData) {
    const groupedData = {};
    let totalSum = 0;
    reportData.forEach(r => {
      if (!groupedData[r.group])
        groupedData[r.group] = { sum: 0, data: [] };

      groupedData[r.group].data.push(r);
      groupedData[r.group].sum += r.sum; //TODO: verify if sum is the name of field which has category sum
      // calculating total sum
      totalSum += r.sum;
    })
    return { totalSum, groupedData };
  }

  render() {
    const {apiCallInProgress, report, selectedUserId, selectedPnlYear} = this.state;
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
              <Caption style={{paddingLeft: 20}}>{selectedPnlYear}</Caption>
              <Divider />
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={8}> 
              {
                Object.keys(report.groupedData).map((groupKey, i) => (
                  <ExpansionPanel key={i}>
                    <ExpansionPanelSummary>
                      <ColoredHeader rightLabel={groupKey} />
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <InvisibleTable>
                        <TableBody>
                        {
                          report.groupedData.groupKey.data.map((category, j) => (
                            <TableRow key={j}>
                              <TableCell align="right">{category.sum /* TODO: verify if sum is the key which has the sum for this category */}</TableCell>
                              <TableCell align="right">{category.name}</TableCell>
                            </TableRow>
                          ))
                        }
                          <TableRow >
                            <TableCell align="right">{report.groupedData.groupKey.sum}</TableCell>
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