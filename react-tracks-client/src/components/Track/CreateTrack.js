import React, {useState} from "react";
import {Mutation} from "react-apollo";
import {gql} from "apollo-boost";

import axios from 'axios';

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";

import Error from "../Shared/Error";
import withStyles from "@material-ui/core/styles/withStyles";
import {TRACK_LIST} from '../../pages/App';


const CreateTrack = ({classes}) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [fileError, setFileError] = useState("");


    const handleAudioFile = event => {
        const selectedFile = event.target.files[0];

        if (selectedFile && selectedFile.size > 10000000) { // 10MB
            setFileError(`${selectedFile.name} File is too large.`);
        } else {
            setFile(selectedFile);
            setFileError("");
        }
    }


    const handleAudioUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('resource_type', 'raw');
            formData.append('upload_preset', 'react-tracks');
            formData.append('cloud_name', 'elishka');

            return 'https://api.cloudinary.com/v1_1/';
            const response = await axios.post('https://api.cloudinary.com/v1_1/elishka/raw/upload', formData);
            return response.data.url;
        } catch (e) {
            setSubmitting(false);
            console.error('Error occurred!', e);
        }
    }

    const handleSubmit = async (event, createTrack) => {
        event.preventDefault();
        setSubmitting(true);

        const url = await handleAudioUpload();
        createTrack({variables: {title, description, url}});
    }


    return (
        <>
            <Button onClick={() => setOpen(true)} className={classes.fab} variant="fab" color="secondary">
                {open ? <ClearIcon/> : <AddIcon/>}
            </Button>

            <Mutation
                mutation={CREATE_TRACK_MUTATION}
                onCompleted={data => {
                    setOpen(false);
                    setSubmitting(false);
                    setTitle("");
                    setDescription("");
                    setFile("");
                }}
                refetchQueries={() => [{query: TRACK_LIST}]}
            >
                {(createTrack, {loading, error}) => {
                    if (error) {
                        return <Error error={error}/>
                    }

                    return (
                        <Dialog className={classes.dialog} open={open}>
                            <form onSubmit={event => handleSubmit(event, createTrack)}>
                                <DialogTitle>Create Track</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Add a Title, Description & Audio File (up to 10MB)
                                    </DialogContentText>

                                    <FormControl fullWidth>
                                        <TextField
                                            onChange={event => setTitle(event.target.value)}
                                            label="Title"
                                            placeholder="Add a title"
                                            className={classes.textField}
                                            value={title}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <TextField
                                            onChange={event => setDescription(event.target.value)}
                                            multiline
                                            rows="3"
                                            label="Description"
                                            placeholder="Add a description"
                                            className={classes.textField}
                                            value={description}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth error={Boolean(fileError)}>
                                        <input
                                            onChange={handleAudioFile}
                                            accept="audio/mp3,audio/wav"
                                            id="audio"
                                            required type="file"
                                            className={classes.input}
                                        />
                                        <label htmlFor="audio">
                                            <Button
                                                variant="outlined"
                                                color={file ? "secondary" : "inherit"}
                                                component="span"
                                                className={classes.button}
                                            >
                                                Audio file <LibraryMusicIcon className={classes.icon}/>
                                            </Button>
                                            {file && file.name}
                                            <FormHelperText>{fileError}</FormHelperText>
                                        </label>
                                    </FormControl>

                                </DialogContent>

                                <DialogActions>
                                    <Button disabled={submitting} onClick={() => setOpen(false)}
                                            className={classes.cancel}>
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={submitting || !file || !title.trim() || !description.trim()}
                                        type="submit"
                                        className={classes.save}
                                    >
                                        {submitting ?
                                            <CircularProgress size={24} className={classes.save}/> : "Add track"}
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>
                    );
                }}
            </Mutation>

        </>
    );
};


const CREATE_TRACK_MUTATION = gql`
mutation($title: String!, $description: String!, $url: String) {
  createTrack(title: $title, description: $description, url: $url) {
    track {
        id
        title
        description
        url
        author {
            id
            username
        }
    }
  }
}

`;

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    dialog: {
        margin: "0 auto",
        maxWidth: 550
    },
    textField: {
        margin: theme.spacing.unit
    },
    cancel: {
        color: "red"
    },
    save: {
        color: "green"
    },
    button: {
        margin: theme.spacing.unit * 2
    },
    icon: {
        marginLeft: theme.spacing.unit
    },
    input: {
        display: "none"
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
        zIndex: "200"
    }
});

export default withStyles(styles)(CreateTrack);
