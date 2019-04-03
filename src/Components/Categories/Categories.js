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
      "/getCategories",
      "POST", 
      {},
      (r) => {
        console.log("Categories received", r);
        this.setState({categories: JSON.parse(r.data.body), apiCallInProgress: false, apiCallType: 'none'})
      }
    );
  }

  render() {
    const {categories, apiCallInProgress, apiCallType} = this.state;

    const columns = [
      {
        dataField: 'categoryId',
        text: 'Id',
        headerClasses: 'k-header-cell',
        headerAlign: 'center',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        style: {textAlign: 'center'},
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      }, {
        dataField: 'categoryLabel',
        text: 'Category',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      }, {
        dataField: 'vatPercent',
        text: 'VAT %',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        headerStyle: { width: '10%' },
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      }, {
        dataField: 'categoryNo',
        text: 'Category No.',
        headerClasses: 'k-header-cell',
        classes: 'k-body-cell',
        formatter: (cell, row, index) => <div className='k-force'>{cell}</div>,
        editCellClasses: 'k-edit-cell'
      },
    ];
    const cellEdit = cellEditFactory({
      mode: 'click'
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
            keyField='categoryId' 
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