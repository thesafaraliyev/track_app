from graphene import ObjectType, Schema
import graphql_jwt

from track.schema import Query as TrackQuery, Mutation as TrackMutation
from cuser.schema import Query as UserQuery, Mutation as UserMutation
from like.schema import Query as LikeQuery, Mutation as LikeMutation


class Query(UserQuery, TrackQuery, LikeQuery, ObjectType):
    pass


class Mutation(UserMutation, TrackMutation, LikeMutation, ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = Schema(query=Query, mutation=Mutation)
