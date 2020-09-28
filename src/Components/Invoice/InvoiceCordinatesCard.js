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

var cardStyles = {
  overflow: "auto"
}

class InvoiceCordinatesCard extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }
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
      PosX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      PosY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
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

componentDidMount = () => {
    var canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    var background = new Image();
    background.src = this.props.documentPath + ".jpg";

    cardStyles = this.cardStyles;
    background.onload = function(cardStyles) {
        
        canvas.width =  background.width  > 700 ? 600 : background.width;
        canvas.height = background.height > 700 ? 700 : background.height;
        
        cardStyles.width  = canvas.width;
        cardStyles.height = canvas.height;
        
        
        ctx.drawImage(background,0,0,canvas.width,canvas.height);
    }

    //Variables for reactangle draw
    var canvasx = this.FindPosition(ctx.canvas)[0];
    var canvasy = this.FindPosition(ctx.canvas)[1];
    var last_mousex , last_mousey = 0;
    var mousex , mousey = 0;
    var mousedown = false;

    canvas.addEventListener('mousedown', function(e) {
        var ele = document.getElementById('canvas-wrapper');
        last_mousex = parseInt(e.clientX-canvasx+ele.scrollLeft);
        last_mousey = parseInt(e.clientY-canvasy+ele.scrollTop);
        mousedown = true;
    });

    

//Mouseup
canvas.onmouseup = (e) => {
    mousedown = false;
};

 
//Mousemove
    canvas.onmousemove = (e)  => {
        var ele = document.getElementById('canvas-wrapper');

        mousex = parseInt(e.clientX-canvasx+ele.scrollLeft);
        mousey = parseInt(e.clientY-canvasy+ele.scrollTop);
        
        if(mousedown) {
            ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
            ctx.drawImage(background,0,0,canvas.width,canvas.height);
            ctx.beginPath();

            var width = mousex-last_mousex;
            var height = mousey-last_mousey;
            ctx.rect(last_mousex,last_mousey,width,height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    
}
  render () {
    const {cardClassNames,cardMediaStyle,documentType,documentPath,selectedImageId} = this.props;

    return (
      <Card id="canvas-wrapper" className={cardClassNames} style={{overflow: 'auto'}}>
        
        { selectedImageId && documentType === "image" 
        ? 
        <div>
            <img id='img-id' className="img-responsive" width="500" onDragStart={this.preventDragHandler} draggable={false} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} style={cardMediaStyle} src={documentPath} alt="beautiful"/>  
        </div>
        
        : selectedImageId && documentType === "pdf" 
          ? this.props.modalType == "ocr"
            ? <canvas ref={this.canvasRef} onDragStart={this.preventDragHandler} draggable={false} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}>
              </canvas>
            :<embed src={documentPath} type="application/pdf" draggable={false} style={{width: "100%", height: "100%"}}  />  
          : <div>בחר תמונה</div>
        }
      </Card>
    );
  }
}

export default InvoiceCordinatesCard;