import React from 'react';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';

const localPath = "/workspace/report/trial-balance";

class TrialBalanceItems extends React.Component {
  
  state = {
    listData: null,
    loading: false,
    selectedUserId: this.props.selectedUserId,
  }

  componentDidMount() {
    if (this.props.location.pathname.indexOf(localPath) >= 0)
      this.fetchListData(this.props.selectedUserId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedUserId !== this.state.selectedUserId){
      this.setState({selectedUserId: nextProps.selectedUserId});
      this.fetchListData(nextProps.selectedUserId);
    }
    else if (nextProps.location.pathname === localPath) {
      this.fetchListData(nextProps.selectedUserId);
    }
  }

  fetchListData(selectedUserId) {
    // TODO: remove from here
    this.setState({
      listData: this.trialBalanceFormatter([
        {year: "2019", id: 4},
        {year: "2018", id: 3},
        {year: "2017", id: 2},
        {year: "2016", id: 1},
      ]),
      loading: false
    });
    return;
    // remove till here
    
    if (selectedUserId === undefined || selectedUserId === null){
      console.log("not fetching Trail Balance reports, no selected user id found");
      return;
    } else if (this.state.loading) {
      console.log("not fetching Trail Balance&L reports, request already sent");
      return;
    } else {
      console.log("fetching Trail Balance reports for user id", selectedUserId);
    }
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/getTrialBalanceReports",
      "POST",
      {userId: selectedUserId},
      (r) => this.setState({
        listData: this.trialBalanceFormatter(JSON.parse(r.data.body)),
        loading: false
      })
    );
  }

  trialBalanceFormatter = (data) => {
    if (!data) return [];
  
    console.log("Trail Balance Reports received",data);
    return data.map(tb => ({
        label: tb.year,
        path: `${localPath}/${tb.id}`
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
        : "No Trail Balance Reports"
      : "Requesting Trail Balance Reports ..."
    );
  }
}

export default withRouter(TrialBalanceItems);