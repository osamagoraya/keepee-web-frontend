import React from 'react';
import Card from '@material-ui/core/Card';


const verticallyCenteredImage = {
  display: "inline-block",
  height: "100%",
  verticalAlign: "middle",
}

class InvoiceDocumentCard extends React.Component {

  render () {
    const {cardClassNames,cardMediaStyle,documentType,documentPath,selectedImageId} = this.props;

    return (
      <Card className={cardClassNames} style={{ overflow: "auto"}}>
        <div style={{ height: '100%',display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <span style={verticallyCenteredImage}></span>
        { selectedImageId && documentType === "image" 
        ? 
      <div>
            <img id='img-id' className="img-responsive" width="500" draggable={false} style={cardMediaStyle} src={documentPath} alt="Image Load Error!"/>  
          </div>
        
        : selectedImageId && documentType === "pdf" 
          ? <embed src={documentPath} type="application/pdf" draggable={false} style={{width: "100%", height: "100%"}}  />  
          : <div>בחר תמונה</div>
        }
        </div>
      </Card>
    );
  }
}

export default InvoiceDocumentCard;