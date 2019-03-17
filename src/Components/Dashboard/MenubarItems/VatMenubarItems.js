import React from 'react';
import Moment from 'moment';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';

const localPath = "/workspace/report/vat";

class VatMenubarItems extends React.Component {
  
  state = {
    listData: null
  }

  componentDidMount() {
    this.fetchListData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname === localPath) {
      this.fetchListData(nextProps.selectedUserId);
    }
  }

  prepareData(){
    return [1,2,3,4,5,6].map(i=> {
      return {
        vatId: i,
        startDate: Moment().subtract(2*i, 'months').startOf('month'),
        endDate: Moment().subtract(2*i - 1, 'months').endOf('month'),
        status: i === 1 ? 'open' : 'close'
      }
    })
  }

  fetchListData() {
    this.setState({listData: []});

    setTimeout( () => this.setState({listData: this.vatListItemFormatter(this.prepareData())}), 500);
    
    return; 

    this.setState({listData: []});
    sendAuthenticatedAsyncRequest(
      "/getVatReports",
      "POST",
      {},
      (r) => this.setState({listData: this.vatListItemFormatter(JSON.parse(r.data.body))})
    );
  }

  vatListItemFormatter = (data) => {
    if (!data) return [];

  
    // console.log("Images received",data);
    return data.map(vat => ({
        label: `${Moment(vat.startDate).format("MM.YY")} - ${Moment(vat.endDate).format("MM.YY")}`,
        path: `${localPath}/${vat.vatId}`
      })
    );
  }

  render (){
    // console.log("rendering InvoiceMenubarItems", this.state, this.props);
    const {listData} = this.state;
    return ( listData !== null ? 
      <MenuSubSectionList listData={this.state.listData} />
      : "Select user first"
    );
  }
}

export default withRouter(VatMenubarItems);