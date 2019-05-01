import React from 'react';

import {Link} from 'react-router-dom';

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
      opacity: 0.3,
    },
    '&$selected:focus': { // <-- mixing the two classes
      backgroundColor: '#87dfef',
      opacity: 0.3,
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
    listData: this.props.listData
  };

  componentWillReceiveProps(nextProps) {
    // console.log("MenuSubSectionList received props", nextProps)
    this.setState({listData: nextProps.listData});
  }

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };

  filter = (e) => {
    const {value} = e.target;
    const {listData} = this.state;
    listData.forEach(item => item.rawLabel.indexOf(value) >= 0 ? item.hide = false : item.hide = true)
    this.setState({listData});
  }

  render() {
    const { classes } = this.props;
    const { listData } = this.state;

    // console.log("rendering MenuSubSectionList", listData);

    return (
      <div className={classes.root}>
        <TextField
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          }}
          onChange={this.filter}
        />
        {
          listData.length !== 0
          ? <List component="nav">
            {listData.map((item,idx) => ( 
              !item.hide 
              ? 
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
              : null
            ))}
          </List>
          : <p>Nothing new here</p>
        }
        
      </div>
    );
  }
}

export default withStyles(styles)(MenuSubSectionList);