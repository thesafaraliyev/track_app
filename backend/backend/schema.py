from graphene import ObjectType, Schema

from track.schema import Query as TrackQuery, Mutation as TrackMutation
from cuser.schema import Query as UserQuery, Mutation as UserMutation


class Query(TrackQuery, UserQuery, ObjectType):
    pass


class Mutation(UserMutation, TrackMutation, ObjectType):
    pass


schema = Schema(query=Query, mutation=Mutation)
