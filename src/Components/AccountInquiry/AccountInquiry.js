import React, { Component } from 'react';
import Moment from 'moment';

import {withRouter} from 'react-router-dom';
import queryString from 'query-string';

import {BootstrapTable} from '../Common/Table';
import './AccountInquiry.css'
import Chip from '@material-ui/core/Chip';
import ClipIcon from '@material-ui/icons/AttachFile';
import FileIcon from '@material-ui/icons/Description';
import CameraIcon from '@material-ui/icons/CameraAlt';
import Button from '@material-ui/core/Button';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import Auth from '../../Services/Auth';

class AccountInquiry extends Component {

  state = {
    apiCallInProgress: true,
    apiCallType: 'fetch',
    searchString: this.props.location.search,
    filters: queryString.parse(this.props.location.search),
    loggedInUser: Auth.getLoggedInUser()
  }

  componentDidMount() {
    this.fetchAccountInquiry(this.state.filters);
  }
  
  componentWillReceiveProps(nextProps) {
    const {search} = nextProps.location;
    if (search === this.state.searchString){
      console.log("props received but same search params");
    } else {
      console.log("new props received", nextProps.location.search);
      const filters = queryString.parse(nextProps.location.search);
      this.setState({
        searchString: nextProps.location.search,
        filters: filters
      });
      this.fetchAccountInquiry(filters);
    }
  }

  fetchAccountInquiry(filters) {
    if (Object.entries(filters).length === 0 
        && filters.constructor === Object){
      console.log("empty filters, not fetching report");
      return;
    } else console.log("fetching data for: ",filters)
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/accountInquiry",
      "POST", 
      {
        accountantId: this.state.loggedInUser.userId , 
        minCategoryNum: filters.minCat , 
        maxCategoryNum: filters.maxCat , 
        minDate: filters.minDate , 
        maxDate: filters.maxDate
      },
      (r) => this.setState({report: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  categoryInformation(report,apiCallInProgress) {
    if (apiCallInProgress)
      return "Loading ...";

    return Object.keys(report).map((k,i)=>
      <Chip className='category-chip' label={k} key={i} onDelete={() => console.log("delete clicked for ",k)}/>
    );

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

  prepareData(data) {
    return data.map(d => {
      return {
        ...d,
        credit: parseFloat(d.sum) > 0 ? d.sum : 0,
        debit: parseFloat(d.sum) <= 0 ? d.sum : 0,
        balance: d.sum
      }
    });
  }
    
  render() {
    const {apiCallInProgress, apiCallType, report} = this.state;
    console.log(report);

    const columns = [
      {
        dataField: 'je_id',
        text: 'JE',
        headerClasses: 'k-header-cell',
        headerAlign: 'center',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        style: {textAlign: 'center'},
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      }, {
        dataField: 'movement_no',
        text: 'Movement',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      }, {
        dataField: 'batch_id',
        text: 'Batch',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      }, {
        dataField: 'reference_1',
        text: 'Reference',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',

        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'je_date',
        text: 'Date',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{Moment(cell,'x').format("MM.DD.YY")}</div>
      },{
        dataField: 'vendor_name',
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
        formatter: (cell, row, index) => <div className='k-force'>{parseFloat(cell) > 0 ? cell : 0}</div>
      },
      {
        dataField: 'debit',
        text: 'Debit',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'balance',
        text: 'Balance',
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
        {this.categoryInformation(report,apiCallInProgress)}
        <div className="download-options" ><Button className="download-button">PDF</Button> | <Button className="download-button">XL</Button></div>
      </div>
      {
        apiCallInProgress && apiCallType === 'fetch'  
        ? null 
        : [ <BootstrapTable 
            keyField='id' 
            data={[]} 
            columns={columns} 
            bordered={false}
            headerClasses="k-header-row"
            wrapperClasses="k-table-container"
            />,
            Object.keys(report).map((k,i) => {
              return (
                <BootstrapTable 
                key={i}
                keyField='id' 
                data={this.prepareData(report[k])} 
                columns={columns} 
                bordered={false}
                headerClasses="k-header-row k-hidden-row"
                wrapperClasses="k-table-container"
                /> 
              );
            })
          ]
      }
      </div>
    );
  }
}


export default withRouter(AccountInquiry);