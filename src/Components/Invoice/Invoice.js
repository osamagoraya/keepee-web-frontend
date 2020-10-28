import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import './Invoice.css';
import iconRotate from '../../Assets/Images/Path_981.svg';
import Button from '../Common/Button';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import Auth from '../../Services/Auth';
import InvoiceForm from '../Forms/InvoiceForm/InvoiceForm';
import {sendAsyncRequestToOCR} from '../../Services/AsyncRequestService';


import InvoiceDocumentModal from './InvoiceDocumentModal';
import InvoiceDocumentCard from './InvoiceDocumentCard';

const BASE_URL = "https://keepee-images.s3-accelerate.amazonaws.com/";

class Invoice extends Component {
    vendorName = '';
    p1  = []
    p2  = []
    width = 0
    height = 0
  
  constructor(props){
    super(props);
    this.state = {
      type: 'title',
      response: {title: null, date:null, payment: null, invoice:null},
      show: false,
      selectedImageID: this.props.match.params.imageId,
      selectedImageStamp: this.props.match.params.imageStamp,
      selectedImageFileType: this.props.match.params.imageType,
      imageAngle: 0,
      selectedUserId: this.props.selectedUserId,
      loggedInUser: Auth.getLoggedInUser(),
      apiCallInProgress: false,
      apiCallType: 'none',
      categories: [],
      vendors: []
    }
  }

