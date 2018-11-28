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
                                <i className="fal fa-circle fa-2x"></i>
                                <p className="total-images">{this.props.imageCount}</p>
                            </span>
                        </div>
                        <div className="level-right has-text-white">
                            <p>{this.props.userName}</p>
                        </div>
                    </div>
                </div>
                {imageList}
            </div>
        );
    }
}

export default ImageList;