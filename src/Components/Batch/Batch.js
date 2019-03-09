import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
// import cellEditFactory from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../Batch/Batch.css'
import Caption from '../Common/Caption';
import ClipIcon from '@material-ui/icons/AttachFile';
import FileIcon from '@material-ui/icons/Description';

class Batch extends Component {

  renderStubData () {
    return [1,2,3,4,5,6,7,8,9,10].map((i) => {
      return {
        id : <div>{i}</div>,
        category : <div>0034 office and time</div>,
        reference : <div>1234567</div>,
        date : <div>12.03.19</div>,
        vendor : <div>Honigman and co INC</div>,
        details : <div> new month new month</div>,
        sum : <div> 154,000.34</div>,
        invoiceType: <FileIcon />
      }
    })
  }
  
  render() {
    const columns = [{
      dataField: 'id',
      text: 'JE',
      headerAlign: 'center',
      headerClasses: 'headerRowColumn',
      classes: 'cell',
      headerStyle: { width: '10%' }
    }, {
      dataField: 'category',
      text: 'Category',
      headerAlign: 'left',
      headerClasses: 'headerRowColumn',
      classes: 'cell'
    }, {
      dataField: 'reference',
      text: 'Reference',
      headerAlign: 'left',
      headerClasses: 'headerRowColumn',
      classes: 'cell',
      headerStyle: { width: '10%' }
    },
    {
      dataField: 'date',
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
      dataField: 'invoiceType',
      text: <ClipIcon />,
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
        008
      </Caption>
      <BootstrapTable 
        // caption={<CaptionElement className="a"/>} 
        keyField='id' 
        data={this.renderStubData()} 
        columns={columns} 
        bordered={false}
        headerClasses="header-class"
        wrapperClasses="tablewrap"
        />
      </div>
    );
  }
}


export default Batch;