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

    return isCurrentUser && (
        <Mutation
            mutation={DELETE_TRACK_MUTATION}
            variables={{trackId: track.id}}
            onCompleted={data => {
                console.log(data)
            }}
            refetchQueries={() => [{query: TRACK_LIST}]}
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
