import React from 'react';
import Moment from 'moment';
import {withRouter} from 'react-router-dom';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import MenuSubSectionList from './MenuSubSectionList';


class InvoiceMenubarItems extends React.Component {
  
  state = {
    selectedUserId: this.props.selectedUserId,
    listData: null
  }

  componentDidMount() {
    this.fetchListData(this.state.selectedUserId);
  }

  componentWillReceiveProps(nextProps) {
    // console.log("InvoiceMenubarItems received props", nextProps)
    if (nextProps.selectedUserId !== this.state.selectedUserId){
      // console.log("InvoiceMenubarItems state update", nextProps)
      this.setState({selectedUserId: nextProps.selectedUserId});
      this.fetchListData(nextProps.selectedUserId);
    }
    // if route changed to /workspace/invoice, fetch list data
  }

  fetchListData(selectedUserId) {
    if (selectedUserId === undefined || selectedUserId === null){
      // console.log("not fetching list data, no selected user id founf");
      return;
    } else 
      console.log("fetching list data four user id", selectedUserId);
    this.setState({listData: []});
    sendAuthenticatedAsyncRequest(
      "/getImages",
      "POST",
      {userId: selectedUserId},
      (r) => this.setState({listData: this.invoiceListItemFormatter(JSON.parse(r.data.body))})
    );
  }

  invoiceListItemFormatter = (data) => {
    if (!data) return [];
  
    //TODO: get this from approutes or somewhere
    const localPath = "/workspace/invoice";

    const imageStamp = (imageName) => {
      let parts = imageName.split('/');
      return parts[parts.length - 1];
    }
  
    const imageName = (imageName) => {
      return Moment(`${imageStamp(imageName)}`,'x').format("MM.DD.YY")
    }
  
    // console.log("Images received",data);
    return data.map(image => ({
        label: imageName(image.imageLink),
        path: `${localPath}/${image.imageId}/${image.imageType}/${imageStamp(image.imageLink)}`
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

export default withRouter(InvoiceMenubarItems);