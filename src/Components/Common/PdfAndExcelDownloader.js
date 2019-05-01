import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export default class PdfAndExcelDownloader extends Component {
  render() {
    return (
      <div style={{position: 'relative'}}>
        <div className="download-options" >
          <Button className="download-button" onClick={this.props.onPdf}>PDF</Button> | <Button className="download-button">XL</Button>
        </div>
      </div>
    );
  }
}
