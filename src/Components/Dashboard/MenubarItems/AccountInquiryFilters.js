import React from 'react';

import Grid from '@material-ui/core/Grid';
import Select from '../../Common/Select';
import TransparentTextField from '../../Common/TransparentTextField';

const style = {
  accountInquiryContainer: {
    color: '#828389',
    fontFamily: 'Heebo',
    fontSize: 13,
    fontWeight: 300,
    fontStyle: 'italic'
  },
  label: {
    color: "rgba(0, 0, 0, 0.54)",
    padding: 0,
    fontSize: "0.7rem",
    lineHeight: 1,
    display: "inline-block",
    fontWeight: 300,
    fontStyle: "italic",
  }
}

const KLabel = (props) => (
  <div style={style.label}>
    {props.children}
  </div>
);

class MenuSubSectionFilters extends React.Component {

  render (){
    return (
      <Grid container style={style.accountInquiryContainer}>
        <Grid item md={12}>
          Categories
        </Grid>
        <Grid item md={12} >
          <KLabel>From</KLabel>
          <Select transparent placeholder="" />
          <KLabel>To</KLabel>
          <Select transparent placeholder="" />
        </Grid>
        
        <Grid item md={12} style={{marginTop: 10}}>
          Dates
        </Grid>
        <Grid item md={12} style={{marginTop: 4}}>
          <KLabel>From</KLabel>
          <TransparentTextField
            type="date"
            placeholder="Date"
            fullWidth
            label="From"
            />
        </Grid>
        <Grid item md={12} style={{marginTop: 4}}>
          <KLabel>To</KLabel>
          <TransparentTextField
            type="date"
            placeholder="Date"
            fullWidth
            label="To"
            />
        </Grid>

      </Grid>
    );
  }
}

export default MenuSubSectionFilters;