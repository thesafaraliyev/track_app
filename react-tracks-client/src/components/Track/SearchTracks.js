import React, {useState, useRef} from "react";
import {ApolloConsumer} from "react-apollo";
import {gql} from "apollo-boost";

import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import ClearIcon from "@material-ui/icons/Clear";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const SearchTracks = ({classes, searchResults}) => {
    const [query, setQuery] = useState("");
    const inputEl = useRef(null);


    const clearSearchInput = () => {
        searchResults([]);
        setQuery("");
        inputEl.current.focus();
    }


    const handleSubmit = async (event, client) => {
        event.preventDefault();
        const response = await client.query({
            query: SEARCH_TRACKS,
            variables: {query}
        });

        searchResults(response.data.tracks);
    }


    return (
        <ApolloConsumer>
            {client => (
                <form onSubmit={event => handleSubmit(event, client)}>
                    <Paper className={classes.root} elevation={1}>
                        <IconButton>
                            <ClearIcon onClick={clearSearchInput}/>
                        </IconButton>
                        <TextField
                            fullWidth
                            placeholder="Search all tracks"
                            InputProps={{
                                disableUnderline: true
                            }}
                            onChange={event => setQuery(event.target.value)}
                            value={query}
                            inputRef={inputEl}
                        />
                        <IconButton type="submit">
                            <SearchIcon/>
                        </IconButton>
                    </Paper>
                </form>
            )}
        </ApolloConsumer>
    );
};


const SEARCH_TRACKS = gql`
query ($query: String) {
  tracks(search: $query) {
    id
    title
    description
    url
    author {
        id
        username
    }
    likes {
        id
    }
  }
}

`;

const styles = theme => ({
    root: {
        padding: "2px 4px",
        margin: theme.spacing.unit,
        display: "flex",
        alignItems: "center"
    }
});

export default withStyles(styles)(SearchTracks);
