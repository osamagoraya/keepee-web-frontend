import React from 'react';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';

const localPath = "/workspace/report/profilt-and-loss";

class ProfitAndLossItems extends React.Component {
  
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
    
    if (selectedUserId === undefined || selectedUserId === null){
      console.log("not fetching P&L reports, no selected user id found");
      return;
    } else if (this.state.loading) {
      console.log("not fetching P&L reports, request already sent");
      return;
    } else {
      console.log("fetching P&L reports for user id", selectedUserId);
    }
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/profitAndLossReports",
      "POST",
      {userId: selectedUserId},
      (r) => this.setState({
        listData: this.profitAndLossFormatter(JSON.parse(r.data.body)),
        loading: false
      })
    );
  }

  profitAndLossFormatter = (data) => {
    if (!data) return [];
  
    console.log("P&L Reports received",data);
    return data.map(pnl => ({
        label: pnl.report,
        path: `${localPath}/${pnl.report}`
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
        : "No ProfitAndLoss Reports"
      : "Requesting ProfitAndLoss Reports ..."
    );
  }
}

export default withRouter(ProfitAndLossItems);