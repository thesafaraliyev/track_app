import React from "react";
import {Link} from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import RadioIcon from "@material-ui/icons/RadioTwoTone";
import FaceIcon from "@material-ui/icons/FaceTwoTone";
import Typography from "@material-ui/core/Typography";

import withStyles from "@material-ui/core/styles/withStyles";
import Signout from "../Auth/Signout";

const Header = ({classes, currentUser}) => {
    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar>
                {/*Title, logo*/}
                <Link to="/" className={classes.grow}>
                    <RadioIcon className={classes.logo} color="secondary"/>
                    <Typography variant="headline" color="secondary" noWrap>
                        ReactTracks
                    </Typography>
                </Link>

                {/*User profile*/}
                {currentUser && (
                    <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
                        <FaceIcon className={classes.faceIcon}/>
                        <Typography variant="headline" className={classes.username} noWrap>
                            {currentUser.username}
                        </Typography>
                    </Link>
                )}

                {/*Sign out*/}
                <Signout/>
            </Toolbar>
        </AppBar>
    );
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: 0,
        padding: 0
    },
    grow: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        textDecoration: "none"
    },
    logo: {
        marginRight: theme.spacing.unit,
        fontSize: 45
    },
    faceIcon: {
        marginRight: theme.spacing.unit,
        fontSize: 30,
        color: "white"
    },
    username: {
        color: "white",
        fontSize: 30
    }
});

export default withStyles(styles)(Header);
