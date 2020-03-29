import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import iconRotate from '../../Assets/Images/Path_981.svg';
import './Batch.css';
import Button from '../Common/Button';
import Auth from '../../Services/Auth';
import InvoiceForm from '../Forms/InvoiceForm/InvoiceForm';
import {Grid} from '@material-ui/core';

import InvoiceDocumentModal from '../Invoice/InvoiceDocumentModal';
import InvoiceDocumentCard from '../Invoice/InvoiceDocumentCard';

class JournalEntryModal extends React.Component {
  state = {
        journalEntry : this.props.journalEntry,
        selectedUserId : this.props.selectedUserId,
        loggedInUser : Auth.getLoggedInUser(),
        open : this.props.open,
        imageAngle: 0,
  };
  // To enable form submitting from outside form tag. Can't put this in state. Causes too many renders and depth exceeds
  formSubmitter = null;
    bindSubmitForm(submitter) {
    this.formSubmitter = submitter ;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.open !== this.state.open || nextProps.journalEntry !== this.state.journalEntry || nextProps.selectedUserId !== this.state.selectedUserId) { 
        this.setState({
            open : nextProps.open,
            journalEntry: nextProps.journalEntry,
            selectedUserId : nextProps.selectedUserId
        });
    }

};

transformImage = () => {
  let angle = this.state.imageAngle
  angle = parseInt(angle) + 90
  this.setState({ imageAngle: angle })
}

handleClose = () => {
      this.props.closeJournalEntryModal();
      this.setState({open: false});
}

setApiCallForBatchJEModal = () => {
  this.props.closeJournalEntryModal();
  this.setState({open: false,apiCallInProgress: false, apiCallType: 'none'});
}

render (){
      const {apiCallInProgress,apiCallType,selectedUserId, loggedInUser, journalEntry, isJournalEntryPassed} = this.state;
      return (
        <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            scroll="paper"
            fullScreen={true}
            aria-labelledby="scroll-dialog-title"
            PaperProps={{
                className:"document-modal-size"
              }}
        >
            <DialogContent dividers="true">
            <Grid container className="canvas-container" style={{ flexWrap: 'nowrap !important'}}>
          <Grid item container sm={3} direction="column">
            <Grid item container style = {{ flexBasis: '90%'}}>
              <Grid item sm={12}>
              <InvoiceForm 
                imageId={this.state.journalEntry.imageId} 
                selectedUserId={selectedUserId} 
                isUserIdRequired={true}
                isJournalEntryPassed={true}
                journalEntry={journalEntry}
                setApiCallForBatchJEModal={this.setApiCallForBatchJEModal}
                onSubmit={() => {
                  this.setState({apiCallInProgress: false, apiCallType: 'none'});
                  }
                }
                onValidationFailed={() => {
                  // TODO: Sending a warning, please change this method
                  if (apiCallInProgress)
                    this.setState({apiCallInProgress: false, apiCallType: 'none'})}
                }
                bindSubmitForm={this.bindSubmitForm.bind(this)}
                loggedInUser={loggedInUser}
                formStyle={{width: "75%",marginLeft: '13%',marginTop: '20%'}}
                {...this.props}
              />
              </Grid>
            </Grid>
            <Grid item container style = {{ flexBasis: '10%', justifyContent: 'space-around',alignContent: 'space-around'}}>
                <Grid item sm={12} style = {{ flexBasis: '60%',marginLeft: '-15%'}}>
                {  this.props.batchStatus === "open"  ?  <Button className="bottom-btn-container" 
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
                    </Button> : ''
                }
                </Grid>
              </Grid>
            </Grid>
          <Grid item container sm={9} direction="column" style={{ flexWrap: 'nowrap'}}>
              <Grid item container direction="column" style = {{ flexBasis: '90%'}}>
              <InvoiceDocumentCard 
                cardClassNames="document-box"
                cardMediaStyle={{ transform: `rotate(${this.state.imageAngle}deg)`,maxHeight: '470px'}}
                documentType={journalEntry.imageType}
                documentPath={journalEntry.imageLink}
                selectedImageId={journalEntry.imageId}
              />
              { 
                isJournalEntryPassed ?
                 <InvoiceDocumentModal 
                    documentType={journalEntry.imageType}
                    documentPath={journalEntry.imageLink}
                    selectedImageId={journalEntry.imageId}
                    uniqueKey={`invoicepopup${journalEntry.imageId}`}
                  /> : ''
              }
              </Grid>
              <Grid item container style={{ flexBasis: '5%', alignItems: 'center'}}>
                <div className="doc-action-btn-box"> 
                    <Button fab onClick={this.transformImage} className="k-fab-modal">
                      <img src={iconRotate} alt="Not Found"/>
                    </Button>
                    <Button
                          className="modal-cancel-btn"
                          onClick={this.handleClose}>
                          Cancel
                    </Button>
                </div>
              </Grid>
          </Grid>
      </Grid>
            </DialogContent>
        </Dialog> 
      );
  }
}

export default JournalEntryModal;