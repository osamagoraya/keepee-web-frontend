import React from 'react';
import {Grid} from '@material-ui/core';

class Navbar extends React.Component {
  render(){
    return (
      <Grid item sm={2} style={{ backgroundColor : '#3794a5'}}>  {/* nav bar */}
            <Grid container direction="column">
            </Grid>
      </Grid>
    );
  }
}

export default Navbar;