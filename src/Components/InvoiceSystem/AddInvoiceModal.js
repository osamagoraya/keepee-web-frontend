import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import './InvoiceSystem.css';
import Auth from '../../Services/Auth';

import {sendAuthenticatedAsyncRequest} from '../../Services/AsyncRequestService';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from 'react-select';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '../Common/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

import SwalAdvance from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Swal2 = withReactContent(SwalAdvance)

class AddInvoiceModal extends React.Component {
  
    state = {
        open : this.props.open,
        userList: this.props.userList,
        itemList: [{ index: 0,name:"", price: 0.0, quantity: 1}] // to add dynamic items
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.open !== this.state.open || nextProps.journalEntry !== this.state.journalEntry || nextProps.selectedUserId !== this.state.selectedUserId) { 
        this.setState({
            open : nextProps.open
        });
    }

};

handleClose = () => {
      //this.props.closeJournalEntryModal();
      this.setState({open: false});
}

addItem = () => {
    this.setState({ itemList: [...this.state.itemList, { index: this.state.itemList.length+1,name:"", price: 0, quantity: 0}]})
}

// handle item input change
handleInputChange = (e, index) => {

    const { name, value } = e.target;
    const list = [...this.state.itemList];
    if(name == "quantity" || name == "price") {
        list[index][name] = value;
        list[index]["amount"] = list[index]["quantity"] * list[index]["price"];
        console.log(list[index]["amount"]);
    }
    else {
        list[index][name] = value;
    }
    this.setState({ itemList: list});

  }


  subTotal = () => {
      var sum = 0;
    this.state.itemList.map((row, index) => {
        sum += row.amount;
    });
    return sum;
  }

  submitHandler = (event) => {
      
      Swal2.showLoading();
      event.preventDefault();
    
      var form = event.target;
      
      var itemsTable = document.getElementById('itemstable');
      var items =  [];
      console.log("Item",itemsTable.rows.item(1).cells.item(0).children[0].children[0].children[0].value);

      
      for (var i = 1; i < itemsTable.rows.length; i++) {
        items[i-1] = {};
        items[i-1]["name"] = itemsTable.rows.item(i).cells.item(0).children[0].children[0].children[0].value;
        items[i-1]["quantity"] = itemsTable.rows.item(i).cells.item(1).children[0].children[0].children[0].value;
        items[i-1]["price"] = itemsTable.rows.item(i).cells.item(2).children[0].children[0].children[0].value;
        items[i-1]["amount"] = itemsTable.rows.item(i).cells.item(3).children[0].children[0].children[0].value;
      }
      sendAuthenticatedAsyncRequest(
        "/saveInvoice",
        "POST", 
        {
            due_date : form.elements["due-date"].value,
            invoice_date: form.elements["invoice-date"].value,
            reference: form.elements["reference"].value,
            customer_name : form.elements["customer-name"].value,
            phone: form.elements["phone"].value,
            address : form.elements["address"].value,
            items: items,
            discount : 0,
            notes: form.elements["notes"].value
         },
        (r) => {
            Swal2.fire(
                'Success!',
                'Invoice Saved!',
                'success'
              )
              
              this.props.getUpdatedInvoices();
        },
        (r) => {
          console.log("Failing");
        }
      );
      this.setState({ open: false});
  }

  
