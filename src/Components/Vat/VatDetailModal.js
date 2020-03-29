import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Caption from '../Common/Caption';
import DialogTitle from '@material-ui/core/DialogTitle';
import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import './Vat.css';
import Moment from 'moment';
import Button from '../Common/Button';

import {BootstrapTable, Type} from '../Common/Table';

class VatDetailModal extends React.Component {
  state = {
        vatReportId : this.props.vatReportId,
        field : this.props.field,
        open : this.props.open,
        categories: null,
        journalEntries : null,
        apiCallInProgress: false,
        apiCallType: 'fetch'
  };

  componentWillReceiveProps(nextProps) {
        if(nextProps.open !== this.state.open || nextProps.vatReportId !== this.state.vatReportId || nextProps.field !== this.state.field) { 
            this.setState({
                open : nextProps.open,
                vatReportId: nextProps.vatReportId,
                field : nextProps.field
            });
            console.log("received props",nextProps);
            this.fetchFieldDetails(nextProps.vatReportId, nextProps.field);
        }

  };

  componentDidMount() {
      console.log("props",this.props);
      console.log("state",this.state);
    this.fetchFieldDetails(this.state.vatReportId, this.state.field);
    this.fetchCategories();
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


  fetchFieldDetails(vatReportId, field) {
    if ( !vatReportId || !field) {
      console.log("Incomplete information to fetch the batch", vatReportId, field);
      return;
    }
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(
      "/vatFieldDetails",
      "POST", 
      {vatReportId: vatReportId, field: field},
      (r) => {
        console.log("journal entries received", r);
        this.setState({journalEntries: r.data.result, apiCallInProgress: false, apiCallType: 'none'})
      }
    );
  }

  getCategoryAttribute(categoryId, attribute, categories) {
    const matchedCategories = categories.filter(c => c.categoryId === categoryId);
    return (matchedCategories.length > 0
      ? matchedCategories[0][attribute]
      : null 
    );
  }

  handleClose = () => {
      this.setState({open: false});
  }

  render (){
      const {apiCallInProgress,apiCallType,journalEntries,categories} = this.state;
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
          dataField: 'referenceOne',
          text: 'Ref 1',
          headerClasses: 'k-header-cell',
          classes: 'k-body-cell',
          headerStyle: { width: '10%' },
          formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
          editCellClasses: 'k-edit-cell',
        }, {
          dataField: 'referenceTwo',
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
        }
      ];  
      return (
        <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            PaperProps={{
                className:"vat-detail-modal-size"
              }}
        >
            <DialogTitle id="scroll-dialog-title">
            <Caption style={{
                marginLeft: '30px',
                marginBottom: '-20px',
            }}>
                {apiCallInProgress && apiCallType === 'fetch' ? "Fetching data ..." : "JEs Detail"}
            </Caption>
            </DialogTitle>
            <DialogContent dividers="true">
            <div className="canvas-container batch-container">
      {
        (apiCallInProgress && apiCallType === 'fetch') || !journalEntries
         ? null 
         : <span>
          <BootstrapTable 
            keyField='id' 
            data={journalEntries} 
            columns={columns} 
            bordered={false}
            headerClasses="k-header-row"
            wrapperClasses="k-table-container"
          />
        </span>
      }
      </div>
            </DialogContent>
            <DialogActions>
            <Button 
                      variant="grey" 
                      className="vat-modal-button" 
                      size="small"
                      onClick={this.handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog> 
      );
  }
}

export default VatDetailModal;