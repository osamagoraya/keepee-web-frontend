import React, { Component } from 'react';
import './Dashboard.css';
import Navbar from '../../Components/Dashboard/Navbar';


import Invoices from "../../Components/Invoices/Invoices";
import Menubar from '../../Components/Dashboard/Menubar';
import Topbar from '../../Components/Dashboard/Topbar';

class Dashboard extends Component {

  state = {
    selectedUserId: null
  }

  render () {
    const {selectedUserId} = this.state;
    console.log("selectedUserId", selectedUserId );
    return (
      <span >
        <div style={navbar} className="full-height">
          <Navbar/>
        </div>
        <div style={menubar} className="full-height">
          <Menubar selectedUserID={selectedUserId} imageSelected={(imageID,fileType) => console.log("wapsi",imageID, fileType)}/>
        </div>
        <div style={content} className="full-height">
          {/* TODO: remove user from state and store in redux */}
          <Topbar onUserChange={(selectedUserId) => this.setState({selectedUserId})} loggedInUser={this.props.location.state.user}/>
          <div style={canvas}>
            <Invoices />
          </div>
        </div>
      </span>
    );
  }
}

const canvas = {
  width: "79%",
  height: "78.3vh",
  boxShadow: '0 3 6 rgba(0, 0, 0, 0.04)',
  borderRadius: 3,
  backgroundColor: '#f8f8f8',
  marginLeft: "6.87%",
  fontFamily: "'Heebo', sans-serif"
}


const navbar = {
  width: `3.6%`,
  boxShadow: '5 0 10 rgba(0, 0, 0, 0.1)',
  backgroundColor: '#3794a5',
}

const menubar = {
  width: `14%`,
  backgroundColor: '#f5f4f4',
  opacity: 0.8,
}
const content = {
  width: `82.4%`
}

export default Dashboard;