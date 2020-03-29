import React, { Component } from 'react';

import {BootstrapTable, cellEditFactory, Type} from '../Common/Table';

import Button from '../Common/Button';
import Caption from '../Common/Caption';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

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

  updateCategory(category) {
    console.log("Updating category:", category);
    this.setState({apiCallInProgress: true, apiCallType: 'update'});
    sendAuthenticatedAsyncRequest(  
      "/updateCategory",
      "POST", 
      category,
      (r) => {
        console.log("Category updated", r);
        //TODO: update categories in state, or do we need to?
        this.setState({apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => {
        console.log("Category update failed", r);
        alert("Category update failed");
        //TODO: remove category changes from state
        this.setState({apiCallInProgress: false, apiCallType: 'none'})
      },
    );
  }

  addCategory(category) {
    console.log("Adding category:", category);
    this.setState({apiCallInProgress: true, apiCallType: 'add'});
    sendAuthenticatedAsyncRequest(  
      "/addCategory",
      "POST", 
      category,
      (r) => {
        console.log("Category added", r);
        const {categories} = this.state;
        categories[0].id = parseInt(r.data.body, 10);
        this.setState({categories: categories, apiCallInProgress: false, apiCallType: 'none'})
      },
      (r) => {
        console.log("Category addition failed", r);
        alert("Category addition failed");
        this.setState({apiCallInProgress: false, apiCallType: 'none'})
      },
    );
  }

  deleteCategory = (category) => {
   
    console.log("Deleting category:", category);

    if (category.id === -1) {
      const {categories} = this.state;
      categories.shift();
      this.setState({categories});
      return;
    }

    sendAuthenticatedAsyncRequest(  
      "/deleteCategory",
      "POST", 
      {categoryId: category.id},
      (r) => {
        const {categories} = this.state;
        const updatedCategories = categories.filter(c => c.id !== category.id);
        this.setState({categories: updatedCategories})
      },
      (r) => {
        alert("Unable to delete Journal Entry");
      },
    );

  }

  onCategoryUpdate = (oldValue, newValue, row, column) => {
    console.log("Category data updated",oldValue, newValue, row, column);
    if (row.id === -1) {
      // adding new category
      if (!row.name || !row.vat || !row.categoryNo || !row.type){
        console.log("incomplete data, not adding category")
      } else {
        this.addCategory(row);
      }
    } else {
      // updating existing category
      this.updateCategory(row);
    }
  }

  columns = [
    {
      dataField: 'id',
      text: 'Id',
      headerClasses: 'k-header-cell',
      classes: 'k-body-cell',
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
      editor: {
        type: Type.SELECT,
        options: [
          {
            value: 'credit',
            label: 'credit'
          },
          {
            value: 'debit',
            label: 'debit'
          }
        ]
      }
    },{
      dataField: 'vatCategoryNo',
      text: 'Vat Category No',
      headerClasses: 'k-header-cell',
      classes: 'k-body-cell',
      formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
      editCellClasses: 'k-edit-cell'
    },
    {
      dataField: '',
      text: '',
      headerFormatter: (col, colIdx) => <DeleteIcon />,
      formatter: (cell, row, index) => (
        <div className='k-force' style={{padding: "8px 10px"}}>
          <DeleteIcon onClick={() => this.deleteCategory(row)} />
        </div>
      ),
      headerClasses: 'k-header-cell',
      classes: 'k-body-cell',
      headerStyle: { width: '5%' },
      editable: false,
    }
  ];

  addRow = () => {
    const {categories} = this.state;
    if (categories.filter(c => c.id === -1).length > 0)
      alert ("Please complete data for previously added category");
    else {
      const emptyCat = {
        id: -1, name: "", group: "", subGroup: "", vat: "", taxAdvances: "",withHolding: "", categoryNo: "",type: "", vatCategoryNo: ""
      }
      categories.splice(0, 0, emptyCat);
      this.setState({
        categories: categories
      });
    }
  }
  render() {
    const {categories, apiCallInProgress, apiCallType} = this.state;
    
    const cellEdit = cellEditFactory({
      mode: 'click',
      afterSaveCell: this.onCategoryUpdate,
      blurToSave: true
    });
    return (
      <div className="canvas-container categories-container">
      {apiCallInProgress && apiCallType === 'fetch' 
        ? <Caption style={{ marginLeft: '60px', marginBottom: '10px', }}> Fetching Categories ...</Caption>
        : null
      }
      {
        (apiCallInProgress && apiCallType === 'fetch') || !categories
        ? null 
        : <span>
          <Button className="top-right-fab-btn" fab disabled={apiCallInProgress} onClick={this.addRow}>
            <AddIcon />
          </Button>
          <BootstrapTable 
            // caption={<CaptionElement className="a"/>} 
            keyField='id' 
            data={categories} 
            columns={this.columns} 
            bordered={false}
            headerClasses="k-header-row"
            wrapperClasses="k-table-container"
            cellEdit={cellEdit}
            /> 
          </span>
      }
      </div>
    );
  }
}


export default Categories;