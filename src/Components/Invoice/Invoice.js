import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import './Invoice.css';
import iconRotate from '../../Assets/Images/Path_981.svg';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import Button from '../Common/Button';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import Auth from '../../Services/Auth';
import InvoiceForm from '../Forms/InvoiceForm/InvoiceForm';

const BASE_URL = "https://keepee-images.s3.us-west-2.amazonaws.com/";

class Invoice extends Component {
    
  constructor(props){
    super(props);
    this.state = {
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


  updateImageStatus = (uri, apiCallType) => {
    this.setState({apiCallInProgress: true, apiCallType: apiCallType});
    sendAuthenticatedAsyncRequest(
      uri,
      "POST", 
      {imageId: this.state.selectedImageID, email: "not available"},
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: apiCallType});
        this.props.history.push("/workspace/invoice");
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
  
  render(){
      
    const { selectedImageID , selectedImageFileType, selectedImageStamp, apiCallInProgress, apiCallType, selectedUserId, loggedInUser} = this.state;
    const selectedImagePath = BASE_URL + selectedImageStamp;


    return (
      <Grid container className="canvas-container">
        <Grid item container sm={2} direction="column" justify="flex-end" alignItems="center">
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
        <Grid item container sm={10} style={{paddingTop:"8%"}}>
          <Grid item container sm={4} direction="column" alignItems="center" >
            <InvoiceForm 
              imageId={selectedImageID} 
              selectedUserId={selectedUserId} 
              isUserIdRequired={true}
              onSubmit={() => {
                this.setState({apiCallInProgress: false, apiCallType: 'none'});
                this.props.history.push("/workspace/invoice")}
              }
              bindSubmitForm={this.bindSubmitForm.bind(this)}
              loggedInUser={loggedInUser}
              formStyle={{width: "75%"}}
            />
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid item container sm={7} >
            <Card className="document-box">
              <CardActionArea style={{ height: '100%'}}>
              { selectedImageID && selectedImageFileType === "image" 
              ? <CardMedia style={{ transform: `rotate(${this.state.imageAngle}deg)`}}
                    component="img"
                    alt="Unable to load"
                    height="inherit"
                    image={selectedImagePath}
                />
              : selectedImageID && selectedImageFileType === "pdf" 
                ? <embed src={selectedImagePath} type="application/pdf" height="100%" width="100%"  /> 
                : <div>בחר תמונה</div>
              }
              {/* force re render pdf when component received new props*/}
              </CardActionArea>
            </Card>
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
        {/* <Grid item sm={6}>
        </Grid> */}
      </Grid>
    );
  }
}

export default Invoice;