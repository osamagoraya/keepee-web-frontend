import React from 'react';
import InvoiceDocumentCard from '../../Invoice/InvoiceDocumentCard';
import DismissableDialog from './dismissableDialog';
import FileIcon from '@material-ui/icons/Description';
import CameraIcon from '@material-ui/icons/CameraAlt';

import '../../Invoice/Invoice.css';

class InvoiceDocumentModal extends React.Component {

  render () {
    const {documentType,uniqueKey,onSubmitCoord, type} = this.props;

    const button = (
      <span style={{cursor: 'pointer'}}>
      {
        documentType === "image" 
        ? <CameraIcon onClick={() => this.refs[uniqueKey].handleClickOpen() }/> 
        : documentType === "pdf" ? <FileIcon onClick={() => this.refs[uniqueKey].handleClickOpen() }/> : "N/A"
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
        onSubmitCoord={onSubmitCoord}
        
      >
        <InvoiceDocumentCard { ...this.props} cardClassNames={"document-modal-content"}/>
      </DismissableDialog>
    );
  }
}

export default InvoiceDocumentModal;