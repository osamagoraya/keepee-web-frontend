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
                    <div className="field" style={{ width: '100%' , position: 'relative' , right: '-4.5%' }}>
                        <p className="control has-icons-left">
                            <input className="input input-search-box"
                                readonly
                                style={{ color: 'rgba(121, 111, 111, 1)' }}
                                value={this.props.userName}
                            />
                            <span className="icon is-small has-text-white" style={{ left: '-10%' }}>
                               <i className="fal fa-circle" style={{ fontSize: '25.53px'}}></i>
                                <p className="total-images">{this.props.imageCount}</p>
                            </span>
                        </p>
                    </div>
                </div>
                {imageList}
            </div>
        );
    }
}

export default ImageList;