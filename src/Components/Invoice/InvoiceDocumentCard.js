import React from 'react';
import Card from '@material-ui/core/Card';
import { Rect } from "react-konva";

const verticallyCenteredImage = {
  display: "inline-block",
  height: "100%",
  verticalAlign: "middle",
}
const mouseDown = ev => {
  console.log(ev.clientX,'X it is ');
  console.log(ev.clientY,'Y it is ');
}
const mouseUp = ev => {
  console.log(ev.clientX,'X it is ');
  console.log(ev.clientY,'Y it is ');
}
const preventDragHandler = (e) => {
  e.preventDefault();
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
      <div>
            <img className="img-responsive" onDragStart={preventDragHandler} draggable={false} onMouseDown={mouseDown} onMouseUp={mouseUp} style={cardMediaStyle} src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg" alt="beautiful"/>  
          </div>
        
        : selectedImageId && documentType === "pdf" 
          ? <embed src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg" type="application/pdf" style={{width: "100%", height: "100%"}}  /> 
          : <div>בחר תמונה</div>
        }
        {/* force re render pdf when component received new props*/}
        </div>
      </Card>
    );
  }
}

export default InvoiceDocumentCard;