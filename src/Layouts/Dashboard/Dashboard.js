import React, { Component } from 'react';
import './Dashboard.css';
import Navbar from '../../Components/Dashboard/Navbar';
// import Menubar from '../../Components/Dashboard/Menubar';
// import Topbar from '../../Components/Dashboard/Topbar';
//
// import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';

import SearchIcon from '../../Assets/Images/Icons/search_topbar.png';
import Invoices from "../../Components/Invoices/Invoices";
import Axios from "axios";





class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: null,
            selectedUserImagesList: null,
            filteredUsers: null,
            selectedUserID: null,
            selectedImageID: null,
            selectedFileType: null,
            selectedUserName: null,
            selectedUserImagesCount: null
        }
    }

    componentWillMount() {
        console.log("User", this.props.location.state)
        if(this.props.location.state){
            this.getUsers(this.props.location.state)
        }else{
            localStorage.clear()
            this.props.history.push("/")
        }

    }

    getUsers = (user) => {
        Axios.post('http://54.245.6.3:8085/getUsers', user).then(response => {
            console.log("Result", response.data)
            this.setState({ userList: JSON.parse(response.data.body)})
        }).catch(error => {
            console.log("Error", error)
        })
    }

    getUniqueUsers = (list) =>{
        const flags = new Set();
        let result = list.filter(entry => {
            if (flags.has(entry.UserID)) {
                return false;
            }
            flags.add(entry.UserID);
            return true;
        });
        return result
    }


  render () {
    return (
      <span >
        <div style={navbar} className="full-height">
            <Navbar users={this.state.userList} renderUserListRow={this.renderUserListRow}/>
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



// class OldDashboard extends Component {
//   render() {
//     return (
//       <Grid container style={{ minHeight: '100vh'}}>
//         <Grid container item  sm={2}>
//           <Navbar />
//           <Menubar />
//         </Grid>
//         <Grid container item sm={10} wrap="nowrap" direction="column">
//             <Topbar />
//             <Grid item sm={12} >
//               <div
//                 style={{
//                   borderRadius: '3px',
//                   boxShadow: '0 3px 6px rgba(0, 0, 0, 0.04)',
//                   backgroundColor: '#f8f8f8',
//                   height: '78vh',
//                   marginLeft: '8%',
//                   width: '78%'
//
//                 }}>
//                 <div>
//                     content
//                 </div>
//               </div>
//             </Grid>
//         </Grid>
//       </Grid>
//     );
//   }
// }

export default Dashboard;