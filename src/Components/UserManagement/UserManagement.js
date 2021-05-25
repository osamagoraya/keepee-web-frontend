import React, { Component } from 'react';
import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import MaterialTable from 'material-table';
import './UserManagement.css';
import Moment from 'moment';

class UserManagement extends Component {

  state = {
    users: []
  }

componentDidMount() {
  this.fetchUsers();
}

fetchUsers() {
  if (this.state.users.length !== 0){
    console.log("not fetching users, they exist", this.state.users);
    return;
  }

  sendAuthenticatedAsyncRequest(  
    "/getUserManagement",
    "POST", 
    {},
    (r) => {
        console.log("re",r.data.body)
        var users = JSON.parse(r.data.body).map((user,index)=> {
              user.taxType = user.license == "2" ? "מורשה" : "פטור";
              user.last_upload = user.last_upload != null ? Moment.unix(user.last_upload / 1000).format("DD/MM/YYYY") : "-";
              return user;
        })
        this.setState({users: users})
    },
    (r) => {
      alert("Unable to delete Journal Entry");
    },
  )
}
  
  render() {
      return (
        <div style={{ maxWidth: '100%' }}>
            <MaterialTable
            columns={[
                { title: 'Client Name', field: 'name' },
                { title: 'ID', field: 'nid' },
                { title: 'Email', field: 'email' },
                { title: 'Phone', field: 'phone' },
                { title: 'User Type', field: 'taxType' },
                { title: 'Business Type', field: 'business_type' },
                { title: 'Book Keeper', field: 'book_keeper' },
                { title: 'Vat Report Start', field: 'vat_report_start' },
                { title: 'ITA rate', field: 'income_tax_advances' },
                { title: 'ITA report frequencey', field: 'reporting_frequency' },
                { title: 'Monthly Fee', field: 'monthly fee' },
                { title: 'Annual Fee', field: 'annual fee' },
                { title: 'Last Vat Report Sent', field: 'last_vat_report_date' },
                { title: 'Last ITA Report Sent', field: 'last_ita_report_date' },
                { title: 'Open Documents (no JE)', field: 'open_documents' },
                { title: 'Open Batches', field: 'open_batches' },
                { title: 'Documents Uploaded By Client', field: 'total_documents' },
                { title: 'Closed Documents', field: 'closed_documents' },
                { title: 'Time Spent By Bookkeeper', field: 'time spent by bppkkeeper' },
                { title: 'Last Upload Date', field: 'last_upload' },
                { title: 'Active User', field: 'active user' },
                { title: 'Password Reset', field: 'password reset' },
            ]}
            data={this.state.users}
            title="User Management"
            options={{
                maxBodyHeight: 550,
                headerStyle: {
                     whiteSpace: 'nowrap',
                     fontWeight: 'bolder'
                },
                actionsColumnIndex: -1,
                paging: false,
                search: true
            }}
            actions={[
                {
                  icon: 'delete',
                  iconProps: { color: "error"},
                  tooltip: 'Delete User',
                  onClick: (event, rowData) => alert("You want to delete " + rowData.name)
                }
              ]}
            />
        </div>
        );
  }
      
}


export default UserManagement;