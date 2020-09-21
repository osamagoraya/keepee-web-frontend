import React from 'react';
import Card from '@material-ui/core/Card';
// var pdf2image = require('pdf2image');
 
//converts all the pages of the given pdf using the default options 
// pdf2image.convertPDF('/Users/zainulabideen/Resume.pdf');
    


const verticallyCenteredImage = {
  display: "inline-block",
  height: "100%",
  verticalAlign: "middle",
}




class InvoiceDocumentCard extends React.Component {
  render () {
    const {cardClassNames,cardMediaStyle,documentType,documentPath,selectedImageId, setCoords} = this.props;
    


    const FindPosition =(oElement) =>
{
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
      return [ posX, posY ];
    }
    else
    {
      return [ oElement.x, oElement.y ];
    }
}


const GetCoordinates = (e, p, width, height) =>
{
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(e.target);
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
  console.log(PosX,'xxx', PosY, 'yyy');
  setCoords(p,PosX,PosY, width, height);
}

const mouseDown = ev => {
  GetCoordinates(ev,'p1',ev.target.width,ev.target.height);
}
const mouseUp = ev => {
  GetCoordinates(ev,'p2',ev.target.width,ev.target.height);
}

// var img = document.getElementById('img-id'); 
// var width = img.clientWidth;
// var height = img.clientHeight;
// console.log(width, height, 'wxh');



const preventDragHandler = (e) => {
  e.preventDefault();
}



    
    return (
      <Card className={cardClassNames} style={{ overflow: "hidden"}}>
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} className="Test">
          <span style={verticallyCenteredImage}></span>
        { selectedImageId && documentType === "image" 
        ? 
      <div>
            <img id='img-id' className="img-responsive" width="500" onDragStart={preventDragHandler} draggable={false} onMouseDown={mouseDown} onMouseUp={mouseUp} style={cardMediaStyle} src={documentPath} alt="beautiful"/>  
          </div>
        
        : selectedImageId && documentType === "pdf" 
        ? <img id='img-id' className="img-responsive" onDragStart={preventDragHandler} draggable={false} onMouseDown={mouseDown} onMouseUp={mouseUp} src={documentPath+ ".jpg"} alt="beautiful"/>
          // ? <embed src="https://ocr-api-test-bucket.s3.us-east-2.amazonaws.com/466097.pdf" type="application/pdf" onDragStart={preventDragHandler} draggable={false} onMouseDown={mouseDown} onMouseUp={mouseUp} style={{width: "100%", height: "100%"}}  />  
          : <div>בחר תמונה</div>
        }
        {/* force re render pdf when component received new props*/}
        </div>
      </Card>
    );
  }
}

export default InvoiceDocumentCard;