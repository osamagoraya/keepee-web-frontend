import React from 'react';

import Select from 'react-select';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';

// import {Grid} from '@material-ui/core';
// import PrimarySearchAppBar from '../PrimarySearchAppBar';

import SearchIcon from '../../Assets/Images/Icons/search_topbar.png';
import "./Topbar.css";
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
      this.getUsers(loggedInUser)
    } else {
      // TODO: BAD idea, move this to service
      // localStorage.clear()
      // this.props.history.push("/")
    }
  }

  getUsers = (user) => {
    console.log("hi", user);
    sendAuthenticatedAsyncRequest(
      "/getUsers",
      "POST", 
      {userId: user.userId},
      (r) => this.setState({ userList: JSON.parse(r.data.body), isLoadingUsers: false})
    );
  }

  filterUsersForSelect = (list) => {
    if(!list)
      return;

    return list.map(userRow => {
      return {
        value: parseInt(userRow.userId,10),
        label: userRow.name
      }
    });
  }

  handleSelect = (selectedOption) => {
    // console.log("handle select",selectedOption);
    if(selectedOption.value){
      this.setState({ selectedUserID: selectedOption.value});
      this.props.onUserChange(selectedOption.value);
    }
  }

  render (){
    const { userList } = this.state;
    return (
      <div style={topbar} className="topBar">
        <div className="left-floater search-icon">
          <img src={SearchIcon} alt="search icon"/>
        </div>
        <Select
            className="basic-single topbar-search-input topbar-search"
            placeholder="User"
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