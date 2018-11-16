import React, { Component } from 'react';
import './ImageList.css';
import 'bulma/css/bulma.css'

class ImageList extends Component {

    render() {
        return (
            <div className="panel">
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
                <div className="panel-block"></div>
            </div>
        );
    }
}

export default ImageList;