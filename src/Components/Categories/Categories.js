import React, { Component } from 'react';

import {BootstrapTable, cellEditFactory} from '../Common/Table';

import Button from '../Common/Button';
import Caption from '../Common/Caption';
import AddIcon from '@material-ui/icons/Add';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';

import './Categories.css';


class Categories extends Component {

  state = {
    apiCallInProgress: false,
    apiCallType: 'fetch',
    categories: null,
  }

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories() {
    const {apiCallInProgress} = this.state;
    if ( apiCallInProgress ) {
      console.log("Not making a new request to fetch categories.");
      return;
    }
    console.log("Fetching categories.");
    this.setState({apiCallInProgress: true, apiCallType: 'fetch'});
    sendAuthenticatedAsyncRequest(  
      "/getCategoriesDetail",
      "POST", 
      {},
      (r) => {
        console.log("Categories received", r);
        this.setState({categories: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      }
    );
  }

  onCategoryUpdate = (oldValue, newValue, row, column) => {
    console.log("Category data updated",oldValue, newValue, row, column);
  }

  render() {
    const {categories, apiCallInProgress, apiCallType} = this.state;

    const columns = [
      {
        dataField: 'id',
        text: 'Id',
        headerClasses: 'k-header-cell',
        headerAlign: 'center',
        classes: 'k-body-cell',
        style: {textAlign: 'center'},
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell',
        hidden: true,
      }, {
        dataField: 'name',
        text: 'Category',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      }, {
        dataField: 'group',
        text: 'Group',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      }, {
        dataField: 'subGroup',
        text: 'sub Group',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      },{
        dataField: 'vat',
        text: 'Vat %',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      },{
        dataField: 'taxAdvances',
        text: 'Tax Advances',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      },{
        dataField: 'withHolding',
        text: 'With holding',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      },{
        dataField: 'categoryNo',
        text: 'Category No',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      },{
        dataField: 'type',
        text: 'Type',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell',
        hidden: true
      },{
        dataField: 'vatCategoryNo',
        text: 'Vat Category No',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      },
    ];
    const cellEdit = cellEditFactory({
      mode: 'click',
      afterSaveCell: this.onCategoryUpdate,
      blurToSave: true
    });
    return (
      <div className="canvas-container categories-container">
      <Caption style={{
          marginLeft: '60px',
          marginBottom: '10px',
        }}>
          {apiCallInProgress && apiCallType === 'fetch' 
            ? "Fetching Categories ..."
            : null
          }
        </Caption>
      {
        (apiCallInProgress && apiCallType === 'fetch') || !categories
        ? null 
        : <span>
          <BootstrapTable 
            // caption={<CaptionElement className="a"/>} 
            keyField='id' 
            data={categories} 
            columns={columns} 
            bordered={false}
            headerClasses="k-header-row"
            wrapperClasses="k-table-container"
            cellEdit={cellEdit}
            /> 
            <Button className="left-bottom-fab-btn" fab>
              <AddIcon />
            </Button>
          </span>
      }
      </div>
    );
  }
}


export default Categories;