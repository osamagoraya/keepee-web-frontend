import React, {Component} from 'react'
import {render} from 'react-dom'
import ImageCrop from 'react-image-crop-component'
import 'react-image-crop-component/style.css'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
 
class Crop extends Component {
  
    
    _crop() {
        // image in dataUrl
        console.log(this.cropper.getCroppedCanvas().toDataURL());
    }

    onCropperInit(cropper) {
        this.cropper = cropper;
    }

    render() {
        return (
            <Cropper
                src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg"
                style={{height: 400, width: '100%'}}
                // Cropper.js options
                initialAspectRatio={16 / 9}
                guides={false}
                crop={this._crop.bind(this)}
                onInitialized={this.onCropperInit.bind(this)}
            />
        );
    }
}

export default Crop;