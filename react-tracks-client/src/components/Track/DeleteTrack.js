import React, {useContext} from "react";
import {Mutation} from "react-apollo";
import {gql} from "apollo-boost";

import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";

import {UserContext} from "../../Root";
import {TRACK_LIST} from "../../pages/App";

const DeleteTrack = ({track}) => {
    const currentUser = useContext(UserContext);
    const isCurrentUser = currentUser.id === track.author.id;


    const handleUpdateCache = (cache, {data: {deleteTrack}}) => {
        const data = cache.readQuery({query: TRACK_LIST})
        const index = data.tracks.findIndex(track => Number(track.id) === deleteTrack.trackId);

        const tracks = [...data.tracks.slice(0, index), ...data.tracks.slice(index + 1)];

        cache.writeQuery({query: TRACK_LIST, data: {tracks}});
    }

    return isCurrentUser && (
        <Mutation
            mutation={DELETE_TRACK_MUTATION}
            variables={{trackId: track.id}}
            onCompleted={data => {
                console.log(data)
            }}
            update={handleUpdateCache}
        >
            {deleteTrack => (
                <IconButton onClick={deleteTrack}>
                    <TrashIcon/>
                </IconButton>
            )}
        </Mutation>
    );
};


const DELETE_TRACK_MUTATION = gql`
mutation ($trackId: Int!) {
  deleteTrack(trackId: $trackId) {
    trackId
  }
}
`;

export default DeleteTrack;
