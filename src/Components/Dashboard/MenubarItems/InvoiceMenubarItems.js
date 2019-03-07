import React from 'react';
import Moment from 'moment';

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
      {userID: selectedUserId},
      (r) => this.setState({listData: this.invoiceListItemFormatter(JSON.parse(r.data.body))})
    );
  }

  invoiceListItemFormatter = (data) => {
    if (!data) return [];
  
    const localPath = "/invoice"

    const imageId = (imageName) => {
      let parts = imageName.split('/');
      return parts[parts.length - 1];
    }
  
    const imageName = (imageName) => {
      return Moment(`${imageId(imageName)}`,'x').format("MM.DD.YY")
    }
  
    // console.log("Images received",data);
    return data.map(image => ({
        label: imageName(image.ImageID),
        path: `${localPath}/${imageId(image.ImageID)}/${image.FileType}`
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

export default InvoiceMenubarItems;