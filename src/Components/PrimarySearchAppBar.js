import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ReactSelect from "./ReactSelect";
import Avatar from '@material-ui/core/Avatar';
import {ProfileImage} from '../kk.jpg'


const styles = theme => ({
    root: {
        width: 'inherit',
        boxShadow: 'none',
        backgroundColor: 'transparent'
    },
    grow: {
        flexGrow: 1,
    },
    search: {
        position: 'relative',
        border: 'none',
        backgroundColor: 'transparent',
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        display: 'flex',
        width: '100%',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: 'inherit',
        position: 'relative',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 'inherit',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
});

class PrimarySearchAppBar extends React.Component {
    state = {
        anchorEl: null,
        mobileMoreAnchorEl: null,
    };


    render() {
        const { classes } = this.props;

        return (
            <div>
                <AppBar position="static" className={classes.root}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Open drawer">
                            <SearchIcon />
                        </IconButton>
                        <div className={classes.search}>
                            <ReactSelect />
                        </div>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                aria-owns='material-appbar'
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"
                            >
                                <Avatar alt="Remy Sharp" src={ProfileImage} className={classes.avatar} />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

PrimarySearchAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);