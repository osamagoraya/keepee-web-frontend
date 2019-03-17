import React, { Component } from 'react';

import './Vat.css'
import Grid from '@material-ui/core/Grid';


import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import GreenHeader from '../Common/GreenHeader';
import Button from '../Common/Button';
import {InvisibleTable, TableBody, TableHead, TableCell, TableRow} from '../Common/InvisibleTable';

class Vat extends Component {

  state = {
    // selectedBatchId: this.props.match.params.batchId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    data: {

    }
  }

  componentDidMount() {
    // this.fetchVatReport({});
  }
  
  componentWillReceiveProps(nextProps) {
    // this.fetchVatReport({});
  }

  fetchVatReport(filters) {
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/report/vat",
      "POST", 
      {filters: filters},
      (r) => this.setState({report: r.data, apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  render() {
    // const {apiCallInProgress, apiCallType} = this.state;

    return (
      <div className="canvas-container ">
        <Grid container>
          <Grid item md={2}></Grid>
          <Grid item container md={8} className="vat-container">
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
                    <TableCell align="right">0</TableCell>
                    <TableCell align="center">0</TableCell>
                    <TableCell align="right">Deals 17%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right">0</TableCell>
                    <TableCell align="center">0</TableCell>
                    <TableCell align="right">Deals 18%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right">0</TableCell>
                    <TableCell align="center">0</TableCell>
                    <TableCell align="right">Deals 0%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"> <strong>Total tax 0</strong></TableCell>
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
                    <TableCell align="right">0</TableCell>
                    <TableCell align="center">0</TableCell>
                    <TableCell align="center">0</TableCell>
                    <TableCell align="right">Deals 17%</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"><strong>Total input 0</strong></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="right"><strong>Total 0</strong></TableCell>
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


export default Vat;