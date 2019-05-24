import React from 'react';
import Card from '@material-ui/core/Card';

const verticallyCenteredImage = {
  display: "inline-block",
  height: "100%",
  verticalAlign: "middle",
}

class InvoiceDocumentCard extends React.Component {
  render () {
    const {cardClassNames,cardMediaStyle,documentType,documentPath,selectedImageId } = this.props;
    return (
      <Card className={cardClassNames} style={{ overflow: "hidden"}}>
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} className="Test">
          <span style={verticallyCenteredImage}></span>
        { selectedImageId && documentType === "image" 
        ? 
            <img class="img-responsive" style={cardMediaStyle} src={documentPath} alt="beautiful"/>
        : selectedImageId && documentType === "pdf" 
          ? <embed src={documentPath} type="application/pdf" style={{width: "100%", height: "100%"}}  /> 
          : <div>בחר תמונה</div>
        }
        {/* force re render pdf when component received new props*/}
        </div>
      </Card>
    );
  }
}

export default InvoiceDocumentCard;