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
import EmailSetting from '../../Components/EmailSetting/EmailSetting';
import Categories from '../../Components/Categories/Categories';

import ProtectedRoute from '../../Components/Routes/ProtectedRoute';
import ProfitAndLoss from '../../Components/ProfitAndLoss/ProfitAndLoss';
import TrialBalance from '../../Components/TrialBalance/TrialBalance';
import UnifiedForm from '../../Components/UnifiedForm/UnifiedForm';
import TaxAttributes from '../../Components/TaxAttributes/TaxAttributes';
import Vendors from '../../Components/Vendors/vendors';
import UserManagement from '../../Components/UserManagement/UserManagement';
import InvoiceSystem from '../../Components/InvoiceSystem/InvoiceSystem';
import InvoiceItems from '../../Components/InvoiceItems/InvoiceItems';
import Customers from '../../Components/Customers/customers';
import Suppliers from '../../Components/Suppliers/suppliers';
import Items from '../../Components/Items/items';

class Dashboard extends Component {

  state = {
    selectedUserId: null,
    selectedUserName: null,
    selectedUserNID : null,
    selectedUserEmail: null,
    selectedUserItaFrequency: null,
    selectedUserVatFrequency: null,
    selectedUserLicense: null,
    selectedUserIncomeTaxAdvances: null,
    loggedInUser: Auth.getLoggedInUser()
  }

  render () {
    const {selectedUserId, loggedInUser, selectedUserName, selectedUserNID, selectedUserEmail,selectedUserItaFrequency,selectedUserVatFrequency,selectedUserLicense,selectedUserIncomeTaxAdvances} = this.state;
    //console.log("rendering dashboard", this.state);

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
          <Topbar onUserChange={(selectedUserId, selectedUserName, selectedUserNID, selectedUserEmail,selectedUserItaFrequency,selectedUserVatFrequency,selectedUserLicense,selectedUserIncomeTaxAdvances) => this.setState({selectedUserId,selectedUserName,selectedUserNID,selectedUserEmail,selectedUserItaFrequency,selectedUserVatFrequency,selectedUserLicense,selectedUserIncomeTaxAdvances})} loggedInUser={loggedInUser}/>
          <div style={canvas}>
            <Switch>
              {/* TODO: move these routes in AppRoute or something similar? */}
              <ProtectedRoute path="/workspace/invoice/:imageId/:imageType/:imageStamp" component={(props) => <Invoice selectedUserId={selectedUserId} selectedUserName={selectedUserName} selectedUserNID={selectedUserNID} {...props}/>} exact />
              <ProtectedRoute path="/workspace/batch/:batchId" component={(props) => <Batch selectedUserId={selectedUserId} selectedUserName={selectedUserName} selectedUserNID={selectedUserNID} {...props}/>} exact/>
              <ProtectedRoute path="/workspace/account-inquiry" component={(props) => <AccountInquiry selectedUserId={selectedUserId} selectedUserName={selectedUserName} selectedUserNID={selectedUserNID} {...props}/>}/>
              <ProtectedRoute path="/workspace/report/vat/:vatId" component={(props) => <Vat selectedUserId={selectedUserId} selectedUserName={selectedUserName} selectedUserNID={selectedUserNID} selectedUserEmail={selectedUserEmail} selectedUserItaFrequency={selectedUserItaFrequency}  selectedUserVatFrequency={selectedUserVatFrequency} selectedUserLicense={selectedUserLicense} selectedUserIncomeTaxAdvances={selectedUserIncomeTaxAdvances} {...props}/>} exact/>
              <ProtectedRoute path="/workspace/report/income-tax-advances/:startDate/:endDate/:reportTitle" component={(props) => <IncomeTaxAdvances selectedUserId={selectedUserId} selectedUserName={selectedUserName} selectedUserNID={selectedUserNID} selectedUserEmail={selectedUserEmail} selectedUserItaFrequency={selectedUserItaFrequency}  selectedUserVatFrequency={selectedUserVatFrequency} selectedUserLicense={selectedUserLicense} selectedUserIncomeTaxAdvances={selectedUserIncomeTaxAdvances} {...props}/>} exact/>
              <ProtectedRoute path="/workspace/report/profilt-and-loss" component={(props) => <ProfitAndLoss selectedUserId={selectedUserId} selectedUserName={selectedUserName} selectedUserNID={selectedUserNID} {...props}/>} exact/>
              <ProtectedRoute path="/workspace/report/trial-balance/:trailBalanceYear" component={(props) => <TrialBalance selectedUserId={selectedUserId} selectedUserName={selectedUserName} selectedUserNID={selectedUserNID} {...props}/>} exact/>
              <ProtectedRoute path="/profile/business/:profileId" component={BusinessProfile} exact/>
              <ProtectedRoute path="/profile/email-settings/:profileId"  component={EmailSetting} exact />
              <ProtectedRoute path="/settings/categories" component={Categories} exact/>
              <ProtectedRoute path="/settings/unified-form" component={UnifiedForm} exact/>
              <ProtectedRoute path="/settings/tax-attributes/:year"  component={TaxAttributes} exact />
              <ProtectedRoute path="/settings/ocr-vendors" component={Vendors} exact/>
              <ProtectedRoute path="/settings/user-management" component={UserManagement} exact />
              <ProtectedRoute path="/invoices/invoice" component={InvoiceSystem} exact />
              <ProtectedRoute path="/invoices/invoice-items" component={InvoiceItems} exact />
              <ProtectedRoute path="/invoices/customers" component={Customers} exact />
              <ProtectedRoute path="/invoices/suppliers" component={Suppliers} exact />
              <ProtectedRoute path="/invoices/items" component={Items} exact />
            </Switch>
          </div>
        </div>
      </span>
    );
  }
}

const canvas = {
  width: "85%",
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