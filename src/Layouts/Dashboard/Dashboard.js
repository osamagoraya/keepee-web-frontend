import React, { Component } from 'react';
import { Grid} from '@material-ui/core'
import './Dashboard.css';
import Navbar from '../../Components/Dashboard/Navbar';
import Menubar from '../../Components/Dashboard/Menubar';
import Topbar from '../../Components/Dashboard/Topbar';

class Dashboard extends Component {
    render() {
        return (
            <Grid container justify="flex-start" style={{ minHeight: '100vh'}}>
                    <Grid container item  sm={3}>
                        <Navbar />
                        <Menubar />
                    </Grid>
                    <Grid container item sm={9} wrap="nowrap" direction="column">
                        <Topbar />
                        <Grid item sm={12}>
                        </Grid>
                    </Grid>
            </Grid>
        );
    }
}

export default Dashboard;