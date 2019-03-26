import React from 'react';
import Moment from 'moment';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';

const localPath = "/workspace/invoice";

class InvoiceMenubarItems extends React.Component {
  
  state = {
    selectedUserId: this.props.selectedUserId,
    listData: null,
    loading: false
  }

  componentDidMount() {
    if (this.props.location.pathname.indexOf(localPath) >= 0){
      // console.log("InvoiceMenubarItems mounted, attempting to fetch images ")
      this.fetchListData(this.state.selectedUserId);
    } else {
      // console.log("InvoiceMenubarItems mounted, NOT attempting to fetch images, user id: ", this.state.selectedUserId, "location: ", this.props.location.pathname);
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("InvoiceMenubarItems received props", nextProps)
    if (nextProps.selectedUserId !== this.state.selectedUserId){
      // console.log("InvoiceMenubarItems state update with new user", nextProps)
      this.setState({selectedUserId: nextProps.selectedUserId});
      this.fetchListData(nextProps.selectedUserId);
    }
    else if (nextProps.location.pathname === localPath) {
      this.fetchListData(nextProps.selectedUserId);
    }
  }

  fetchListData(selectedUserId) {
    if (selectedUserId === undefined || selectedUserId === null){
      console.log("not fetching invoices, no selected user id found");
      return;
    } else if (this.state.loading) {
      console.log("not fetching invoices, request already sent");
      return;
    } else {
      console.log("fetching invoices for user id", selectedUserId);
    }
    this.setState({listData: [], loading: true});
    sendAuthenticatedAsyncRequest(
      "/getImages",
      "POST",
      {userId: selectedUserId},
      (r) => this.setState({
        listData: this.invoiceListItemFormatter(JSON.parse(r.data.body)),
        loading: false
      })
    );
  }

  invoiceListItemFormatter = (data) => {
    if (!data) return [];

    const imageStamp = (imageName) => {
      let parts = imageName.split('/');
      return parts[parts.length - 1];
    }
  
    const imageName = (imageName) => {
      return Moment(`${imageStamp(imageName)}`,'x').format("MM.DD.YY")
    }
  
    console.log("Images received",data);
    return data.map(image => ({
        label: imageName(image.imageLink),
        path: `${localPath}/${image.imageId}/${image.imageType}/${imageStamp(image.imageLink)}`
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
        : "Select user first"
      : "Requesting images ..."
    );
  }
}

export default withRouter(InvoiceMenubarItems);