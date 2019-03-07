import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
// import cellEditFactory from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../Batch/Batch.css'

class Batch extends Component {
  
  render() {
    const products = [{
      id : <div>12</div>,
      category : "0034 office and time",
      reference : '1234567',
      date : '12.03.19',
      vendor : "Honigman and co INC",
      details : 'new month new month',
      sum : "154,000.34"
    },{
      id : 13,
      category : "0034 office and time",
      reference : '1234567',
      date : '12.03.19',
      vendor : "Honigman and co INC",
      details : 'new month new month',
      sum : "154,000.34"
    },{
      id : 14,
      category : "0034 office and time",
      reference : '1234567',
      date : '12.03.19',
      vendor : "Honigman and co INC",
      details : 'new month new month',
      sum : "154,000.34"
    },{
      id : 15,
      category : "0034 office and time",
      reference : '1234567',
      date : '12.03.19',
      vendor : "Honigman and co INC",
      details : 'new month new month',
      sum : "154,000.34"
    },{
      id : 16,
      category : "0034 office and time",
      reference : '1234567',
      date : '12.03.19',
      vendor : "Honigman and co INC",
      details : 'new month new month',
      sum : "154,000.34"
    }];
    
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
      dataField: 'attachment',
      text: <span><i className="fal fa-paperclip"></i></span>,
      headerAlign: 'left',
      headerClasses: 'headerRowColumn',
      classes: 'cell',
      headerStyle: { width: '5%' }
    }
  ];
 
    const CaptionElement = () => <p style={{ marginLeft: '1%',color: '#828389',fontFamily: "Source Sans Pro",fontSize: '18px',fontWeight: '600' }}>008</p>;
    return <BootstrapTable 
                caption={<CaptionElement className="a"/>} 
                keyField='id' 
                data={products} 
                columns={columns} 
                bordered={false}
                headerClasses="header-class"
                wrapperClasses="tablewrap"
                />
  }
}


export default Batch;