  downloadInvoice = () => {
    const response = fetch('http://3.15.23.75:8080/download-invoice', {
      method: 'POST',
      body: JSON.stringify({imageAddress: BASE_URL + this.state.selectedImageStamp + ".jpeg"}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("download response",response);
  }

   SubmitCordinates = async () => {
    const respons = await fetch('http://3.15.23.75:8080/invoice', {
      method: 'POST',
      body: JSON.stringify({"imageKey": this.state.selectedImageStamp,"vendorName": this.vendorName, "fieldName": this.state.type, "p1": this.p1, "p2": this.p2, "renderedWidth": parseInt(this.width), "renderedHeight": parseInt(this.height)}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const res = await respons.json();
    this.vendorName = res.title != null ? res.title : this.vendorName;
    var obj = this.state.response;
    if (this.state.type !== "title"){
      if(this.state.type === "date") {
        if( res.date ) {
            var dateTokens = res.date.split('/');
            const formatedDate = dateTokens[2] + "-" + dateTokens[1] + "-" + dateTokens[0];
            res.date = formatedDate;
        }
      } 
      obj[this.state.type]= res[this.state.type];
      this.setState({response: obj});
    }
    else {
      if( res.date ) {
        var dateTokens = res.date.split('/');
        const formatedDate = dateTokens[2] + "-" + dateTokens[1] + "-" + dateTokens[0];
        res.date = formatedDate;
      }
      this.setState({response: res});
    }
  }

   onSubmitCoord = () => {
  this.SubmitCordinates();
  }

  componentDidMount() {
    this.downloadInvoice();
    this.fetchVendors();
  }
  

  componentWillReceiveProps(nextProps,nextContext) {
    const oldImageId = this.state.selectedImageID;
    const { imageId, imageType, imageStamp } = nextProps.match.params;
    if( oldImageId !== imageId ){
      this.setState({ 
        selectedImageID: imageId, 
        selectedImageFileType: imageType, 
        selectedImageStamp: imageStamp,
        selectedUserId: nextProps.selectedUserId
      });
    } else if (nextProps.selectedUserId){
      this.setState({
        selectedUserId: nextProps.selectedUserId
      });
    }
  }

  imageStamp = (imageName) => {
    let parts = imageName.split('/');
    return parts[parts.length - 1];
  }

  updateImageStatus = (uri, apiCallType) => {
    this.setState({apiCallInProgress: true, apiCallType: apiCallType});
    sendAuthenticatedAsyncRequest(
      uri,
      "POST", 
      {imageId: this.state.selectedImageID, email: "not available"},
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: apiCallType});
        var nextImage = JSON.parse(r.data.body);
        this.props.history.push('/workspace/invoice');
        var path = `/workspace/invoice/${nextImage.imageId}/${nextImage.imageType}/${this.imageStamp(nextImage.imageLink)}`;
        this.props.history.push(path);
      },
      (r) => {
        console.log("Failing");
      }
    );
  }

  transformImage = () => {
    let angle = this.state.imageAngle
    angle = parseInt(angle) + 90
    this.setState({ imageAngle: angle })
  }

  // To enable form submitting from outside form tag. Can't put this in state. Causes too many renders and depth exceeds
  formSubmitter = null;
  bindSubmitForm(submitter) {
    this.formSubmitter = submitter ;
  }


setCoords = (p1,p2, w, h) => {
  console.log("Set Cords Called");
  console.log("p1-Set",p1);
  console.log("p2-Set",p2);
  this.p1 = p1;
  this.p2 = p2;
  this.width = w;
  this.height = h;
  
};

setType = (x) => {
  this.setState({type: x});
};

fetchVendors() {
  if (this.state.vendors.length !== 0){
    console.log("not fetching vendors, they exist", this.state.vendors);
    return;
  }

  sendAsyncRequestToOCR(
    "/vendors",
    "GET", 
    {},
    (r) => {
      this.setState({vendors: r.data.vendorNames});
    },
    (r) => {
      console.log("Error!","Unable to fetch vendors");
    }
  );
}

updateResponse = (response) => {
  this.vendorName = response.title;
  this.setState({ response: response});
}

  render(){
      
    const { selectedImageID , selectedImageFileType, selectedImageStamp, apiCallInProgress, apiCallType, selectedUserId, loggedInUser} = this.state;
    const selectedImagePath = BASE_URL + selectedImageStamp;
    
    

    return (
      <Grid container className="canvas-container" style={{ flexWrap: 'nowrap !important'}}>
          <Grid item container sm={3} direction="column" style={{ flexWrap: 'nowrap'}}>
            <Grid item container style = {{ flexBasis: '85%'}}>
              <Grid item sm={12}>
              <InvoiceForm 
                showModal = {this.showModal}
                imageId={selectedImageID} 
                selectedUserId={selectedUserId} 
                isUserIdRequired={true}
                isJournalEntryPassed={false}
                journalEntry={null}
                selectedImagePath={selectedImagePath}
                selectedImageKey={selectedImageStamp}
                selectedImageFileType={selectedImageFileType}
                onSubmitCoord={this.onSubmitCoord}
                setCoords={this.setCoords}
                response={this.state.response}
                updateResponse={this.updateResponse}
                setType={this.setType}
                vendors={this.state.vendors}
                onSubmit={() => {
                  this.setState({apiCallInProgress: false, apiCallType: 'none'});
                  this.props.history.push("/workspace/invoice")}
                }
                onValidationFailed={() => {
                  // TODO: Sending a warning, please change this method
                  if (apiCallInProgress)
                    this.setState({apiCallInProgress: false, apiCallType: 'none'})}
                }
                bindSubmitForm={this.bindSubmitForm.bind(this)}
                loggedInUser={loggedInUser}
                formStyle={{width: "75%",marginLeft: '13%',marginTop: '20%'}}
              />
              </Grid>
            </Grid>
            <Grid item container style = {{ flexBasis: '10%', justifyContent: 'space-around',alignContent: 'space-around'}}>
                <Grid item sm={12} style = {{ flexBasis: '60%',marginLeft: '-15%'}}>
                    <Button className="bottom-btn-container" 
                    variant="blue" 
                    disabled={apiCallInProgress} 
                    onClick={(e) => {
                      this.setState({apiCallInProgress: true, apiCallType: 'invoice'});
                      this.formSubmitter(e)}
                  }>
                    {apiCallInProgress 
                    ? apiCallType === 'invoice' 
                      ? "submitting ..."
                      : "continue"
                    : "continue"
                    }
                    </Button>
                </Grid>
              </Grid>
            </Grid>
          <Grid item container sm={9} direction="column" style={{ flexWrap: 'nowrap'}}>
              <Grid item container direction="column" style = {{ flexBasis: '90%'}}>
              <InvoiceDocumentCard 
                cardClassNames="document-box"
                cardMediaStyle={{ transform: `rotate(${this.state.imageAngle}deg)`,maxHeight: '470px'}}
                documentType={selectedImageFileType}
                documentPath={selectedImagePath}
                selectedImageId={selectedImageID}
                setCoords={this.setCoords}
              />
                 <InvoiceDocumentModal 
                    documentType={selectedImageFileType}
                    documentPath={selectedImagePath}
                    selectedImageId={selectedImageID}
                    uniqueKey={`invoicepopup${selectedImageID}`}
                  />
              </Grid>
              <Grid item container style={{ flexBasis: '5%', alignItems: 'center', marginTop: '-1%'}}>
                <div className="doc-action-btn-box">
              <Button size="small" variant="grey" className="doc-action-btns" disabled={apiCallInProgress} onClick={() => this.updateImageStatus('/irrelevantPicture', 'irrelevant')}>
                {apiCallInProgress 
                  ? apiCallType === 'irrelevant' 
                    ? "updating ..."
                    : "Not Relevant"
                  : "Not Relevant"
                  }
              </Button>  
              <Button size="small" variant="grey" className="doc-action-btns" disabled={apiCallInProgress} onClick={() => this.updateImageStatus('/retakePicture', 'declined')}>
                {apiCallInProgress 
                  ? apiCallType === 'declined' 
                    ? "updating ..."
                    : "New Picture"
                  : "New Picture"
                  }
              </Button>  
              <Button fab onClick={this.transformImage} className="k-fab">
                <img src={iconRotate} alt="Not Found"/>
              </Button>
            </div>
              </Grid>
          </Grid>
        <Grid item sm={6}>
        </Grid>
      </Grid>
      
    );

  }
}

export default Invoice;