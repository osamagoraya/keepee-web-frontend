import React, { Component } from 'react';
import './Dashboard.css';
import Navbar from '../../Components/Dashboard/Navbar';

import SearchIcon from '../../Assets/Images/Icons/search_topbar.png';
import Invoices from "../../Components/Invoices/Invoices";
import Axios from "axios";
import Select from 'react-select';
import Menubar from '../../Components/Dashboard/Menubar';

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: null,
            selectedUserID: null,
            isLoadingUsers: true
        }
    }
    componentWillMount() {
        if(this.props.location.state){
            this.getUsers(this.props.location.state)
        }else{
            localStorage.clear()
            this.props.history.push("/")
        }

    }

    getUsers = (user) => {
        Axios.post('http://localhost:8085/getUsers', user).then(response => {
            this.setState({ userList: JSON.parse(response.data.body), isLoadingUsers: false})
        }).catch(error => {
            console.log("Error", error)
        })
    }

    filterUsersForSelect = (list) => {
      if(!list)
        return;

      const optionUsers = list.map(userRow => {
        return {
            value: userRow.UserID,
            label: userRow.Name
        }
    });
    return optionUsers;
    }

    handleSelect = (selectedOption) => {
      console.log("handle select",selectedOption);
      if(selectedOption.value)
        this.setState({ selectedUserID: selectedOption.value});
    }

    imageSelected = (imageID,fileType) => {
        console.log("wapsi",imageID);
    }

  render () {
    const { selectedUserID , userList}  = this.state;
    return (
      <span >
        <div style={navbar} className="full-height">
            <Navbar/>
        </div>
        <div style={menubar} className="full-height">
            <Menubar selectedUserID={selectedUserID} imageSelected={this.imageSelected.bind(this)}/>
        </div>
        <div style={content} className="full-height">
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