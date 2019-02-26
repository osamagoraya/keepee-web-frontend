import React, { Component } from 'react';
import './Dashboard.css';
import Navbar from '../../Components/Dashboard/Navbar';
import Menubar from '../../Components/Dashboard/Menubar';
import Topbar from '../../Components/Dashboard/Topbar';

import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';

import SearchIcon from '../../Assets/Images/Icons/search_topbar.png';

class Dashboard extends Component {

  render () {
    return (
      <span >
        <div style={navbar} className="full-height">

        </div>
        <div style={menubar} className="full-height">

        </div>
        <div style={content} className="full-height">
          <div style={topbar}>
            <div className="left-floater search-icon">
              <img src={SearchIcon} alt="search icon"/>
            </div>
            
            <InputBase 
              inputProps={{
                className: "topbar-search-input",
              }}  
              className="topbar-search" 
              placeholder="Search User"/>
          </div>
          <div style={canvas}>
              Canvas in Heebo Font
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

const topbar = {
  paddingTop: "3%",
  height: "15.7vh",
  marginLeft: "6.87%"
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



class OldDashboard extends Component {
  render() {
    return (
      <Grid container style={{ minHeight: '100vh'}}>
        <Grid container item  sm={2}>
          <Navbar />
          <Menubar />           
        </Grid>
        <Grid container item sm={10} wrap="nowrap" direction="column">
            <Topbar />
            <Grid item sm={12} >
              <div  
                style={{ 
                  borderRadius: '3px', 
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.04)', 
                  backgroundColor: '#f8f8f8', 
                  height: '78vh', 
                  marginLeft: '8%',
                  width: '78%'

                }}>
                <div>
                    content
                </div>
              </div>
            </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Dashboard;