import React from 'react';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';
import Auth from '../../../Services/Auth';

const localPath = "/settings/unified-form";

class UnifiedFormItems extends React.Component {
  
  state = {
    listData: null,
    loading: false,
    loggedInUser: Auth.getLoggedInUser(),
  }

  componentDidMount() {
      this.fetchListData(this.state.loggedInUser.userId);
  }
  
  getUsers = (user) => {
    sendAuthenticatedAsyncRequest(
      "/getUsers",
      "POST", 
      {accountantId: user.userId},
      (r) => this.setState({ userList: JSON.parse(r.data.body), isLoadingUsers: false})
    );
  }

  filterUsersForSelect = (list) => {
    if(!list)
      return;

    return list.map(userRow => {
      return {
        value: parseInt(userRow.userId,10),
        label: userRow.name,
        userNID: userRow.nid ,
        userEmail: userRow.email,
        incomeTaxReportFrequency: userRow.incomeTaxReportFrequency,
        vatReportFrequency : userRow.vatReportFrequency,
        license: userRow.license,
        incomeTaxAdvances: userRow.incomeTaxAdvances
      }
    });
  }

  render (){
    const {listData, loading} = this.state;
    return ( 
      !loading 
      ? listData !== null 
        ? <MenuSubSectionList listData={listData} />
        : "No Users"
      : "Requesting Users ..."
    );
  }
}

export default withRouter(UnifiedFormItems);