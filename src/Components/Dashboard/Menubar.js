import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import MenuListItems from '../../Lookup/MenuListItems';
import MenuSubSectionList from './MenubarItems/MenuSubSectionList';
import MenuSubSectionFilters from './MenubarItems/MenuSubSectionFilters';
import InvoiceMenubarItems from './MenubarItems/InvoiceMenubarItems';


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


class Menubar extends Component {
  state = {
    selectedMenuItem: this.props.location.pathname, //TODO: fix this
    selectedUserId: this.props.selectedUserId
  };
  
  componentWillReceiveProps(nextProps) {
    if (this.state.selectedUserId !== nextProps.selectedUserId)
      this.setState({selectedUserId: nextProps.selectedUserId})
  }

  isSelected(path) {
    return this.state.selectedMenuItem.indexOf(path) !== -1;
  }
  
  handleChange = (localPath) => (event, expanded) => {
    this.setState({
      selectedMenuItem: expanded ? localPath : "/",
    });
    if (expanded)
      this.props.history.push(localPath);
    else
      this.props.history.push("/");
  };

  render() {
    const { selectedUserId } = this.state;
    console.log("rendeing menubar", this.state);
    return (
      <div style={{ marginTop: '45%', width: "100%"}}>
      {/* TODO: map over list with items : {localRoute: "/invoice", component, isUserRequired} */}
      <ExpansionPanel
        square
        expanded={this.isSelected("/invoice")}
        onChange={this.handleChange("/invoice")}
        >
          <ExpansionPanelSummary>
            Invoices
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <InvoiceMenubarItems selectedUserId={selectedUserId}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      {
        MenuListItems.map((item, idx) => (
          <ExpansionPanel
            key={idx}
            square
            expanded={this.isSelected(item.localBasePath)}
            onChange={this.handleChange(item.localBasePath)}
          >
            <ExpansionPanelSummary>
              {item.label}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {
                item.isSubsectionList
                ? this.isSelected(item.localBasePath)
                  ? (item.isSelectedUserIdRequired && selectedUserId) || !item.isSelectedUserIdRequired
                    ? <MenuSubSectionList 
                      remotePath={item.remotePath}
                      remoteParams={{userID: selectedUserId}} //TODO: move to lookup
                    />
                    : "no user id"
                  : "no body"
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


// const styles = {
//   menubarItem : {
//     height: 20,
//     color: '#4d4f5c',
//     fontFamily: 'Source Sans Pro',
//     fontSize: 13,
//     fontWeight: 700,
//     lineHeight: 20,
//   }
// }
export default (withRouter(Menubar));