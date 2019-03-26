import React from 'react';

import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

class InvoiceDocumentCard extends React.Component {
  render () {
    const {cardClassNames,cardMediaStyle,documentType,documentPath,selectedImageId } = this.props;
    return (
      <Card className={cardClassNames}>
        <div style={{ height: '100%'}}>
        { selectedImageId && documentType === "image" 
        ? <CardMedia style={cardMediaStyle}
              component="img"
              alt="Unable to load"
              height="inherit"
              image={documentPath}
          />
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