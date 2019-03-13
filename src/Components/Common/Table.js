import OBootstrapTable from 'react-bootstrap-table-next';
import OcellEditFactory from 'react-bootstrap-table2-editor';
import './Common.css';

/**
 * -- Bootstrap Table classess --
 * headerClasses="k-header-row"
 * wrapperClasses="k-table-container"
 * 
 * -- Column classes --
 * headerClasses: 'k-header-cell'
 * classes: 'k-body-cell'
 * formatter: (cell, row, index) => <div className='k-force'>{cell}</div>
 */

export const BootstrapTable = OBootstrapTable;
export const cellEditFactory = OcellEditFactory;