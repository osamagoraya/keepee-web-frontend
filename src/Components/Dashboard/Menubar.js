import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import AppRoutes from '../../Routes/AppRoutes';


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
    selectedRoute: this.props.location.pathname, 
    selectedUserId: this.props.selectedUserId
  };
  
  componentWillReceiveProps(nextProps) {
    if (this.state.selectedUserId !== nextProps.selectedUserId)
      this.setState({selectedUserId: nextProps.selectedUserId})
  }

  isSelected(path) {
    return this.state.selectedRoute.indexOf(path) !== -1;
  }
  
  handleChange = (localPath) => (event, expanded) => {
    this.setState({
      selectedRoute: expanded ? localPath : this.getBasePath(),
    });
    if (expanded)
      this.props.history.push(localPath);
    else
      this.props.history.push(this.getBasePath());
  };

  getBasePath(){
    const currentPath = this.props.location.pathname;
    const indexOfNextSlash = currentPath.indexOf("/", 1);
    return indexOfNextSlash !== -1 ? currentPath.substr(0, indexOfNextSlash) : currentPath;
  }

  render() {
    const { selectedUserId } = this.state;
    
    const basePath = this.getBasePath();
    // console.log("rendeing menubar", this.state);
    return (
      <div style={{ marginTop: '45%', width: "100%"}}>
      {
        AppRoutes.map((route, idx) => {
          if (route.to === basePath) {
            return route.menubarItems.map((item, midx) => (
              <ExpansionPanel
                square
                expanded={this.isSelected(item.path)}
                onChange={this.handleChange(item.path)}
                key={midx}
                >
                  <ExpansionPanelSummary>
                    {item.label}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <item.component selectedUserId={selectedUserId} />
                  </ExpansionPanelDetails>
              </ExpansionPanel>
            ))
          } else 
            return null;
        })
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