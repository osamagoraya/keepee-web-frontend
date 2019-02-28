import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import './Invoices.css';
import Button from "@material-ui/core/es/Button/Button";
import Input from "@material-ui/core/es/Input/Input";
import logoReport from '../../Assets/Images/Path_981.svg';
import IconButton from "@material-ui/core/es/IconButton/IconButton";

class Invoices extends Component {
    render(){
        return (
            <Grid container className="containerMain">
                <Grid container item  style={{ flexBasis: '20%', alignItems: 'flex-end',justifyContent: 'space-evenly'}}>
                    <Grid item style={{ flexBasis: '80%', paddingBottom: '3.4%'}}>
                        <Button size="small" className="invoiceSubmitBtn">
                            Continue
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item  style={{ flexBasis: '30%', flexDirection:"column", justifyContent: 'center'}}>
                    <Grid  container item style={{ flexBasis: '50%', justifyContent: 'space-evenly'}}>
                        <Input
                            placeholder="Date"
                            inputProps={{
                                'aria-label': 'date',
                            }}
                            className="inputFields"
                        />
                        <Input
                            placeholder="Category"
                            inputProps={{
                                'aria-label': 'category',
                            }}
                            className="inputFields"
                        />
                        <Input
                            placeholder="Sum"
                            inputProps={{
                                'aria-label': 'sum',
                            }}
                            className="inputFields"
                        />
                        <Input
                            placeholder="Vendor"
                            inputProps={{
                                'aria-label': 'vendor',
                            }}
                            className="inputFields"
                        />
                        <Input
                            placeholder="Detail"
                            inputProps={{
                                'aria-label': 'detail',
                            }}
                            className="inputFields"
                        />
                        <Input
                            placeholder="Vat"
                            inputProps={{
                                'aria-label': 'vat',
                            }}
                            className="inputFields"
                        />
                    </Grid>
                </Grid>
                <Grid container item  style={{ flexBasis: '50%' , flexDirection:"column", justifyContent: 'center'}}>
                    <Grid item style={{ flexBasis: '60%'}} className="invoiceImageBox">
                            <img src="" alt="coming soon"/>
                    </Grid>
                    <Grid container item style={{ flexBasis: '15%', width: '80%' , alignContent: 'center', justifyContent: 'space-around'}}>
                        <Grid item container style={{ flexBasis: '80%', alignContent: 'center', justifyContent: 'space-around'}}>
                            <Button size="small" className="invoicesImageBoxBtn" style={{}}>
                                <p className="invoicesImageBoxBtnText">Not Relevant</p>
                            </Button>
                            <Button size="small" className="invoicesImageBoxBtn">
                                <p className="invoicesImageBoxBtnText">New picture</p>
                            </Button>
                            <IconButton size="small" className="invoicesImageBoxBtn" aria-label="Delete" style={{ backgroundColor: '#d0cccc', width:'9%'}}>
                                <img src={logoReport}/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Invoices;