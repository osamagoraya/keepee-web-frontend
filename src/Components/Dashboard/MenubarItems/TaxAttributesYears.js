import React from 'react';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';
import Auth from '../../../Services/Auth';

const localPath = "/settings/tax-attributes";

class TaxAttributesYears extends React.Component {
  
  state = {
    listData: null,
    loading: false,
    loggedInUser: Auth.getLoggedInUser(),
  }

  componentDidMount() {
      this.fetchListData();
  }
  
  fetchListData() {
    
    if (this.state.loading) {
      console.log("not fetching tax years, request already sent");
      return;
    } else {
      console.log("fetching tax years");
    }
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/getTaxAttributesYears",
      "POST",
      {},
      (r) => {
          console.log(r.data);
          this.setState({
        listData: this.taxYearsformatter(r.data),
        loading: false
      })
    }
    );
  }

  taxYearsformatter = (data) => {
    if (!data) return [];
  
    console.log("Years received",data);
    return data.map(row => ({
        label: row.year,
        path: `${localPath}/${row.year}`
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
        : "No Years"
      : "Fetching Tax Years ..."
    );
  }
}

export default withRouter(TaxAttributesYears);