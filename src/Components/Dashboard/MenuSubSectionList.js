import React from 'react';

import {Link} from 'react-router-dom';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MuiListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

const styles = theme => ({
  root: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 200,
  },
  listItemText: {
    color: '#828389',
    fontFamily: 'Heebo',
    fontSize: 13,
    fontWeight: 400,
  }
});

const ListItem = withStyles({
  root: {
    '&$selected': { // <-- mixing the two classes
      backgroundColor: '#87dfef',
      // opacity: 0.3,
    },
    '&$selected:focus': { // <-- mixing the two classes
      backgroundColor: '#87dfef',
      // opacity: 0.3,
    }
  },
  selected: {

  }
}) (MuiListItem);

// required params = {
//   remotePath: complete URI with query params if required
//   remoteParams: params to be sent as POST request body if required
//   listItemFormatter: a function that takes and returns array of item: {label: "item name", localPath: "local path / id"}
//   
// }

class MenuSubSectionList extends React.Component {
  state = {
    selectedIndex: null,
    listData: []
  };

  componentWillReceiveProps(nextProps) {
    this.fetchListData(nextProps.remotePath);
  }

  componentDidMount() {
    this.fetchListData(this.props.remotePath);
  }

  fetchListData(remotePath) {
    if (!remotePath){
      console.log("not fetching list items", remotePath);
    } else {
      console.log("fetching list items", remotePath);
    }
    this.setState({listData: []});
    sendAuthenticatedAsyncRequest(
      remotePath,
      "POST", //TODO: take out to MenuListItems.js
      this.props.remoteParams,
      (r) => this.setState({listData: this.props.listItemFormatter(JSON.parse(r.data.body))})
    );
  }

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { classes } = this.props;
    const { listData } = this.state;

    return (
      <div className={classes.root}>
        <TextField
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          }}
        />
        {
          listData.length !== 0
          ? <List component="nav">
            {listData.map((item,idx) => (
              <span key={`item--${idx}`}>
                <ListItem
                  component={Link}
                  to={item.path}
                  button 
                  selected={this.state.selectedIndex === item}
                  onClick={event => this.handleListItemClick(event, idx)}  
                >
                  <ListItemText className={classes.listItemText} disableTypography={true} primary={item.label} />
                </ListItem>
                {idx === listData.length - 1 ? null : <Divider />}
              </span>
            ))}
          </List>
          : <p>Loading data ...</p>
        }
        
      </div>
    );
  }
}

export default withStyles(styles)(MenuSubSectionList);