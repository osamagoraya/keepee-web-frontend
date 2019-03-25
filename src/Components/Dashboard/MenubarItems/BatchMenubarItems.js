import React from 'react';
import Moment from 'moment';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';
import Auth from '../../../Services/Auth';

const localPath = "/workspace/batch";

class BatchMenubarItems extends React.Component {
  
  state = {
    listData: null,
    loading: false,
    loggedInUser: Auth.getLoggedInUser()
  }

  componentDidMount() {
    if (this.props.location.pathname.indexOf(localPath) >= 0)
      this.fetchListData();
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname === localPath) 
      this.fetchListData();
  }

  fetchListData() {
    if (this.state.loading)
      return;
    
    console.log("requesting batch list")
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/getBatches",
      "POST",
      {accountantId: this.state.loggedInUser.userId},
      (r) => {
          console.log("batch list received", r);
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
  
    const batchNameWithDetails = (batch) => {
      return (
        <span style={{fontStyle:"italic", fontWeight: 300}}>
          {batchName(batch)} <br />
          Invoices ({batch.invoiceCount}) <br />
          Since {Moment(batch.createdAt,'x').format("MM.DD.YY")} 
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