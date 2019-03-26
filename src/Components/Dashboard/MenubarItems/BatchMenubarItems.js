import React from 'react';
import Moment from 'moment';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';

const localPath = "/workspace/batch";

class BatchMenubarItems extends React.Component {
  
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
      console.log("not fetching batches, no selected user id found");
      return;
    } else if (this.state.loading) {
      console.log("not fetching batches, request already sent");
      return;
    } else {
      console.log("fetching batches for user id", selectedUserId);
    }
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/getBatches",
      "POST",
      {userId: selectedUserId},
      (r) => {
          this.setState({
          listData: this.batchListItemFormatter(JSON.parse(r.data.body)),
          loading: false
        })
      }
    );
  }

  batchListItemFormatter = (data) => {
    if (!data) return [];
    
    data.sort((o1, o2) => parseInt(o2.batchId,10) - parseInt(o1.batchId,10));

    const batchName = (batch) => {
      let name = batch.batchId.toString();
      if (name.length === 1) return "00"+name;
      else if (name.length === 2) return "0"+name;
      else return name;
    }
  
    console.log("Batches received",data);

    const batchNameWithDetails = (batch) => {
      return (
        <span style={{fontStyle:"italic", fontWeight: 300}}>
          {batchName(batch)} <br />
          Invoices ({batch.invoiceCount}) <br />
          Since {Moment(batch.createdAt).format("MM.DD.YY")} 
        </span>
      );
    }
  
    // console.log("Batches received",data);
    return data.map(batch => ({
      label: batch.batchStatus === 'open' ? batchNameWithDetails(batch) : batchName(batch),
      path: `${localPath}/${batch.batchId}`
    }));
  }

  render (){
    // console.log("rendering InvoiceMenubarItems", this.state, this.props);
    const {listData, loading} = this.state;
    return ( 
      !loading 
      ? listData !== null 
        ? <MenuSubSectionList listData={listData} />
        : "No Batches"
      : "Requesting batches ..."
    );
  }
}

export default withRouter(BatchMenubarItems);