render () {
     
    // const validationSchema = Yup.object().shape({
    //     reference: Yup.string(),
    //     due_date: Yup.date().required("נדרש"),
    //     invoice_date: Yup.date().required("נדרש"),
    //     quantity: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
    //     amount: Yup.number().typeError('חייב להיות מספר').required("נדרש"),
    //     price: Yup.number().typeError('חייב להיות מספר').required("נדרש")
    // })
     const { itemList } = this.state;
      return (
        <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            scroll="paper"
            fullScreen={true}
            aria-labelledby="scroll-dialog-title"
            PaperProps={{
                className:"document-modal-size"
              }}
            disableBackdropClick={true}
        >
            <DialogContent dividers="true">
                {/* <Formik
                    initialValues={{ 
                        due_date: moment().format('YYYY-MM-DD'), 
                        invoice_date: moment().format('YYYY-MM-DD'),
                        reference: "",
                        customer_name: "",
                        address: "",
                        phone: "",
                        notes: "",
                        subTotal: 0,
                        discount: 0,
                        total: 0
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log("Submit", values);
                        setSubmitting(false);
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                >
                    {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, submitForm }) => {
                       
                    return ( */}
                        <form onSubmit={this.submitHandler}>
                            <Typography align="center" component="h1">
                                New Invoice
                            </Typography>
                            <Typography align="left" component="h2">
                                Invoice Details
                            </Typography>
                            <Paper style={{ padding: 7 }}>
                                <div>
                                    <TextField 
                                        required
                                        type="date"  
                                        id="invoice-date"
                                        name="invoice-date" 
                                        label="Invoice Date" 
                                        defaultValue={moment().format('YYYY-MM-DD')}
                                        style={{ margin: '3%', width: "25%"}}
                                        size="small"
                                        variant="filled"
                                    />
                                    <TextField 
                                        required
                                        type="date" 
                                        id="due-date"
                                        name="due-date" 
                                        label="Due Date" 
                                        defaultValue={moment().format('YYYY-MM-DD')}
                                        style={{ margin: '3%', width: "25%"}}
                                        size="small"
                                        variant="filled"
                                    />
                                    <TextField 
                                        id="reference"
                                        label="Reference"
                                        name="reference" 
                                        style={{ margin: '3%', width: "25%"}}
                                        size="small"
                                        variant="filled"
                                    />
                                </div>
                                <div style={{ marginTop: "-5%"}}>
                                    <TextField 
                                        required
                                        name="customer-name" 
                                        label="Customer Name"
                                        style={{ margin: '3%', width: "25%"}}
                                        size="small"
                                        variant="filled"
                                    />
                                    <TextField 
                                        required
                                        name="address"
                                        label="Address"
                                        style={{ margin: '3%', width: "25%"}}
                                        size="small"
                                        variant="filled"
                                    />
                                    <TextField 
                                        required
                                        name="phone"
                                        label="Phone"
                                        style={{ margin: '3%', width: "25%"}}
                                        size="small"
                                        variant="filled"
                                    />
                                </div>
                            </Paper>
                            <Typography align="left" component="h2" style={{ marginTop: "2%" }}>
                                Items
                            </Typography>
                            <Paper style={{ padding: 40 }}>
                                <Table style={{ marginTop: "-5%"}} id="itemstable">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {itemList.map((row, i) => (
                                                <TableRow key={i}>
                                                    <TableCell align="right">
                                                        <TextField
                                                            name="name" 
                                                            required 
                                                            id="standard-required"
                                                            onChange={e => this.handleInputChange(e, i)}
                                                            value={row.name}
                                                            variant="filled"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            name="quantity"
                                                            required
                                                            type="number"
                                                            defaultValue="1"
                                                            onChange={e => this.handleInputChange(e, i)}
                                                            value={row.quantity}
                                                            variant="filled"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            name="price" 
                                                            required
                                                            type="decimal"
                                                            defaultValue="0.00"
                                                            onChange={e => this.handleInputChange(e, i)}
                                                            value={row.price}
                                                            variant="filled"
                                                        />   
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            name="amount" 
                                                            required
                                                            disabled
                                                            variant="filled"
                                                            type="number"
                                                            value={row.amount}
                                                        />   
                                                    </TableCell>
                                                </TableRow>
                                                ))}
                                        </TableBody>
                                </Table>
                                <Button variant="grey" className="float-right" type="button" onClick={this.addItem}>Add Item</Button>
                            </Paper>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: "3%" }}>
                                    <Paper style={{ padding: 40, width: 600 }}>
                                        <TextField
                                            name="notes"
                                            label="Notes"
                                            multiline
                                            rows={5}
                                            variant="filled"
                                            style={{ width: 500 }}
                                        />
                                    </Paper>
                                    <Paper style={{ padding: 40, width: 300, display: "flex", flexDirection: "column", justifyContent: "space-between",padding: "2%" }}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between",padding: "2%" }}>
                                            <label>SUB TOTAL</label>
                                            <label>{this.subTotal() ? this.subTotal() : 0 }</label>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between",padding: "2%" }}>
                                            <label>Discount(%)</label>
                                            <TextField
                                                name="amount" 
                                                required 
                                                id="amount"
                                                disabled
                                                value={0}
                                                variant="filled"
                                            />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between",padding: "2%" }}>
                                            <label>TOTAL</label>
                                            <label>{this.subTotal() ? this.subTotal() : 0 }</label>
                                        </div>
                                    </Paper>
                                </div>
                            <Button type="submit" variant="blue" className="float-right">Submit Invoice</Button>
                        </form>
                    {/* )}}
                </Formik> */}
            </DialogContent>
        </Dialog> 
      );
  }
}

export default AddInvoiceModal;