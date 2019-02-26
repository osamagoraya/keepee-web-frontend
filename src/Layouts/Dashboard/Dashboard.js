import React, { Component } from 'react';
import { Grid} from '@material-ui/core'
import './Dashboard.css';
import Navbar from '../../Components/Dashboard/Navbar';
import Menubar from '../../Components/Dashboard/Menubar';
import Topbar from '../../Components/Dashboard/Topbar';




class Dashboard extends Component {
    render() {
        return (
            <Grid container style={{ minHeight: '100vh'}}>
                    <Grid container item  sm={2}>
                        <Navbar />
                        <Menubar />
                    </Grid>
                    <Grid container item sm={10} wrap="nowrap" direction="column">
                        <Topbar />
                        <Grid container item sm={12} style={{ justifyContent: 'space-around'}}>
                          <Grid item sm={9}  style={{ borderRadius: '3px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.04)' , backgroundColor: '#f8f8f8', height: '70vh', marginLeft: '-12%' }}>
                            <div>
                                content
                            </div>
                          </Grid>
                        </Grid>
                    </Grid>
            </Grid>
        );
    }
}

export default Dashboard;