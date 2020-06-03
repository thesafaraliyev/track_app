import React from "react";
import withRoot from "./withRoot";

import {Query} from "react-apollo";
import {gql} from "apollo-boost";


const Root = () => <Query query={TRACK_LIST}>
    {({data, loading, error}) => {
        if (loading) {
            return <div>Loading..</div>;
        }

        if (error) {
            return <div>Error</div>
        }

        console.log(data)
        return <div>{JSON.stringify(data)}</div>
    }}


</Query>;


const TRACK_LIST = gql`
{
  tracks {
    id
    title
    description
    url
    
  }
}
`

export default withRoot(Root);
