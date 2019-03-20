import React from 'react';
import Moment from 'moment';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';
import Auth from '../../../Services/Auth';

import MenuSubSectionList from './MenuSubSectionList';

const localPath = "/workspace/report/vat";

class VatMenubarItems extends React.Component {
  
  state = {
    listData: null,
    loggedInUser: Auth.getLoggedInUser()
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
    sendAuthenticatedAsyncRequest(
      "/getVatReports",
      "POST",
      {accountantId: this.state.loggedInUser.userId},
      (r) => this.setState({listData: this.vatListItemFormatter(JSON.parse(r.data.body))})
    );
  }

  vatListItemFormatter = (data) => {
    if (!data) return [];
  
    console.log("VAT Reports received",data);
    return data.map(vat => ({
        label: `${Moment(vat.start_date).format("MM.YY")} - ${Moment(vat.end_date).format("MM.YY")}`,
        path: `${localPath}/${vat.id}`
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