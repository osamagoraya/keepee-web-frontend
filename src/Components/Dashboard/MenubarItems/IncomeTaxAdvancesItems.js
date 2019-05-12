import React from 'react';
import Moment from 'moment';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';

const localPath = "/workspace/report/income-tax-advances";

class IncomeTaxAdvancesItems extends React.Component {
  
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
      console.log("not fetching income tax advances reports, no selected user id found");
      return;
    } else if (this.state.loading) {
      console.log("not fetching income tax advances reports, request already sent");
      return;
    } else {
      console.log("fetching income tax advances reports for user id", selectedUserId);
    }
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/getIncomeTaxReports",
      "POST",
      {userId: selectedUserId},
      (r) => this.setState({
        listData: this.incomeTaxAdvancesFormatter(JSON.parse(r.data.body)),
        loading: false
      })
    );
  }

  incomeTaxAdvancesFormatter = (data) => {
    console.log("Income tax advances Reports received",data);
    if (!data) return [];
  
    // return data.map(ita => ({
    //     label: ita.month.split("-").join("."),
    //     path: `${localPath}/${ita.id}`,
    //     rawLabel: ita.month.split("-").join("."),
    //   })
    // );

    if(data.type == "2 month") {
      return data.reports.map(incomeTax => ({
        label: `${Moment(incomeTax.startDate.split('-').reverse().join('.')).format("MM.YY")} - ${Moment(incomeTax.endDate.split('-').reverse().join('.')).format("MM.YY")}`,
        path: `${localPath}/${incomeTax.startDate}/${incomeTax.endDate}`,
        rawLabel: `${Moment(incomeTax.startDate.split('-').reverse().join('.')).format("MM.YY")} - ${Moment(incomeTax.endDate.split('-').reverse().join('.')).format("MM.YY")}`,
      })
    );
    }
    else {
      return data.reports.map(incomeTax => ({
        label: `${Moment(incomeTax.startDate.split('-').reverse().join('.')).format("MM.YY")}`,
        path: `${localPath}/${incomeTax.startDate}/${incomeTax.endDate}`,
        rawLabel: `${Moment(incomeTax.startDate.split('-').reverse().join('.')).format("MM.YY")}`,
      })
    );
    }
  }

  render (){
    // console.log("rendering InvoiceMenubarItems", this.state, this.props);
    const {listData, loading} = this.state;
    return ( 
      !loading 
      ? listData !== null 
        ? <MenuSubSectionList listData={listData} />
        : "No IncomeTaxAdvances Reports"
      : "Requesting IncomeTaxAdvances Reports ..."
    );
  }
}

export default withRouter(IncomeTaxAdvancesItems);