import React, { Component } from 'react';
import Moment from 'moment';

import {BootstrapTable} from '../Common/Table';
import './AccountInquiry.css'
import Chip from '@material-ui/core/Chip';
import ClipIcon from '@material-ui/icons/AttachFile';
import FileIcon from '@material-ui/icons/Description';
import CameraIcon from '@material-ui/icons/CameraAlt';
import Button from '@material-ui/core/Button';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';

class AccountInquiry extends Component {

  state = {
    // selectedBatchId: this.props.match.params.batchId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    // batch: null
  }

  componentDidMount() {
    // this.fetchAccountInquiry({});
  }
  
  componentWillReceiveProps(nextProps) {
    // this.fetchAccountInquiry({});
  }

  fetchAccountInquiry(filters) {
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/account-inqury",
      "POST", 
      {filters: filters},
      (r) => this.setState({report: r.data, apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  categoryInformation() {
    return <Chip className='category-chip' label="001-Category to 009-Category" onDelete={() => console.log("delete clicked")}/>
  }

  generateData() {
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(i => {
      return {
        id: i,
        jeid: i, 
        movement: i,
        batchId: '00'+i,
        reference_one: 'Some reference',
        date: '10-10-2018',
        vendor: "Some vendor",
        details: "Some details",
        credit: i % 2 === 0 ? 0 : 150,
        debit: i % 2 === 0 ? -150 : 0,
        balance: i % 2 === 0 ? -150 : 150,
        imageType: i % 2 === 0 ? 'image' : 'pdf',
      };
    })
  }
    
  render() {
    const {apiCallInProgress, apiCallType} = this.state;

    const columns = [
      {
        dataField: 'jeid',
        text: 'JE',
        headerClasses: 'k-header-cell',
        headerAlign: 'center',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        style: {textAlign: 'center'},
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      }, {
        dataField: 'movement',
        text: 'Movement',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      }, {
        dataField: 'batchId',
        text: 'Batch',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      }, {
        dataField: 'reference_one',
        text: 'Reference',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',

        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'date',
        text: 'Date',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{Moment(cell,'x').format("MM.DD.YY")}</div>
      },{
        dataField: 'vendor',
        text: 'Vendor',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'details',
        text: 'Details',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'credit',
        text: 'Credit',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'debit',
        text: 'Credit',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'balance',
        text: 'Credit',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'imageType',
        text: '',
        headerFormatter: (col, colIdx) => <ClipIcon />,
        formatter: (cell, row, index) => <div className='k-force' style={{padding: "8px 10px"}}>{cell === "image" ? <CameraIcon /> : <FileIcon />}</div>,
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '5%' }
      }
    ];

    return (
      <div className="canvas-container account-inquiry-container">
      <div className="category-chip-container">
        {this.categoryInformation({})}
        <div className="download-options" ><Button className="download-button">PDF</Button> | <Button className="download-button">XL</Button></div>
      </div>
      {
        apiCallInProgress && apiCallType === 'fetch'  
        ? null 
        : 
          <BootstrapTable 
            keyField='id' 
            data={this.generateData()} 
            columns={columns} 
            bordered={false}
            headerClasses="k-header-row"
            wrapperClasses="k-table-container"
            /> 
      }
      </div>
    );
  }
}


export default AccountInquiry;