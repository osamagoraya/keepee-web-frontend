import React, { Component } from 'react';
import Moment from 'moment';

import {BootstrapTable, cellEditFactory, Type} from '../Common/Table';
import '../Batch/Batch.css'
import Caption from '../Common/Caption';
import ClipIcon from '@material-ui/icons/AttachFile';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import VisibilityIcon from '@material-ui/icons/Visibility';

import Button from '../Common/Button';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import swal from 'sweetalert';


import SwalAdvance from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Swal2 = withReactContent(SwalAdvance)



class Suppliers extends Component {

  state = {
    batch: null,
    userList: [],
    invoiceList: [],
    addInvoiceModal : false
  }

  componentWillMount() {
     //this.getUsers();
     this.getInvoices(true);
  }
  

  getUsers = (user) => {
    sendAuthenticatedAsyncRequest(
      "/getUsers",
      "POST", 
      {accountantId: 3},
      (r) => this.setState({ userList: this.filterUsersForSelect(JSON.parse(r.data.body)) })
    );
  }

  getInvoices = () => {
    sendAuthenticatedAsyncRequest(
      "/getInvoices",
      "POST", 
      {},
      (r) => {
        console.log("response",r);
        this.setState({ invoiceList: JSON.parse(r.data.body), addInvoiceModal: false })
      }
    );
  }

  filterUsersForSelect = (list) => {
    if(!list)
      return;

    return list.map(userRow => {
      return {
        value: parseInt(userRow.userId,10),
        label: userRow.name
      }
    });
  }

  fetchInvoices() {
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

  deleteInvoice = (je) => {
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

  updateInvoice() {
    
  }
  
  addInvoice() {
    
  }

  onJournalEntryUpdate = (oldValue, newValue, row, column) => {
    if (row.id === -1) {
      
       if (row.categoryId)
        row.vatPercent = this.getCategoryAttribute(row.categoryId, 'vatpercent', this.state.categories || []) || "0";
      
      if (!row.reference_1 || !row.jeDate || !row.details || !row.categoryId || !row.sum || !row.vatPercent){
        console.log("incomplete data, not adding JE : ", row);
      } else {
        this.addJE(row);
      }
    } else {
      this.updateJE(row);
    }
  }

  OpenAddInvoiceModal = () => {
    this.setState({ addInvoiceModal: true });
  }
  render() {
    const {apiCallInProgress, apiCallType, categories} = this.state;
    const columns = [
      {
        dataField: 'invoice_date',
        text: 'Display Name',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        style: {textAlign: 'center'},
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editable: false,
      }, {
        dataField: 'user_name',
        text: 'Phone',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>צרכן</div>,
        editable: false
      }, {
        dataField: 'status',
        text: 'Email',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>לא משולם</div>,
        editable: false
      },
      {
        dataField: '',
        text: 'Actions',
        formatter: (cell, row, index) => (
          <div className='k-force' style={{padding: "8px 10px"}}>
            <div style={{ display: 'flex'}}> <VisibilityIcon /> <SendIcon /> <EditIcon /> <FileCopyIcon /> <DeleteIcon  /> </div>
          </div>
        ),
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '5%' },
        editable: false,
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
          : ""
        }
      </Caption>
      {
        <span>
          <BootstrapTable 
            // caption={<CaptionElement className="a"/>} 
            keyField='id' 
            data={[]} 
            columns={columns} 
            bordered={false}
            headerClasses="k-header-row"
            wrapperClasses="k-table-container"
            cellEdit={cellEdit}
          />
          {
            <Button className="left-bottom-fab-btn" fab onClick={this.OpenAddInvoiceModal}>
                <AddIcon />
            </Button> 
          }
          </span>
          
      }
      
      </div>
    );
  }
}


export default Suppliers;