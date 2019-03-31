import React, { Component } from 'react';
import Moment from 'moment';

import {withRouter} from 'react-router-dom';
import queryString from 'query-string';

import {BootstrapTable} from '../Common/Table';
import './AccountInquiry.css'
import Chip from '@material-ui/core/Chip';
import ClipIcon from '@material-ui/icons/AttachFile';
import InvoiceDocumentModal from '../Invoice/InvoiceDocumentModal';
import Button from '@material-ui/core/Button';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import GreenHeader from '../Common/GreenHeader';

class AccountInquiry extends Component {

  state = {
    apiCallInProgress: true,
    apiCallType: 'fetch',
    searchString: this.props.location.search,
    filters: queryString.parse(this.props.location.search),
    selectedUserId: this.props.selectedUserId,
    isValid: false
  }

  componentDidMount() {
    this.fetchAccountInquiry(this.state.filters, this.state.selectedUserId);
  }
  
  componentWillReceiveProps(nextProps) {
    const {search} = nextProps.location;
    if (search === this.state.searchString && nextProps.selectedUserId === this.state.selectedUserId){
      console.log("props received but same search params");
    } else {
      console.log("new props received", nextProps.location.search, nextProps.selectedUserId);
      const filters = queryString.parse(nextProps.location.search);
      this.setState({
        searchString: nextProps.location.search,
        filters: filters,
        selectedUserId: nextProps.selectedUserId
      });
      this.fetchAccountInquiry(filters, nextProps.selectedUserId);
    }
  }

  fetchAccountInquiry(filters, selectedUserId) {
    if (Object.entries(filters).length === 0 
        && filters.constructor === Object){
      console.log("empty filters, not account inquiry fetching report");
      return;
    }
    if (!selectedUserId) {
      console.log("no user id, not fetching account inquiry report");
      return;
    }
    const {minCat,maxCat,minDate,maxDate} = filters;
    if (!minCat || !maxCat || !minDate || !maxDate){
      console.log("NOT fetching account inquity, some values are missing", filters);
      this.setState({isValid: false, report: undefined});
      return;
    }

    console.log("Everything seems fine, fetching account inquiry report for user", selectedUserId);
    this.setState({isValid: true, apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/accountInquiry",
      "POST", 
      {
        userId: selectedUserId , 
        minCategoryNum: minCat , 
        maxCategoryNum: maxCat , 
        minDate: minDate , 
        maxDate: maxDate
      },
      (r) => this.setState({report: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  categoryInformation(report,apiCallInProgress, isValid, selectedUserId) {
    // console.log("categoryInformation", report, apiCallInProgress);
    if (!selectedUserId)
      return "Selecting a user is mandatory";

    if (!isValid)
      return "All parameters are mandatory.";

    if (apiCallInProgress)
      return "Loading ...";

    if (!report || Object.keys(report).length === 0)
      return "No records in report. Adjust parameters accordingly.";

    return Object.keys(report).map((k,i)=>
      <Chip className='category-chip' label={k} key={i} onDelete={() => console.log("delete clicked for ",k)}/>
    );

  }

  prepareData(data) {
    return data.map(d => {
      let balance = d.type === "debit" ? -1 * parseFloat(d.sum): parseFloat(d.sum);
      return {
        ...d,
        credit: d.type === "credit" ? balance: 0,
        debit: d.type === "debit" ? balance: 0,
        balance: balance
      }
    });
  }

  render() {
    const {apiCallInProgress, apiCallType, report, isValid, selectedUserId} = this.state;
    console.log("rendering account inquiry: ", report);
    // console.log("account inquiry ", report);

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
        formatter: (cell, row, index) => <div className='k-force'>{Moment(cell).format("MM.DD.YY")}</div>
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
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
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
        formatter: (cell, row, index) => {
          return (
            <div className='k-force' style={{padding: "8px 10px"}}>
              <InvoiceDocumentModal 
                documentType={row.imageType}
                documentPath={row.imageLink}
                selectedImageId={row.id}
                uniqueKey={`batchDoc${row.id}`}
              />
            </div>
          );
        },
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '5%' }
      }
    ];

    return (
      <div className="canvas-container account-inquiry-container">
      <div className="category-chip-container">
        {this.categoryInformation(report, apiCallInProgress, isValid, selectedUserId)}
        <div className="download-options" ><Button className="download-button">PDF</Button> | <Button className="download-button">XL</Button></div>
      </div>
      {
        (apiCallInProgress && apiCallType === 'fetch') || (!report || Object.keys(report).length === 0)
        ? null 
        : <div> 
          <BootstrapTable 
            keyField='id' 
            data={[]} 
            columns={columns} 
            bordered={false}
            headerClasses="k-header-row"
            wrapperClasses="k-table-container"
            />
          {
            Object.keys(report).map((k,i) => {
              const data = this.prepareData(report[k]);
              const totalBalance = data.map(d => d.balance).reduce((sum, curr) => sum+curr);
              return (
                <div className="k-table-container" key={i}>
                  <GreenHeader leftLabel={k} rightLabel={`Balance ${totalBalance}`}/>
                  <BootstrapTable 
                  keyField='id' 
                  data={data} 
                  columns={columns} 
                  bordered={false}
                  headerClasses="k-header-row k-hidden-row"
                  /> 
                </div>
              );
            })
          }
          </div>
      }
      </div>
    );
  }
}


export default withRouter(AccountInquiry);