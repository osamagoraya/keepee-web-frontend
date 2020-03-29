import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DownloadPnL from '../ProfitAndLoss/DownloadPnL';
import DownloadTB from '../TrialBalance/DownloadTB';
import DownloadIncomeTaxAdvances from '../IncomeTaxAdvances/DownloadIncomeTaxAdvances';
import DownloadVat from '../Vat/DownloadVat';
import DownloadAccountInquiry from '../AccountInquiry/DownloadAccountInquiry';

export default class PdfAndExcelDownloader extends Component {
  render() {
    return (
      <div style={{position: 'relative'}}>
        <div className="download-options" >
          {  this.props.type == 'vat' || this.props.type == 'ita' ?
            <Button className="download-button" onClick={this.props.sendReportsViaEmail}>Send all reports  </Button> : ""} | 
          <Button className="download-button" onClick={this.props.onPdf}>PDF</Button> | 
              {this.props.type === 'pnl' ? 
                  <DownloadPnL 
                        data={this.props.excelData} 
                        year={this.props.year} 
                        user={this.props.user} 
                        niD={this.props.niD} 
                        hideElement={true} 
                        className="download-button" /> : 
               this.props.type === 'tb' ?
                  <DownloadTB 
                        data={this.props.excelData} 
                        year={this.props.year} 
                        user={this.props.user} 
                        niD={this.props.niD} 
                        hideElement={true} 
                        className="download-button" /> :
               this.props.type === 'ita' ? 
                  <DownloadIncomeTaxAdvances
                  data={this.props.excelData} 
                  year={this.props.year} 
                  user={this.props.user} 
                  niD={this.props.niD} 
                  hideElement={true} 
                  className="download-button" /> : 
               this.props.type === 'vat' ?
                  <DownloadVat
                    data={this.props.excelData}
                    year={this.props.year}
                    user={this.props.user}
                    niD={this.props.niD}
                    hideElement={true} 
                    className="download-button" /> :
               this.props.type === 'ai' ?
                  <DownloadAccountInquiry
                    data={this.props.excelData}
                    year={this.props.year}
                    user={this.props.user}
                    niD={this.props.niD}
                    hideElement={true} 
                    className="download-button" /> : ""
               }
        </div>
      </div>
    );
  }
}
