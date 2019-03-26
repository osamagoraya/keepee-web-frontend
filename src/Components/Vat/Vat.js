import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import GreenHeader from '../Common/GreenHeader';
import Button from '../Common/Button';
import {InvisibleTable, TableBody, TableHead, TableCell, TableRow} from '../Common/InvisibleTable';
import './Vat.css'
import Caption from '../Common/Caption';

class Vat extends Component {

  state = {
    selectedVatId: this.props.match.params.vatId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    selectedUserId: this.props.selectedUserId
  }

  componentDidMount() {
    this.fetchVatReport(this.state.selectedVatId, this.state.selectedUserId);
  }
  
  componentWillReceiveProps(nextProps) {
    const {vatId} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    console.log("props received", vatId, selectedUserId)
    if (vatId !== this.state.selectedVatId || selectedUserId !== this.state.selectedUserId){
      console.log("updating state of vat", vatId, selectedUserId)
      this.setState({
        selectedVatId: vatId,
        selectedUserId: selectedUserId
      });
      this.fetchBatchDetails(vatId, selectedUserId);
    }
  }

  fetchVatReport(vatId, selectedUserId) {
    if ( !vatId || !selectedUserId) {
      console.log("Incomplete information to fetch the VAT report", vatId, selectedUserId);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getVatReport",
      "POST", 
      {userId: selectedUserId, vatReportId: vatId},
      (r) => {
        console.log("response received VAT", r);
        this.setState({report: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => this.setState({apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  render() {
    const {apiCallInProgress, report, selectedUserId} = this.state;
    console.log("Rendering vat report",apiCallInProgress, report, selectedUserId);
    if (apiCallInProgress){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Loading ... </Caption>);
    } else if (!selectedUserId) {
      return (<Caption style={{ marginLeft: '60px', marginTop: '10px', }}> Selecting a user is mandatory </Caption>);
    } else if (!report){
      return ( <Caption style={{ marginLeft: '60px', marginTop: '10px', }}> No report data </Caption>);
    }
    const field1 = Math.round(parseFloat(report.deal_zero));
    const field2 = Math.round(parseFloat(report.deal_seventeen));
    const field3 = Math.round(parseFloat(report.deal_seventeen_tax));
    const field4 = Math.round(((field2 * 0.17) - field3).toFixed(2));
    const field5 = Math.round(parseFloat(report.equipment_deal));
    const field6 = Math.round(parseFloat(report.others_deal));
    const field7 = Math.round((field3 - (field5 + field6)).toFixed(2));

    return (
      <div className="canvas-container vat-container">
        <Grid container>
          <Grid item md={2}></Grid>
          <Grid item container md={8} >
            <Grid item md={12}> 
              <GreenHeader rightLabel="Deals"/>
                <InvisibleTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Deals Tax</TableCell>
                    <TableCell align="center">Deals (No VAT)</TableCell>
                    <TableCell align="right">Tax Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow >
                    <TableCell align="right">{field3}</TableCell>
                    <TableCell align="center">{field2}</TableCell>
                    <TableCell align="right">Deals 17%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right">0</TableCell>
                    <TableCell align="center">0</TableCell>
                    <TableCell align="right">Deals 18%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right">0</TableCell>
                    <TableCell align="center">{field1}</TableCell>
                    <TableCell align="right">Deals 0%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"> <strong>Total tax {field3}</strong></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableBody>
                </InvisibleTable>
            </Grid>            
            <Grid item md={12} style={{marginTop: "2%"}}> 
              <GreenHeader rightLabel="Input"/>
                <InvisibleTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Tax Input</TableCell>
                    <TableCell align="center">Others</TableCell>
                    <TableCell align="center">Equipment</TableCell>
                    <TableCell align="right">Tax Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow >
                    <TableCell align="right">{field5 + field6}</TableCell>
                    <TableCell align="center">{field6}</TableCell>
                    <TableCell align="center">{field5}</TableCell>
                    <TableCell align="right">Deals 17%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"><strong>Total input {field5 + field6}</strong></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"><strong>Total {field7}</strong></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableBody>
                </InvisibleTable>
            </Grid>            
            <Grid item md={12} container spacing={24} style={{marginTop: "2%"}}>
              <Grid item md={2}><Button variant="blue" className="vat-button" size="small">Confirm</Button></Grid>
              <Grid item md={2}><Button variant="red" className="vat-button" size="small">Cancel</Button></Grid>
            </Grid> 
          </Grid>
          <Grid item md={2}></Grid>
        </Grid>
      </div>
    );
  }
}


export default withRouter(Vat);