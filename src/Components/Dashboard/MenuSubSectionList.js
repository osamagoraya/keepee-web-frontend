import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MuiListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

import {Link} from 'react-router-dom';

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

class MenuSubSectionList extends React.Component {
  state = {
    selectedIndex: 0,
  };

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { classes, listItems } = this.props;

    return (
      <div className={classes.root}>
        <TextField
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          }}
        />
        {
          listItems 
          ? <List component="nav">
            {this.props.listItems.map((item,idx) => (
              <span key={`item--${idx}`}>
                <ListItem
                  component={Link}
                  to="/"
                  button 
                  selected={this.state.selectedIndex === item}
                  onClick={event => this.handleListItemClick(event, item)}  
                >
                  <ListItemText className={classes.listItemText} disableTypography={true} primary="Image Name" />
                </ListItem>
                {idx === this.props.listItems.length - 1 ? null : <Divider />}
              </span>
            ))}
          </List>
          : "Loading ... "
        }
        
      </div>
    );
  }
}

export default withStyles(styles)(MenuSubSectionList);