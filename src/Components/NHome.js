import React, { Component } from 'react';
import { Grid, AppBar , Toolbar , Typography, IconButton, Paper, MenuItem, TextField } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import ReactSelect from './ReactSelect'
import './NHome.css';
import PrimarySearchAppBar from "./PrimarySearchAppBar";

class AppBarComponent extends Component {
    render() {
        return (
            <div>
                <Grid container direction="row" justify="flex-start" md={12} lg={12} style={{ minHeight: '100vh'}}>
                    <Grid container item  md={3} lg={3}> {/* bar components */}
                        <Grid item md={2} lg={2} style={{ backgroundColor : '#3794a5'}}>  {/* nav bar */}

                        </Grid>
                        <Grid item md={10} lg={10} style={{ backgroundColor: '#f5f4f4'}}> {/* menu bar */}

                        </Grid>
                    </Grid>
                    <Grid container direction="row" item md={9} lg={9}> {/* top and canvas bar */}
                        <Grid item md={12} lg={12} style={{ height: '20vh'}}>
                            <PrimarySearchAppBar />
                        </Grid >
                        <Grid item md={12} lg={12} style={{ height: '80vh'}}>

                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default AppBarComponent;