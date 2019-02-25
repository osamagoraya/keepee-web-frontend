import React from 'react';
import {Grid} from '@material-ui/core';
// import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SvgIcon from '@material-ui/core/SvgIcon';

class Navbar extends React.Component {
  render(){
    return (
      <Grid item sm={2} style={{ backgroundColor : '#3794a5'}}>  {/* nav bar */}
            <Grid container direction="column">
                <Grid item  style={{ alignItems: 'center'}}>
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="Delete">
                        <SvgIcon>
                            <path id="9oxda" d="M36.65 262.724h-.008a4.28 4.28 0 0 1 1.267 3.037v.409H25.345v-.409c0-1.181.486-2.256 1.27-3.037a4.273 4.273 0 0 1 3.034-1.263h3.956c1.185 0 2.26.486 3.044 1.263zm-1.927-10.094a4.36 4.36 0 0 1 1.287 3.1c0 1.21-.49 2.307-1.287 3.098a4.35 4.35 0 0 1-3.098 1.285c-1.213 0-2.31-.49-3.098-1.281v-.004a4.386 4.386 0 0 1 0-6.199 4.39 4.39 0 0 1 6.202 0zm-7.146-.951a5.697 5.697 0 0 0-1.675 4.052 5.697 5.697 0 0 0 2.278 4.577 5.641 5.641 0 0 0-2.523 1.465A5.615 5.615 0 0 0 24 265.761v1.083c0 .369.298.674.674.674h13.909c.373 0 .67-.305.67-.674v-1.083a5.63 5.63 0 0 0-1.656-3.988h-.007a5.652 5.652 0 0 0-2.513-1.465c.213-.16.416-.337.6-.525a5.7 5.7 0 0 0 1.678-4.052 5.7 5.7 0 0 0-1.678-4.052 5.727 5.727 0 0 0-8.1 0z"/>
                        </SvgIcon>
                    </IconButton>

                </Grid>
            </Grid>
      </Grid>
    );
  }
}

export default Navbar;