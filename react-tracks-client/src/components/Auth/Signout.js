import React from "react";
import {ApolloConsumer} from "react-apollo";

import withStyles from "@material-ui/core/styles/withStyles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const Signout = ({classes}) => {
    const handleSignOut = client => {
        localStorage.removeItem('API_AUTH_TOKEN');
        client.writeData({data: {isLoggedIn: false}});
    }


    return (
        <ApolloConsumer>
            {client => (
                <Button onClick={() => handleSignOut(client)}>
                    <Typography variant="body1" color="secondary">
                        Sign out
                    </Typography>
                    <ExitToApp className={classes.buttonIcon} color="secondary"/>
                </Button>
            )}
        </ApolloConsumer>
    );
};

const styles = {
    root: {
        cursor: "pointer",
        display: "flex"
    },
    buttonIcon: {
        marginLeft: "5px"
    }
};

export default withStyles(styles)(Signout);
