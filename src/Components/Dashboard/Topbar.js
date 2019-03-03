import React from 'react';

import Axios from "axios";

import Select from 'react-select';
// import {Grid} from '@material-ui/core';
// import PrimarySearchAppBar from '../PrimarySearchAppBar';

import SearchIcon from '../../Assets/Images/Icons/search_topbar.png';

// class OldTopbar extends React.Component {
//   render(){
//     return (
//       <Grid item sm={12} style={{ flexBasis: '19%' }}>
//         <PrimarySearchAppBar />
//       </Grid >
//     );
//   }
// }

const topbar = {
  paddingTop: "3%",
  height: "15.7vh",
  marginLeft: "6.87%"
}

class Topbar extends React.Component {
  state = {
    userList: null,
    selectedUserID: null,
    isLoadingUsers: true
  }

  componentWillMount() {
    const {loggedInUser} = this.props;
    if(loggedInUser){
      console.log(loggedInUser)
      this.getUsers({user: loggedInUser})
    } else {
      // TODO: BAD idea, move this to service
      // localStorage.clear()
      // this.props.history.push("/")
    }
  }

  getUsers = (user) => {
    console.log("fetching user", user)
    Axios.post('http://803d6b1b.ngrok.io/getUsers', user).then(response => {
      this.setState({ userList: JSON.parse(response.data.body), isLoadingUsers: false})
    }).catch(error => {
      console.log("Error", error)
    })
  }

  filterUsersForSelect = (list) => {
    if(!list)
      return;

    return list.map(userRow => {
      return {
        value: userRow.UserID,
        label: userRow.Name
      }
    });
  }

  handleSelect = (selectedOption) => {
    console.log("handle select",selectedOption);
    if(selectedOption.value){
      this.setState({ selectedUserID: selectedOption.value});
      this.props.onUserChange(selectedOption.value);
    }
  }

  render (){
    const { userList } = this.state;
    return (
      <div style={topbar}>
        <div className="left-floater search-icon">
          <img src={SearchIcon} alt="search icon"/>
        </div>
        <Select
            className="basic-single topbar-search-input topbar-search"
            defaultValue="Select User"
            isSearchable={true}
            isMulti={false}
            isLoading={this.state.isLoadingUsers}
            onChange={(selectedOption) => this.handleSelect(selectedOption)}
            name="color"
            options={this.filterUsersForSelect(userList)}
        />
      </div>
    );
  }
 }

export default Topbar;