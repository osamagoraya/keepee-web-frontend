import React from 'react';
import Card from '@material-ui/core/Card';


const verticallyCenteredImage = {
  display: "inline-block",
  height: "100%",
  verticalAlign: "middle",
}

const modalCardImageStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const cardImageStyles = {
  height: "100%",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

class InvoiceCordinatesCard extends React.Component {

  FindPosition =(oElement) => {
    if(typeof( oElement.offsetParent ) != "undefined") {
      for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
        posX += oElement.offsetLeft;
        posY += oElement.offsetTop;
      }
      return [ posX, posY ];
    }
    else {
      return [ oElement.x, oElement.y ];
    }
 }

 GetCoordinates = (e, p, width, height) => {
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = this.FindPosition(e.target);
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
  this.props.setCoords(p,PosX,PosY, width, height);
}

mouseDown = ev => {
  this.GetCoordinates(ev,'p1',ev.target.width,ev.target.height);
}
mouseUp = ev => {
  this.GetCoordinates(ev,'p2',ev.target.width,ev.target.height);
}

preventDragHandler = (e) => {
  e.preventDefault();
}

  render () {
    const {cardClassNames,cardMediaStyle,documentType,documentPath,selectedImageId} = this.props;

    return (
      <Card className={cardClassNames} style={{ overflow: "auto"}}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}} className="Test">
          <span style={verticallyCenteredImage}></span>
        { selectedImageId && documentType === "image" 
        ? 
      <div>
            <img id='img-id' className="img-responsive" width="500" onDragStart={this.preventDragHandler} draggable={false} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} style={cardMediaStyle} src={documentPath} alt="beautiful"/>  
          </div>
        
        : selectedImageId && documentType === "pdf" 
          ? this.props.modalType == "ocr"
            ? <img id='img-id' className="img-responsive" onDragStart={this.preventDragHandler} draggable={false} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} src={documentPath+ ".jpg"} alt="beautiful"/>
            :<embed src={documentPath} type="application/pdf" draggable={false} style={{width: "100%", height: "100%"}}  />  
          : <div>בחר תמונה</div>
        }
        </div>
      </Card>
    );
  }
}

export default InvoiceCordinatesCard;