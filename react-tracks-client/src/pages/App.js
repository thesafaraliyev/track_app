import React, {useState}from "react";
import {gql} from "apollo-boost";
import {Query} from "react-apollo";

import withStyles from "@material-ui/core/styles/withStyles";
import CreateTrack from "../components/Track/CreateTrack";
import SearchTracks from "../components/Track/SearchTracks";
import TrackList from "../components/Track/TrackList";
import Error from "../components/Shared/Error";
import Loading from "../components/Shared/Loading";

const App = ({classes}) => {
    const [searchResults, setSearchResults] = useState([]);

    return (
        <div className={classes.container}>
            <CreateTrack/>
            <SearchTracks searchResults={setSearchResults}/>
            <Query query={TRACK_LIST}>
                {({data, loading, error}) => {
                    if (loading) {
                        return <Loading/>;
                    }

                    if (error) {
                        return <Error error={error}/>
                    }

                    const tracks = searchResults.length > 0 ? searchResults : data.tracks;
                    return <TrackList tracks={tracks}/>
                }}
            </Query>
        </div>
    );
};


export const TRACK_LIST = gql`
{
  tracks {
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
`


const styles = theme => ({
    container: {
        margin: "0 auto",
        maxWidth: 960,
        padding: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(App);
