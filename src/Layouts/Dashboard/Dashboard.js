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
                    <Grid container item  sm={2}>
                        <Navbar />
                        <Menubar />
                    </Grid>
                    <Grid container item sm={10} wrap="nowrap" direction="column">
                        <Topbar />
                        <Grid item sm={12}>
                          <Grid container item alignItems="center" sm={11} style={{backgroundColor: "white", minHeight: "80vh"}}>
                            content
                          </Grid>
                        </Grid>
                    </Grid>
            </Grid>
        );
    }
}

export default Dashboard;