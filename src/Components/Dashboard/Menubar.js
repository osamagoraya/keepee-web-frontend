import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Moment from 'moment';

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

const invoiceListItemFormatter = (localPath) => (data) => {
  if (!data) return [];

  const imageId = (imageName) => {
    let parts = imageName.split('/');
    return parts[parts.length - 1];
  }

  const imageName = (imageName) => {
    return Moment(`${imageId(imageName)}`,'x').format("MM.DD.YY")
  }

  console.log("ADSASD",data);
  return data.map(image => ({
      label: imageName(image.ImageID),
      path: `${localPath}/${imageId(image.ImageID)}/${image.FileType}`
    })
  );
}

class Menubar extends Component {
  state = {
    selectedMenuItem: this.props.location.pathname, //TODO: fix this
    selectedUserId: this.props.selectedUserId
  };

  isSelected(path) {
    return this.state.selectedMenuItem.indexOf(path) !== -1;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.selectedUserId !== nextProps.selectedUserId)
      this.setState({selectedUserId: nextProps.selectedUserId})
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
    console.log("menubar", this.state);
    return (
      <div style={{ marginTop: '45%', width: "100%"}}>
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
                      listItemFormatter={(invoiceListItemFormatter(item.localBasePath))} //TODO: move to lookup
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