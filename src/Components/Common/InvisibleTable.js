import React from 'react';
import MTable from '@material-ui/core/Table';
import MTableBody from '@material-ui/core/TableBody';
import MTableCell from '@material-ui/core/TableCell';
import MTableHead from '@material-ui/core/TableHead';
import MTableRow from '@material-ui/core/TableRow';

export const TableCell = (props) => (
  <MTableCell 
    {...props} 
    classes={{
      root: 'k-invisible-table-cell', 
      head: 'k-invisible-table-head',
      body: 'k-invisible-table-body'
    }}>
    {props.children}
  </MTableCell>
);

export const InvisibleTable = (props) => (
  <MTable classes={{root: 'k-invisible-table'}} {...props}>
    {props.children}
  </MTable>
);

export const TableBody = MTableBody;
export const TableHead = MTableHead;
export const TableRow = (props) => (
  <MTableRow classes={{root:  `k-invisible-table${props.height ? props.height : ''}-row`}} {...props}>
    {props.children}
  </MTableRow>
);

