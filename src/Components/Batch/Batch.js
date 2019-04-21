import React, { Component } from 'react';
import Moment from 'moment';

import {BootstrapTable, cellEditFactory, Type} from '../Common/Table';
import '../Batch/Batch.css'
import Caption from '../Common/Caption';
import ClipIcon from '@material-ui/icons/AttachFile';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import Button from '../Common/Button';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import InvoiceDocumentModal from '../Invoice/InvoiceDocumentModal';
import swal from 'sweetalert';


class Batch extends Component {

  state = {
    selectedUserId: this.props.selectedUserId,
    selectedBatchId: this.props.match.params.batchId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    batch: null,
    categories: null
  }

  componentDidMount() {
    this.fetchBatchDetails(this.state.selectedBatchId, this.state.selectedUserId);
    this.fetchCategories();
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

  fetchCategories() {
    if (this.state.categories && this.state.categories.length !== 0){
      console.log("not fetching categories for batch, they exist", this.state.categories);
      return;
    }

    sendAuthenticatedAsyncRequest(
      "/getCategories",
      "POST", 
      null,
      (r) => this.setState({categories: JSON.parse(r.data.body)})
    );
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

  deleteJE = (je) => {
   
    console.log("Deleting journal entry:", je);

    if (je.id === -1) {
      const {batch} = this.state;
      batch.journal_entries.length = batch.journal_entries.length-1;
      this.setState({batch});
      return;
    }

    sendAuthenticatedAsyncRequest(  
      "/deleteJournalEntry",
      "POST", 
      {journalEntryId: je.id},
      (r) => {
        const {batch} = this.state;
        batch.journal_entries = batch.journal_entries.filter(j => j.id !== je.id);
        this.setState({batch})
      },
      (r) => {
        alert("Unable to delete Journal Entry");
      },
    );

  }

  updateJE(je) {
    console.log("Updating journal entry:", je);
    sendAuthenticatedAsyncRequest(  
      "/updateOpenJournalEntry",
      "POST", 
      je,
      (r) => {
        console.log("JE updated", r);
      },
      (r) => {
        console.log("JE update failed", r);
        alert("JE update failed");
      },
    );
  }
  

  addJE(je) {
    console.log("Adding journal entry:", je);
    const journalEntry = {
      reference_1: je.reference_one, 
      reference_2: je.reference_two, 
      jeDate: Moment(je.jeDate).format("YYYY-MM-DD"), 
      details: je.details, 
      categoryId: parseInt(je.categoryId, 10), 
      vat: parseInt(je.vat,10), 
      sum: parseInt(je.sum,10), 
      imageId: '', 
      vendorName: je.vendor,
      userId : this.state.selectedUserId,
      accountantId : ''
    }
    console.log("transformed JE", journalEntry)
    sendAuthenticatedAsyncRequest(  
      "/saveInvoiceData",
      "POST", 
      {values: journalEntry},
      (r) => {
        console.log("JE added", r);
        const {batch} = this.state;
        const response = JSON.parse(r.data.body);
        batch.journal_entries[batch.journal_entries.length-1].id = response.id;
        batch.journal_entries[batch.journal_entries.length-1].jeId = response.jeId;
        this.setState({batch: batch})
        swal ( "Success" ,  "Journal Entry Added Successfully!" ,  "success" )
      },
      (r) => {
        swal ( "Oops" ,  "Journal Entry insertion failed!" ,  "error" )
      },
    );
  }

  onJournalEntryUpdate = (oldValue, newValue, row, column) => {
    if (row.id === -1) {
      if (row.categoryId)
        row.vat = this.getCategoryAttribute(row.categoryId, 'vatpercent', this.state.categories || []) || "0";
      if (!row.reference_one || !row.jeDate || !row.details || !row.categoryId || !row.categoryId || !row.sum || !row.vat){
        console.log("incomplete data, not adding JE");
      } else {
        this.addJE(row);
      }
    } else {
      this.updateJE(row);
    }
  }

  addRow = () => {
    const {batch} = this.state;
    if (batch.journal_entries.filter(je => je.id === -1).length > 0)
      alert ("Please complete data for previously added JE");
    else {
      const emptyJE = {
        id: -1, jeid: '', reference_one: '', reference_two: '', jeDate: '', details: '', categoryId: '', vat: '', sum: '', imageType: '', vendor: '' 
      }
      batch.journal_entries.push(emptyJE);
      this.setState({ batch });
    }
  }

  getCategoryAttribute(categoryId, attribute, categories) {
    const matchedCategories = categories.filter(c => c.categoryId === categoryId);
    return (matchedCategories.length > 0
      ? matchedCategories[0][attribute]
      : null 
    );
  }
  
  render() {
    const {batch, apiCallInProgress, apiCallType, categories} = this.state;
    const columns = [
      {
        dataField: 'jeId',
        text: 'JE',
        headerClasses: 'k-header-cell',
        headerAlign: 'center',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        style: {textAlign: 'center'},
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editable: false,
      }, {
        dataField: 'categoryId',
        text: 'Category',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{
          categories
          ? this.getCategoryAttribute(cell, 'categoryLabel', categories)
          : row.categoryLabel
        }</div>,
        editCellClasses: 'k-edit-cell',
        editor: {
          type: Type.SELECT,
          options: categories ? categories.map(c => ({value: c.categoryId, label: c.categoryLabel})) : []
        }
      }, {
        dataField: 'reference_one',
        text: 'Ref 1',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell',
      }, {
        dataField: 'reference_two',
        text: 'Ref 2',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell',
      },
      {
        dataField: 'jeDate',
        text: 'Date',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{Moment(cell).format("MM.DD.YY")}</div>,
        editCellClasses: 'k-edit-cell',
      },{
        dataField: 'vendor',
        text: 'Vendor',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell',
      },
      {
        dataField: 'details',
        text: 'Details',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell',
      },
      {
        dataField: 'sum',
        text: 'Sum',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell',
      },
      {
        dataField: 'imageType',
        text: '',
        headerFormatter: (col, colIdx) => <ClipIcon />,
        formatter: (cell, row, index) => {
          if (row.imageType)
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
          else
              return <div className='k-force'>N/A</div>
        },
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '5%' },
        editable: false
      },
      {
        dataField: '',
        text: '',
        headerFormatter: (col, colIdx) => <DeleteIcon />,
        formatter: (cell, row, index) => (
          <div className='k-force' style={{padding: "8px 10px"}}>
            <DeleteIcon onClick={() => this.deleteJE(row)} />
          </div>
        ),
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '5%' },
        editable: false,
        hidden: batch && batch.batchStatus !== 'open',
      }
    ];  
  
    const cellEdit = cellEditFactory({ 
      mode: 'click', 
      afterSaveCell: this.onJournalEntryUpdate,
      blurToSave: true
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
            cellEdit={batch.batchStatus === 'open' ? cellEdit : undefined}
          /> 
            {
              batch.batchStatus === 'open'
              ? <Button className="left-bottom-fab-btn" fab onClick={this.addRow}>
                  <AddIcon />
                </Button>
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