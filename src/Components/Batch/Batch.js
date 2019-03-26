import React, { Component } from 'react';
import Moment from 'moment';

import {BootstrapTable, cellEditFactory} from '../Common/Table';
import '../Batch/Batch.css'
import Caption from '../Common/Caption';
import ClipIcon from '@material-ui/icons/AttachFile';
import AddIcon from '@material-ui/icons/Add';

import Button from '../Common/Button';

import InvoiceForm from '../Forms/InvoiceForm/InvoiceForm';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import Auth from '../../Services/Auth';
import DismissableDialog from '../Common/DismissableDialog';
import InvoiceDocumentModal from '../Invoice/InvoiceDocumentModal';

class InvoiceFormDialog extends Component {

  state = {
    isSubmitting: false
  }

  formSubmitter = null;
  bindSubmitForm(submitter) {
    console.log("submitted updated");
    this.formSubmitter = submitter ;
  }


  render () {
    const {isSubmitting} = this.state;
    const button = (
      <Button className="left-bottom-fab-btn" fab onClick={() => this.refs["createJeDialog"].handleClickOpen() }>
        <AddIcon />
      </Button>
    );
    return (
      <DismissableDialog
        ref="createJeDialog"
        openDialogButton={button}
        title="Create Invoice"
      >
        <InvoiceForm 
          onSubmit={() => {
            this.setState({isSubmitting: false});
            this.props.onSubmit();
          }}
          bindSubmitForm={this.bindSubmitForm.bind(this)}
          loggedInUser={Auth.getLoggedInUser()}
        />
        <Button 
            variant="blue" 
            // disabled={isSubmitting} TODO: allow this, currently backend fails
            disabled={true} 
            onClick={(e) => {
              this.setState({isSubmitting: true});
              this.formSubmitter(e)}
          }>
            {isSubmitting ? "Creating ...": "continue"}
          </Button>
      </DismissableDialog>
    );
  }
}

class Batch extends Component {

  state = {
    selectedUserId: this.props.selectedUserId,
    selectedBatchId: this.props.match.params.batchId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    batch: null,
  }

  componentDidMount() {
    this.fetchBatchDetails(this.state.selectedBatchId, this.state.selectedUserId);
  }
  
  componentWillReceiveProps(nextProps) {
    const {batchId} = nextProps.match.params;
    const {selectedUserId} = nextProps;
    if (batchId !== this.state.selectedBatchId || selectedUserId !== this.state.selectedUserId){
      this.setState({
        selectedBatchId: batchId,
        selectedUserId: selectedUserId
      });
      this.fetchBatchDetails(batchId, selectedUserId);
    }
  }

  fetchBatchDetails(batchId, selectedUserId) {
    if ( !batchId || !selectedUserId) {
      console.log("Incomplete information to fetch the batch", batchId, selectedUserId);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getBatch",
      "POST", 
      {batchId: batchId, userId: selectedUserId},
      (r) => {
        console.log("batch received", r);
        this.setState({batch: r.data.result, apiCallInProgress: false, apiCallType: 'none'})
      }
    );
  }

  confirmBatch () {
    this.setState({apiCallInProgress: true, apiCallType: 'confirm'});
    sendAuthenticatedAsyncRequest(
      "/confirmBatch",
      "POST", 
      {batchId: this.state.selectedBatchId, userId: this.state.selectedUserId},
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none'});
        this.props.history.push("/workspace/batch");
      }
    );
  }

  batchName = (batch) => {
    if (!batch) {
      return `No batch data. ${!this.state.selectedUserId ? "Selecting a user is mandatory" : ""}`;
    }
    let name = batch.batchId.toString();
    if (name.length === 1) return "00"+name;
    else if (name.length === 2) return "0"+name;
    else return name;
  }

  
  render() {
    const {batch, apiCallInProgress, apiCallType} = this.state;

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
        dataField: 'categoryLabel',
        text: 'Category',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      }, {
        dataField: 'reference_one',
        text: 'Ref 1',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      }, {
        dataField: 'reference_two',
        text: 'Ref 2',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
      },
      {
        dataField: 'jeDate',
        text: 'Date',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{Moment(cell).format("MM.DD.YY")}</div>
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
        dataField: 'sum',
        text: 'Sum',
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
    const cellEdit = cellEditFactory({
      mode: 'dbclick'
    });
    return (
      <div className="canvas-container batch-container">
      <Caption style={{
        marginLeft: '60px',
        marginBottom: '10px',
      }}>
        {apiCallInProgress && apiCallType === 'fetch' 
          ? "Fetching data ..."
          : this.batchName(batch)
        }
      </Caption>
      {
        (apiCallInProgress && apiCallType === 'fetch') || !batch
        ? null 
        : <span>
          <BootstrapTable 
            // caption={<CaptionElement className="a"/>} 
            keyField='id' 
            data={batch.journal_entries} 
            columns={columns} 
            bordered={false}
            headerClasses="k-header-row"
            wrapperClasses="k-table-container"
            cellEdit={cellEdit}
            /> 
            {
              batch.batchStatus === 'open'
              ? <InvoiceFormDialog onSubmit={() => this.fetchBatchDetails(batch.batchId)}/> // count not bumped on list view
              : null  
            }
            {
              batch.batchStatus === 'open' && batch.journal_entries.length > 0
              ? <Button className="right-bottom-btn" variant="blue" onClick={this.confirmBatch.bind(this)}>
                  {apiCallInProgress && apiCallType === 'confirm' 
                    ? "Confirming ..."
                    : "Confirm"
                    }
                </Button>
              : null  
            }
          </span>
      }
      </div>
    );
  }
}


export default Batch;