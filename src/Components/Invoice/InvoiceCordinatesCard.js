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
    
    // Class level params
    gP1 = []; 
    gP2 = [];
    gWidth = 0;
    gHeight = 0;

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

componentDidMount = () => {
    var canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    var background = new Image();
    background.src = this.props.documentType == "image" ? this.props.documentPath : this.props.documentPath + ".jpeg";
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
    this.gP1    = [last_mousex,last_mousey]
    this.gP2    = [mousex,mousey]
    this.gWidth = canvas.width;
    this.gHeight = canvas.height;
    
    this.props.setCoords(this.gP1,this.gP2,this.gWidth,this.gHeight);
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
        { 
          <canvas ref={this.canvasRef} onDragStart={this.preventDragHandler} draggable={false}></canvas>
        }
      </Card>
    );
  }
}

export default InvoiceCordinatesCard;