import React, {useState} from "react";
import {Mutation} from "react-apollo";
import {gql} from "apollo-boost";

import Error from "../Shared/Error";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";


function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

const Register = ({classes, setNewUser}) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);


    const handleSubmit = (event, createUser) => {
        event.preventDefault();
        createUser();
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LibraryMusicIcon/>
                </Avatar>

                <Typography variant="headline">
                    Register
                </Typography>
                <Mutation
                    mutation={REGISTER_MUTATION}
                    variables={{username, email, password}}
                    onCompleted={data => {
                        console.log(data)
                        setOpen(true)
                    }}
                >
                    {(createUser, {loading, error}) => {
                        return (
                            <form onSubmit={event => handleSubmit(event, createUser)} className={classes.form}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="username">Username</InputLabel>
                                    <Input id="username" onChange={event => setUsername(event.target.value)}/>
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input id="email" type="email" onChange={event => setEmail(event.target.value)}/>
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input id="password" type="password"
                                           onChange={event => setPassword(event.target.value)}/>
                                </FormControl>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                    disabled={loading || !email.trim() || !username.trim() || !password.trim()}
                                >
                                    {loading ? "Registering.." : "Register"}
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setNewUser(false)}
                                >
                                    Already have account? Log in here
                                </Button>

                                {/*Error handling*/}
                                {error && <Error error={error}/>}
                            </form>
                        )
                    }}
                </Mutation>
            </Paper>


            <Dialog disableBackdropClick={true} open={open} TransitionComponent={Transition}>
                <DialogTitle>
                    <VerifiedUserTwoTone className={classes.icon}/>
                    New account
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        User {username} successfully created!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={() => setNewUser(false)}>
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

const REGISTER_MUTATION = gql`
mutation($username: String!, $email: String!, $password: String!) {
  createUser (username: $username, email: $email, password: $password) {
    user {
      id
      username
    }
  }
}
`

const styles = theme => ({
    root: {
        width: "auto",
        display: "block",
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up("md")]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing.unit * 2
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        color: theme.palette.openTitle
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%",
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2
    },
    icon: {
        padding: "0px 2px 2px 0px",
        verticalAlign: "middle",
        color: "green"
    }
});

export default withStyles(styles)(Register);
