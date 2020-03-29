import React from 'react';
import Moment from 'moment';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';

import swal from 'sweetalert';
const localPath = "/workspace/report/vat";

class VatMenubarItems extends React.Component {
  
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

  fetchListData(selectedUserId) {
    if (selectedUserId === undefined || selectedUserId === null){
      console.log("not fetching vat reports, no selected user id found");
      return;
    } else if (this.state.loading) {
      console.log("not fetching vat reports, request already sent");
      return;
    } else {
      console.log("fetching vat reports for user id", selectedUserId);
    }
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/getVatReports",
      "POST",
      {userId: selectedUserId},
      (r) => this.setState({
        listData: this.vatListItemFormatter(JSON.parse(r.data.body)),
        loading: false
      }),
      (r) => {
        console.log("Yeah",r);
        swal("Error","Please Set Vat Report Start Period Before fetch Vat Report", "error");
      }
    );
  }

  vatListItemFormatter = (data) => {
    if (!data) return [];
  
    console.log("VAT Reports received",data);
    return data.map(vat => ({
        label: `${Moment(vat.startDate).format("MM.YY")} - ${Moment(vat.endDate).format("MM.YY")}`,
        path: `${localPath}/${vat.id}`,
        rawLabel: `${Moment(vat.startDate).format("MM.YY")} - ${Moment(vat.endDate).format("MM.YY")}`,
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
        : "No VAT Reports"
      : "Requesting VAT Reports ..."
    );
  }
}

export default withRouter(VatMenubarItems);