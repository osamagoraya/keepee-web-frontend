import React, { Component } from 'react';
import { Grid} from '@material-ui/core'
import './Dashboard.css';
import Navbar from '../../Components/Dashboard/Navbar';
import Menubar from '../../Components/Dashboard/Menubar';
import Topbar from '../../Components/Dashboard/Topbar';

class Dashboard extends Component {
    render() {
        return (
            <div>
                <Grid container direction="row" justify="flex-start" style={{ minHeight: '100vh'}}>
                    <Grid container item  sm={3}> 
                        <Navbar />
                        <Menubar />
                    </Grid>
                    <Grid container item sm={9}> 
                        <Topbar />
                        <Grid item sm={12} style={{ height: '90vh'}}>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Dashboard;