import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import MenuListItems from '../../Lookup/MenuListItems';
import MenuSubSectionList from './MenuSubSectionList';
import MenuSubSectionFilters from './MenuSubSectionFilters';

const ExpansionPanel = withStyles({
  root: {
    color: '#4d4f5c',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontWeight: 700,
    // border: '1px solid rgba(0,0,0,.125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: 'auto',
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,.03)',
    borderBottom: '1px solid rgba(0,0,0,.125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: "0 14.15% 1.6% 14.15%",
    backgroundColor: '#f5f4f4',
  },
}))(MuiExpansionPanelDetails);

class MenuItems extends React.Component {
  state = {
    expanded: '',
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { expanded } = this.state;
    return (
      <div style={{ marginTop: '45%', width: "100%"}}>
      {
        MenuListItems.map((item, idx) => (
          <ExpansionPanel
            key={idx}
            square
            expanded={expanded === idx}
            onChange={this.handleChange(idx)}
          >
            <ExpansionPanelSummary>
              {item.label}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {
                item.subSectionType === "list" 
                ? <MenuSubSectionList listItems={expanded === idx ? [1,2,3] : null} />
                : <MenuSubSectionFilters />
              }
              
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))
      }
      </div>
    );
  }
}

export default MenuItems;