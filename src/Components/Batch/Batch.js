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

import FileIcon from '@material-ui/icons/Description';
import CameraIcon from '@material-ui/icons/CameraAlt';

import {sendAsyncRequestToOCR} from '../../Services/AsyncRequestService';
import JournalEntryModal from './JournalEntryModal';

class Batch extends Component {

  state = {
    selectedUserId: this.props.selectedUserId,
    selectedBatchId: this.props.match.params.batchId,
    apiCallInProgress: false,
    apiCallType: 'fetch',
    batch: null,
    categories: null,
    vendors: [],
    selectedJournalEntry: null,
    openJournalEntryModal: false
  }

  openJournalEntryModal = () => {
    this.setState({openJournalEntryModal : true});
  }
  closeJournalEntryModal = () => {
    this.props.history.push("/workspace/batch/"+this.state.selectedBatchId);
    this.setState({openJournalEntryModal: false});
  }
  componentDidMount() {
    this.fetchBatchDetails(this.state.selectedBatchId, this.state.selectedUserId);
    this.fetchCategories();
    this.fetchVendors();
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
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this JE!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        sendAuthenticatedAsyncRequest(  
          "/deleteJournalEntry",
          "POST", 
          {journalEntryId: je.id},
          (r) => {
            const {batch} = this.state;
            batch.journal_entries = batch.journal_entries.filter(j => j.id !== je.id);
            swal ( "Success" ,  "Journal entry deleted!" ,  "success" );
            this.setState({batch});
          },
          (r) => {
            alert("Unable to delete Journal Entry");
          },
        );
      } else {
        swal("Your Journal Entry is safe!");
      }
    });
    

  }

  updateJE(je) {
    console.log("Updating journal entry:", je);
    je.vendor = { name: je.vendorName }
    if(je.vatPercent < 1) {
      je.vat = 0.00;
      swal("Info" , "Cannot Update vat amount for JE with vat% 0!","info");
      return;
    }
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
      reference_1: je.reference_1, 
      reference_2: je.reference_2, 
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
        swal ( "Oops" ,  "Journal Entry Exists Already!" ,  "error" )
      },
    );
  }

  onJournalEntryUpdate = (oldValue, newValue, row, column) => {
    if (row.id === -1) {
      if (row.categoryId)
        row.vat = this.getCategoryAttribute(row.categoryId, 'vatpercent', this.state.categories || []) || "0";
      if (!row.reference_1 || !row.jeDate || !row.details || !row.categoryId || !row.sum || !row.vat){
        console.log("incomplete data, not adding JE : ", row);
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
        id: -1, jeid: '', reference_1: '', reference_2: '', jeDate: '', details: '', categoryId: '', vat: '', sum: '', imageType: '', vendorName: '' 
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

  fetchVendors() {
    if (this.state.vendors.length !== 0){
      console.log("not fetching vendors, they exist", this.state.vendors);
      return;
    }
  
    sendAsyncRequestToOCR(
      "/vendors",
      "GET", 
      {},
      (r) => {
        this.setState({vendors: r.data.vendorNames});
      },
      (r) => {
        console.log("Error!","Unable to fetch vendors");
      }
    );
  }

  getSelectedVendorObj() {

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
        dataField: 'reference_1',
        text: 'Ref 1',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell',
      }, {
        dataField: 'reference_2',
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
        formatter: (cell, row, index) => <div className='k-force'>{Moment(cell).format("DD.MM.YY")}</div>,
        editCellClasses: 'k-edit-cell',
        editor: {
          type: Type.DATE,
        }
      },{
        dataField: 'vendorName',
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
        formatter: (cell, row, index) => {
          return (
          <div className='k-force'>{cell}</div>
          );
        },
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
        dataField: 'vat',
        text: 'Vat',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => {
          return (
            <div className='k-force'>{row.vat}</div>
          );
        },
        editCellClasses: 'k-edit-cell'
      },
      {
        dataField: 'imageType',
        text: '',
        headerFormatter: (col, colIdx) => <ClipIcon />,
        formatter: (cell, row, index) => {
          if (row.imageType)
            return (
              <div className='k-force' style={{padding: "8px 10px"}}>
                <span style={{cursor: 'pointer'}}>
                {
                  // for selecting vendor in JE Modal form
                  row.imageType === "image" 
                  ? <CameraIcon onClick={() => {
                        if(this.state.vendors) {
                          this.state.vendors.forEach((vendor, index) => {
                            if( row.vendorName == vendor.name ){
                              row.selectedVendorObj = vendor;
                            }
                          });
                        }
                        this.setState({ selectedJournalEntry: row, openJournalEntryModal: true})
                  }}/> 
                  : row.imageType === "pdf" ? <FileIcon onClick={() => {
                        if(this.state.vendors) {
                          this.state.vendors.forEach((vendor, index) => {
                            if( row.vendorName == vendor.name ){
                              row.selectedVendorObj = vendor;
                            }
                          });
                        }
                        this.setState({ selectedJournalEntry: row, openJournalEntryModal: true})
                  }}/> : "N/A"
                }
                </span>
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
      { this.state.selectedJournalEntry !== null ?
      <JournalEntryModal 
            open={this.state.openJournalEntryModal} 
            journalEntry={this.state.selectedJournalEntry}
            selectedUserId={this.state.selectedUserId}
            closeJournalEntryModal={this.closeJournalEntryModal}
            batchStatus={batch.batchStatus}
            vendors={this.state.vendors}
      />
      : ''
      }
      </div>
    );
  }
}


export default Batch;