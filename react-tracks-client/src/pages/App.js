import React from "react";
import {gql} from "apollo-boost";
import {Query} from "react-apollo";

import withStyles from "@material-ui/core/styles/withStyles";
import CreateTrack from "../components/Track/CreateTrack";
import SearchTracks from "../components/Track/SearchTracks";
import TrackList from "../components/Track/TrackList";
import Error from "../components/Shared/Error";
import Loading from "../components/Shared/Loading";

const App = ({classes}) => {
    return (
        <div className={classes.container}>
            <CreateTrack/>
            <SearchTracks/>
            <Query query={TRACK_LIST}>
                {({data, loading, error}) => {
                    if (loading) {
                        return <Loading/>;
                    }

                    if (error) {
                        return <Error error={error}/>
                    }

                    return <TrackList tracks={data.tracks}/>
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
