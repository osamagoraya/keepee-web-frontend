import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import {InvisibleTable, TableBody, TableCell, TableRow} from '../Common/InvisibleTable';
import './IncomeTaxAdvances.css'
import Caption from '../Common/Caption';
import Divider from '../Common/Divider';

class IncomeTaxAdvances extends Component {

  state = {
    selectedItaId: this.props.match.params.itaId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: this.props.selectedUserId
  }

  componentDidMount() {
    this.fetchItaReport(this.state.selectedItaId, this.state.selectedUserId);
  }
  
  componentWillReceiveProps(nextProps) {
    const {itaId} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    console.log("props received", itaId, selectedUserId)
    if (itaId !== this.state.selectedItaId || selectedUserId !== this.state.selectedUserId){
      console.log("updating state of ITA", itaId, selectedUserId)
      this.setState({
        selectedItaId: itaId,
        selectedUserId: selectedUserId
      });
      this.fetchItaReport(itaId, selectedUserId);
    }
  }

  fetchItaReport(itaId, selectedUserId) {
    return;
    if ( !itaId || !selectedUserId) {
      console.log("Incomplete information to fetch the ITA report", itaId, selectedUserId);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getVatReport",
      "POST", 
      {userId: selectedUserId, incomeTaxReportId: itaId},
      (r) => {
        console.log("response received ITA", r);
        this.setState({report: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  render() {
    const {apiCallInProgress, report, selectedUserId} = this.state;
    console.log("Rendering ITA report",apiCallInProgress, report, selectedUserId);
    // if (apiCallInProgress){
    //   return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    // } else if (!selectedUserId) {
    //   return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    // } else if (!report){
    //   return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> No report data </Caption>);
    // }

    const CustomChip = (props) => <Chip style={{color: "#827978", fontWeight: 600, marginLeft: 15}} label={props.label} as="div" />;
    return (
      <div className="canvas-container ita-container">
        <Grid container>
          <Grid item md={2}></Grid>
          <Grid item container md={8} >
            <Grid item md={12}>
              <Caption style={{paddingLeft: 20}}>04.2019</Caption>
              <Divider />
              {/* <hr /> */}
            </Grid>
            <Grid item md={12}> 
              <InvisibleTable>
              <TableBody>
                <TableRow spacey>
                  <TableCell align="right">{0}</TableCell>
                  <TableCell align="right">Business Cycle <CustomChip label="a" /></TableCell>
                  <TableCell align="right">{0}</TableCell>
                  <TableCell align="right">Advance by Business Cycle %<CustomChip label="d" /></TableCell>
                </TableRow>
                <TableRow spacey>
                  <TableCell align="right">{0}</TableCell>
                  <TableCell align="right">Witholding Tax <CustomChip label="b" /></TableCell>
                  <TableCell align="right">{0}</TableCell>
                  <TableCell align="right">Witholding Tax by Advances <CustomChip label="e" /></TableCell>
                </TableRow>
                <TableRow spacey>
                  <TableCell align="right">{0}</TableCell>
                  <TableCell align="right">Advances <CustomChip label="c" /></TableCell>
                  <TableCell align="right">{0}</TableCell>
                  <TableCell align="right">Total Payment <CustomChip label="f" /></TableCell>
                </TableRow>
              </TableBody>
              </InvisibleTable>
            </Grid>
          </Grid>
          <Grid item md={2}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(IncomeTaxAdvances);