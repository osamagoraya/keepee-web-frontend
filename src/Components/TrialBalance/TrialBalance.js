import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';

import './TrialBalance.css'
import Caption from '../Common/Caption';
import Divider from '../Common/Divider';
import ColoredHeader from '../Common/ColoredHeader';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary} from '../Common/ExpansionPanel';
import {BootstrapTable} from '../Common/Table';
import {InvisibleTable, TableBody, TableCell, TableRow} from '../Common/InvisibleTable';

class TrialBalance extends Component {

  state = {
    selectedTbId: this.props.match.params.tbId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: 1, //TODO: this.props.selectedUserId
  }

  componentDidMount() {
    this.fetchPnlReport(this.state.selectedTbId, this.state.selectedUserId);
  }
  
  componentWillReceiveProps(nextProps) {
    const {tbId} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    console.log("props received", tbId, selectedUserId)
    if (tbId !== this.state.selectedItaId || selectedUserId !== this.state.selectedUserId){
      console.log("updating state of ITA", tbId, selectedUserId)
      this.setState({
        selectedTbId: tbId,
        selectedUserId: selectedUserId
      });
      this.fetchPnlReport(tbId, selectedUserId);
    }
  }

  fetchPnlReport(tbId, selectedUserId) {
    // TODO: remove from here
    this.setState({
      apiCallInProgress: false, 
      apiCallType: 'none', 
      report: {
        id: tbId, 
        year: "2019"
      }
    });
    
    return;
    // remove till here

    if ( !tbId || !selectedUserId) {
      console.log("Incomplete information to fetch the TB report", tbId, selectedUserId);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getTrialBalanceReport",
      "POST", 
      {userId: selectedUserId, trialBalanceId: tbId},
      (r) => {
        console.log("response received TB", r);
        this.setState({report: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  render() {
    const {apiCallInProgress, report, selectedUserId} = this.state;
    console.log("Rendering TB report",apiCallInProgress, report, selectedUserId);
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
              <Caption style={{paddingLeft: 20}}>{report.year}</Caption>
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
              <ExpansionPanel>
                <ExpansionPanelSummary>
                  <ColoredHeader leftLabel="770" rightLabel="Banks" />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel>
                <ExpansionPanelSummary>
                  <ColoredHeader leftLabel="960" rightLabel="Income" />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(TrialBalance);