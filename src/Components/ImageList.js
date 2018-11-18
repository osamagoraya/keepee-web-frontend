import React, { Component } from 'react';
import './ImageList.css';
import 'bulma/css/bulma.css'

class ImageList extends Component {

    render() {
        let imageList
        if (this.props.imageList) {
            imageList =
                <ol>
                    {
                        this.props.renderImageListRow()
                    }
                </ol>

        } else {
            imageList = <div></div>
        }
        return (
            <div className="panel content-overflow">
                <div className="panel-heading">
                    <div className="level">
                        <div className="level-left">
                            <span className="icon has-text-white">
                                <i className="far fa-circle fa-2x"></i>
                                <p className="total-images">12</p>
                            </span>
                        </div>
                        <div className="level-right">
                            <p>בני כהן</p>
                        </div>
                    </div>
                </div>
                {imageList}
            </div>
        );
    }
}

export default ImageList;