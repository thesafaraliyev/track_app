import React from "react";

import {Query} from "react-apollo";
import {gql} from "apollo-boost";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ThumbUpIcon from "@material-ui/icons/ThumbUpTwoTone";
import AudiotrackIcon from "@material-ui/icons/AudiotrackTwoTone";
import withStyles from "@material-ui/core/styles/withStyles";

import Divider from "@material-ui/core/Divider";
import AudioPlayer from "../components/Shared/AudioPlayer";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import format from "date-fns/format";

const Profile = ({classes, match}) => {
    const profileId = match.params.id;

    return (
        <Query query={PROFILE_QUERY} variables={{id: profileId}}>
            {({data, loading, error}) => {
                if (loading) {
                    return <Loading/>;
                }

                if (error) {
                    return <Error error={error}/>
                }

                data.user.likeSet.map(({track}) => console.log(track))


                return (
                    <div>
                        <Card className={classes.card}>
                            <CardHeader
                                avatar={<Avatar>{data.user.username[0].toUpperCase()}</Avatar>}
                                title={data.user.username}
                                subheader={`Joined ${format(data.user.dateJoined, 'MMM Do, YYYY')}`}
                            />
                        </Card>


                        <Paper elevation={1} className={classes.paper}>
                            <Typography variant="title" className={classes.title}>
                                <AudiotrackIcon className={classes.audioIcon}/>
                                Created tracks
                            </Typography>
                            {data.user.trackSet.map(track => (
                                <div key={track['id']}>
                                    <Typography>
                                        {track.title} &middot; {track.likes.length}
                                    </Typography>
                                    <AudioPlayer url={track.url}/>
                                    <Divider className={classes.divider}/>
                                </div>
                            ))}
                        </Paper>


                        <Paper elevation={1} className={classes.paper}>
                            <Typography variant="title" className={classes.title}>
                                <ThumbUpIcon className={classes.thumbIcon}/>
                                Liked tracks
                            </Typography>
                            {data.user.likeSet.map(({track}) => (
                                <div key={track.id}>
                                    <Typography>
                                        {track.title} &middot; {track.likes.length} Likes &middot; {track.author.username}
                                    </Typography>
                                    <AudioPlayer url={track.url}/>
                                    <Divider className={classes.divider}/>
                                </div>
                            ))}
                        </Paper>
                    </div>
                )
            }}
        </Query>
    );
};


const PROFILE_QUERY = gql`
query ($id: Int!) {
  user(id: $id) {
    id
    username
    dateJoined
    likeSet {
      id
      track {
        id
        title
        description
        url
        likes {
          id
        }
        author {
          id
          username
        }
      }
    }
    trackSet {
      id
      title
      description
      url
      likes {
        id
      }
    }
  }
}
`;


const styles = theme => ({
    paper: {
        width: "auto",
        display: "block",
        padding: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        [theme.breakpoints.up("md")]: {
            width: 650,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    card: {
        display: "flex",
        justifyContent: "center"
    },
    title: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing.unit * 2
    },
    audioIcon: {
        color: "purple",
        fontSize: 30,
        marginRight: theme.spacing.unit
    },
    thumbIcon: {
        color: "green",
        marginRight: theme.spacing.unit
    },
    divider: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    }
});

export default withStyles(styles)(Profile);
