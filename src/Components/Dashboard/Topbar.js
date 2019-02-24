import React from 'react';
import {Grid} from '@material-ui/core';
import PrimarySearchAppBar from '../PrimarySearchAppBar';

class Topbar extends React.Component {
  render(){
    return (
      <Grid item sm={12} style={{ height: '10vh'}}>
          <PrimarySearchAppBar />
      </Grid >
    );
  }
}

export default Topbar;