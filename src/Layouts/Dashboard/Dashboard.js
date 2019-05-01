import React, { Component } from 'react';
import './Dashboard.css';
import Navbar from '../../Components/Dashboard/Navbar';
import Invoice from "../../Components/Invoice/Invoice";
import Menubar from '../../Components/Dashboard/Menubar';
import Topbar from '../../Components/Dashboard/Topbar';
import {Switch} from 'react-router-dom';
import Auth from '../../Services/Auth';
import Batch from '../../Components/Batch/Batch';
import AccountInquiry from '../../Components/AccountInquiry/AccountInquiry';
import Vat from '../../Components/Vat/Vat';
import IncomeTaxAdvances from '../../Components/IncomeTaxAdvances/IncomeTaxAdvances';
import BusinessProfile from '../../Components/BusinessProfile/BusinessProfile';
import Categories from '../../Components/Categories/Categories';

import ProtectedRoute from '../../Components/Routes/ProtectedRoute';
import ProfitAndLoss from '../../Components/ProfitAndLoss/ProfitAndLoss';
import TrialBalance from '../../Components/TrialBalance/TrialBalance';

class Dashboard extends Component {

  state = {
    selectedUserId: 2,
    loggedInUser: Auth.getLoggedInUser()
  }

  render () {
    const {selectedUserId, loggedInUser} = this.state;
    // console.log("rendering dashboard", this.state);

    return (
      <span >
        <div style={navbar} className="full-height">
          <Navbar/>
        </div>
        <div style={menubar} className="full-height">
          <Menubar selectedUserId={selectedUserId} />
        </div>
        <div style={content} className="full-height">
          {/* TODO: remove user from state and store in redux */}
          <Topbar onUserChange={(selectedUserId) => this.setState({selectedUserId})} loggedInUser={loggedInUser}/>
          <div style={canvas}>
            <Switch>
              {/* TODO: move these routes in AppRoute or something similar? */}
              <ProtectedRoute path="/workspace/invoice/:imageId/:imageType/:imageStamp" component={(props) => <Invoice selectedUserId={selectedUserId} {...props}/>} exact />
              <ProtectedRoute path="/workspace/batch/:batchId" component={(props) => <Batch selectedUserId={selectedUserId} {...props}/>} exact/>
              <ProtectedRoute path="/workspace/account-inquiry" component={(props) => <AccountInquiry selectedUserId={selectedUserId} {...props}/>}/>
              <ProtectedRoute path="/workspace/report/vat/:vatId" component={(props) => <Vat selectedUserId={selectedUserId} {...props}/>} exact/>
              <ProtectedRoute path="/workspace/report/income-tax-advances/:itaId" component={(props) => <IncomeTaxAdvances selectedUserId={selectedUserId} {...props}/>} exact/>
              <ProtectedRoute path="/workspace/report/profilt-and-loss/:pnlYear" component={(props) => <ProfitAndLoss selectedUserId={selectedUserId} {...props}/>} exact/>
              <ProtectedRoute path="/workspace/report/trial-balance/:trailBalanceYear" component={(props) => <TrialBalance selectedUserId={selectedUserId} {...props}/>} exact/>
              <ProtectedRoute path="/profile/business/:profileId" component={BusinessProfile} exact/>
              <ProtectedRoute path="/settings/categories" component={Categories} exact/>
            </Switch>
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