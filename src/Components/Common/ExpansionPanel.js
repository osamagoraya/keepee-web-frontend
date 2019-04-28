import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

export const ExpansionPanel = withStyles({
  root: {
    color: '#4d4f5c',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontWeight: 700,
    // border: '1px solid rgba(0,0,0,.125)',
    minHeight: "40px !important",
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

export const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,.03)',
    borderBottom: 'none',
    minHeight: 40,
    padding: 0,
    '&$expanded': {
      minHeight: 40,
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

export const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: "0 14.15% 1.6% 14.15%",
    backgroundColor: 'rgba(0,0,0,.03)',
  },
}))(MuiExpansionPanelDetails);

export const CompactExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: "0",
    backgroundColor: 'rgb(248, 248, 248)',
  },
}))(MuiExpansionPanelDetails);
