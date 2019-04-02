import React from 'react';

import Card from '@material-ui/core/Card';


const verticallyCenteredImage = {
  display: "inline-block",
  height: "100%",
  verticalAlign: "middle"
}

class InvoiceDocumentCard extends React.Component {
  render () {
    const {cardClassNames,cardMediaStyle,documentType,documentPath,selectedImageId } = this.props;
    return (
      <Card className={cardClassNames}>
        <div style={{ height: '100%'}}>
          <span style={verticallyCenteredImage}></span>
        { selectedImageId && documentType === "image" 
        ? <img style={cardMediaStyle} src={documentPath} alt="beautoful"/>
        : selectedImageId && documentType === "pdf" 
          ? <embed src={documentPath} type="application/pdf" height="100%" width="100%"  /> 
          : <div>בחר תמונה</div>
        }
        {/* force re render pdf when component received new props*/}
        </div>
      </Card>
    );
  }
}

export default InvoiceDocumentCard;