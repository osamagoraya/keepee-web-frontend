import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import { Modal } from 'react-bootstrap';
import './Invoice.css';
import iconRotate from '../../Assets/Images/Path_981.svg';
import Button from '../Common/Button';
import ReactCrop from 'react-image-crop';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import Crop from '../Invoice/crop';
import Auth from '../../Services/Auth';
import InvoiceForm from '../Forms/InvoiceForm/InvoiceForm';



import InvoiceDocumentModal from './InvoiceDocumentModal';
import InvoiceDocumentCard from './InvoiceDocumentCard';
import ImageCrop from './imageCrop';

const BASE_URL = "https://keepee-images.s3.us-west-2.amazonaws.com/";

class Invoice extends Component {
    
  constructor(props){
    super(props);
    this.state = {
      p1:'',
      p2:'',
      show: false,
      selectedImageID: this.props.match.params.imageId,
      selectedImageStamp: this.props.match.params.imageStamp,
      selectedImageFileType: this.props.match.params.imageType,
      imageAngle: 0,
      selectedUserId: this.props.selectedUserId,
      loggedInUser: Auth.getLoggedInUser(),
      apiCallInProgress: false,
      apiCallType: 'none',
      categories: []
    }
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
  

  preventDragHandler = (e) => {
    e.preventDefault();
  }

  
  render(){
      
    const { selectedImageID , selectedImageFileType, selectedImageStamp, apiCallInProgress, apiCallType, selectedUserId, loggedInUser} = this.state;
    const selectedImagePath = BASE_URL + selectedImageStamp;
    const FindPosition =(oElement) =>
{
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
      return [ posX, posY ];
    }
    else
    {
      return [ oElement.x, oElement.y ];
    }
}

const GetCoordinates = (e, p) =>
{
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(e.target);
  if (e.pageX || e.pageY)
  {
    PosX = e.pageX;
    PosY = e.pageY;
  }
  else if (e.clientX || e.clientY)
    {
      PosX = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      PosY = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
  PosX = PosX - ImgPos[0];
  PosY = PosY - ImgPos[1];
  this.setState({[p]: [PosX, PosY]});
}

const mouseDown = ev => {
  GetCoordinates(ev,'p1');
}
const mouseUp = ev => {
  GetCoordinates(ev,'p2');
}

const onSubmitCoord = () => {
  sendAuthenticatedAsyncRequest(
    "http://localhost:5000/invoice",
    "POST", 
    {p1: this.state.p1, p2: this.state.p2},
    (r) => {
      var response = JSON.parse(r.data.body);
      console.log(response,'response');
    //   "uploadId": 13,
    // "vendorName": "",
    // "fieldName": "title",
    // "p1": [
    //     2282,
    //     724
    // ],
    // "p2": [
    //     2726,
    //     846
    // ]
      // this.props.history.push('/workspace/invoice');
      // var path = `/workspace/invoice/${nextImage.imageId}/${nextImage.imageType}/${this.imageStamp(nextImage.imageLink)}`;
      // this.props.history.push(path);
    },
    (r) => {
      console.log("Failing");
    }
  );
  console.log("Function Submitted");
}
    

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
                selectedImageFileType={selectedImageFileType}
                onSubmitCoord={onSubmitCoord}
                response={true}
                
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
                mouseDown={mouseDown}
                mouseUp={mouseUp}
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

        <Grid>
          <ImageCrop
          show={this.state.show}
          hideModal={this.hideModal}
          cropImage={this.cropImage}
          
          />
        </Grid>

      </Grid>
      
    );

  }
}

export default Invoice;