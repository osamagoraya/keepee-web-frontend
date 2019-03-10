import React, { Component } from 'react';
import Moment from 'moment';

import BootstrapTable from 'react-bootstrap-table-next';
// import cellEditFactory from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../Batch/Batch.css'
import Caption from '../Common/Caption';
import ClipIcon from '@material-ui/icons/AttachFile';
import FileIcon from '@material-ui/icons/Description';
import CameraIcon from '@material-ui/icons/CameraAlt';
import AddIcon from '@material-ui/icons/Add';

import Button from '../Common/Button';

import InvoiceForm from '../Forms/InvoiceForm/InvoiceForm';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import Auth from '../../Services/Auth';
import DismissableDialog from '../Common/DismissableDialog';

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
    selectedBatchId: this.props.match.params.batchId,
    apiCallInProgress: true,
    apiCallType: 'fetch',
    batch: null
  }

  componentDidMount() {
    this.fetchBatchDetails(this.state.selectedBatchId);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.batchId !== this.state.selectedBatchId)
    {
      this.setState({selectedBatchId: nextProps.match.params.batchId});
      this.fetchBatchDetails(nextProps.match.params.batchId);
    }
  }

  fetchBatchDetails(batchId) {
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/getBatch",
      "POST", 
      {batchId: batchId},
      (r) => this.setState({batch: r.data, apiCallInProgress: false, apiCallType: 'none'})
    );
  }

  confirmBatch () {
    this.setState({apiCallInProgress: true, apiCallType: 'confirm'});
    sendAuthenticatedAsyncRequest(
      "/confirmBatch",
      "POST", 
      {batchId: this.state.selectedBatchId},
      (r) => {
        this.setState({apiCallInProgress: false, apiCallType: 'none'});
        this.props.history.push("/workspace/batch");
      }
    );
  }

  batchName = (batch) => {
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
        headerAlign: 'center',
        headerClasses: 'headerRowColumn',
        classes: 'cell',
        headerStyle: { width: '10%' }
      }, {
        dataField: 'categoryLabel',
        text: 'Category',
        headerAlign: 'left',
        headerClasses: 'headerRowColumn',
        classes: 'cell'
      }, {
        dataField: 'reference_one',
        text: 'Ref 1',
        headerAlign: 'left',
        headerClasses: 'headerRowColumn',
        classes: 'cell',
        headerStyle: { width: '10%' }
      }, {
        dataField: 'reference_two',
        text: 'Ref 2',
        headerAlign: 'left',
        headerClasses: 'headerRowColumn',
        classes: 'cell',
        headerStyle: { width: '10%' }
      },
      {
        dataField: 'jeDate',
        formatter: (cell, row, index) => (Moment(cell,'x').format("MM.DD.YY")),
        text: 'Date',
        headerAlign: 'left',
        headerClasses: 'headerRowColumn',
        classes: 'cell',
        headerStyle: { width: '10%' }
      },{
        dataField: 'vendor',
        text: 'Vendor',
        headerAlign: 'left',
        headerClasses: 'headerRowColumn',
        classes: 'cell'
      },
      {
        dataField: 'details',
        text: 'Details',
        headerAlign: 'left',
        headerClasses: 'headerRowColumn',
        classes: 'cell'
      },
      {
        dataField: 'sum',
        text: 'Sum',
        headerAlign: 'left',
        headerClasses: 'headerRowColumn',
        classes: 'cell'
      },
      {
        dataField: 'imageType',
        text: '',
        headerFormatter: (col, colIdx) => <ClipIcon />,
        formatter: (cell) => cell === "image" ? <CameraIcon /> : <FileIcon />,
        headerAlign: 'left',
        headerClasses: 'headerRowColumn',
        classes: 'cell',
        headerStyle: { width: '5%' }
      }
    ];
    
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
        apiCallInProgress && apiCallType === 'fetch'  
        ? null 
        : <span>
          <BootstrapTable 
            // caption={<CaptionElement className="a"/>} 
            keyField='id' 
            data={batch.journal_entries} 
            columns={columns} 
            bordered={false}
            headerClasses="header-class"
            wrapperClasses="tablewrap"
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