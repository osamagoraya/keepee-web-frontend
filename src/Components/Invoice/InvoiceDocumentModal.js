import React from 'react';
import InvoiceDocumentCard from './InvoiceDocumentCard';
import DismissableDialog from '../Common/DismissableDialog';
import FileIcon from '@material-ui/icons/Description';
import CameraIcon from '@material-ui/icons/CameraAlt';

import './Invoice.css';

class InvoiceDocumentModal extends React.Component {

  render () {
    const {documentType,uniqueKey } = this.props;

    const button = (
      <span style={{cursor: 'pointer'}}>
      {
        documentType === "image" 
        ? <CameraIcon onClick={() => this.refs[uniqueKey].handleClickOpen() }/> 
        : <FileIcon onClick={() => this.refs[uniqueKey].handleClickOpen() }/>
      }
      </span>
    );
    return (
      <DismissableDialog
        ref={uniqueKey}
        openDialogButton={button}
        title={documentType === "image" ? "Image" : "Pdf"}
        fullScreen={true}
        PaperProps={{
          className:"document-modal-size"
        }}
      >
        <InvoiceDocumentCard { ...this.props} cardClassNames={"document-modal-content"}/>
      </DismissableDialog>
    );
  }
}

export default InvoiceDocumentModal;