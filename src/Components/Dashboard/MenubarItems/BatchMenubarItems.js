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
    loggedInUser: Auth.getLoggedInUser()
  }

  componentDidMount() {
    this.fetchListData();
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname === localPath) {
      this.fetchListData();
    }
  }

  fetchListData() {
    this.setState({listData: []});
    sendAuthenticatedAsyncRequest(
      "/getBatches",
      "POST",
      {accountantId: this.state.loggedInUser.userId},
      (r) => this.setState({listData: this.batchListItemFormatter(JSON.parse(r.data.body))})
    );
  }

  batchListItemFormatter = (data) => {
    if (!data) return [];

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
    const {listData} = this.state;
    return ( listData !== null ? 
      <MenuSubSectionList listData={listData} />
      : "Requesting Batches"
    );
  }
}

export default withRouter(BatchMenubarItems);