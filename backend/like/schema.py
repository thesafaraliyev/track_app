from django.shortcuts import get_object_or_404

import graphene
from graphql import GraphQLError
from graphene_django import DjangoObjectType

from .models import Like
from track.schema import TrackType
from track.models import Track
from cuser.schema import UserType


class LikeType(DjangoObjectType):
    class Meta:
        model = Like


class Query(graphene.ObjectType):
    likes = graphene.List(LikeType)

    def resolve_likes(self, info):
        return Like.objects.all()


class CreateLike(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Unauthorized')

        track = get_object_or_404(Track, id=track_id)

        Like.objects.create(user=user, track=track)
        return CreateLike(user=user, track=track)


class Mutation(graphene.ObjectType):
    create_like = CreateLike.Field()
