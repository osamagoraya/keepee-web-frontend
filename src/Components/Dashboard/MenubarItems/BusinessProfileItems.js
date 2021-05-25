import React from 'react';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';
import Auth from '../../../Services/Auth';

const localPath = "/profile/business";

class BusinessProfileItems extends React.Component {
  
  state = {
    listData: null,
    loading: false,
    loggedInUser: Auth.getLoggedInUser(),
  }

  componentDidMount() {
      this.fetchListData(this.state.loggedInUser.userId);
  }
  
  fetchListData(loggedInUserId) {
    
    if (!loggedInUserId){
      console.log("not fetching business profiles, no loggedin user id found");
      return;
    } else if (this.state.loading) {
      console.log("not fetching business profiles, request already sent");
      return;
    } else {
      console.log("fetching business profiles for loggedin user", loggedInUserId);
    }
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/getUsers",
      "POST",
      {accountantId: loggedInUserId},
      (r) => this.setState({
        listData: this.businessProfileformatter(JSON.parse(r.data.body)),
        loading: false
      })
    );
  }

  businessProfileformatter = (data) => {
    if (!data) return [];
  
    console.log("Users received",data);
    return data.map(b => ({
        label: b.name,
        path: `${localPath}/${parseInt(b.userId,10)}`,
        rawLabel: b.name
      })
    );
  }

  render (){
    // console.log("rendering InvoiceMenubarItems", this.state, this.props);
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

export default withRouter(BusinessProfileItems);