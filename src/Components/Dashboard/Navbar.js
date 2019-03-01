import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import logoReport from '../../Assets/Images/Path_900.svg';
import logoCalender from '../../Assets/Images/Path_899.svg';
import logoDocument from '../../Assets/Images/Path_901.svg';
import logoUser from '../../Assets/Images/Path_902.svg';
import logoSettings from '../../Assets/Images/Path_1054.svg'


class Navbar extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedUserID: this.props.users,
        }
    }

    handleReportClick = () => {
        console.log(this.state.selectedUserID)
    }

    handleSettingClick = () => {
        console.log('Setting clicked');
    }

    handleUserClick = () => {
        console.log('User Clicked');
    }

    handleDocClick = () => {
        console.log('Doc clicked');
    }

    handleCalenderClick = () => {
        console.log('Calender Clicked');
    }


  render(){
      let userList
      if (this.props.userList) {
          userList =
              <ol>
                  {
                      this.props.renderUserListRow()
                  }
              </ol>

      } else {
          userList = "Loading"
      }
    return (
      <Grid item sm={12} style={{ backgroundColor : '#3794a5'}}>  {/* nav bar */}
        <MenuList style={{ marginTop: '165%'}}>
           <MenuItem onClick={this.handleReportClick}>
               <ListItemIcon>
                   <img src={logoReport} alt="Not Found"/>
               </ListItemIcon>
           </MenuItem>
            <MenuItem onClick={this.handleCalenderClick}>
                <ListItemIcon>
                    <img src={logoCalender} alt="Not Found"/>
                </ListItemIcon>
            </MenuItem>
           <MenuItem onClick={this.handleDocClick}>
               <ListItemIcon>
                   <img src={logoDocument} alt="Not Found"/>
               </ListItemIcon>
           </MenuItem>
            <MenuItem onClick={this.handleUserClick}>
                <ListItemIcon  style={{ marginLeft: '5%'}}>
                    <img src={logoUser} alt="Not Found"/>
                </ListItemIcon>
            </MenuItem>
            <MenuItem onClick={this.handleSettingClick}>
                <ListItemIcon style={{ marginLeft: '-23%'}}>
                    <img src={logoSettings} alt="Not Found"/>
                </ListItemIcon>
            </MenuItem>
        </MenuList>
      </Grid>
    );
  }
}

export default Navbar;