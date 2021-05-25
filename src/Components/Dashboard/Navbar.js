import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import AppRoutes from '../../Routes/AppRoutes';

import {withRouter} from 'react-router-dom';
import Auth from '../../Services/Auth'

class Navbar extends Component {

  handleClick = (path) => {
    console.log("navigating to", path);
    if(path === "/logout"){
        Auth.logout(()=> {this.props.history.push("/login")});
    }
    else{
      this.props.history.push(path);
    }
    
  }


  render(){

    return (
      <Grid item sm={12} style={{ backgroundColor : '#3794a5'}}>  {/* nav bar */}
        <MenuList style={{ marginTop: '165%'}}>
        {
          AppRoutes.map((nav, idx) => (
            <MenuItem onClick={() => this.handleClick(nav.to)} key={idx}>
              <ListItemIcon>
                {nav.icon == "logout" ? <i style={{ color: '#12495f'}} class="fa fa-sign-out" aria-hidden="true"></i> : <img src={nav.icon} alt="NA"/> }
              </ListItemIcon>
            </MenuItem>
          ))
        }
        </MenuList>
      </Grid>
    );
  }
}

export default withRouter(Navbar);