import React from 'react';
import Button from '../Common/Button';
import { Modal } from 'react-bootstrap';





class ImageCrop extends React.Component {
  render () {
    const {show,hideModal,cropImage } = this.props;
    const mouseCoord = ev => {
        console.log(ev.clientX,'X')
        console.log(ev.clientY,'Y')
      }
    const preventDragHandler = (e) => {
    e.preventDefault();
    }
    
    return (
        <Modal
        show={show}
        // onHide={hideModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="m-2">
          <h2>Select Text to Fill</h2>
        </Modal.Header>
        <Modal.Body className="m-2">

          
          {/* <Crop/> */}
          {/* <ReactCrop src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg" crop={this.crop} onChange={newCrop => this.setState({crop: newCrop})} /> */}
          
          <div class="outsideWrapper">
            <div class="insideWrapper">
              <img className="img-responsive" onDragStart={preventDragHandler} draggable={false} onMouseDown={mouseCoord} onMouseUp={mouseCoord}  src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg" alt="beautiful"/>
              <canvas class="coveringCanvas"></canvas>
            </div>
          </div>
        
        
        
        </Modal.Body>
        <Modal.Footer>
      
        <Button size="small" variant="grey" onClick={cropImage}> Select </Button>
        </Modal.Footer>
      </Modal>
        );
  }
}

export default ImageCrop;