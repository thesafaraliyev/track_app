from django.shortcuts import get_object_or_404
from django.db.models import Q

import graphene
from graphql import GraphQLError
from graphene_django import DjangoObjectType

from .models import Track


class TrackType(DjangoObjectType):
    class Meta:
        model = Track


class Query(graphene.ObjectType):
    tracks = graphene.List(TrackType, search=graphene.String())

    def resolve_tracks(self, info, search=None):
        if search:
            filters = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(url__icontains=search) |
                Q(author__username__icontains=search)
            )
            return Track.objects.filter(filters)

        return Track.objects.all()


class CreateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, title, description, url):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Unauthorized.')

        track = Track(title=title, description=description, url=url, author=user)
        track.save()
        return CreateTrack(track=track)


class UpdateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, track_id, title=None, description=None, url=None):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Unauthorized.')

        track = get_object_or_404(Track, id=track_id)

        if track.author != user:
            raise GraphQLError('Not permitted to update this track.')

        track.url = url if url else track.url
        track.title = title if title else track.title
        track.description = description if description else track.description
        track.save()

        return UpdateTrack(track=track)


class DeleteTrack(graphene.Mutation):
    track_id = graphene.Int()

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Unauthorized')

        track = get_object_or_404(Track, id=track_id)

        if track.author != user:
            raise GraphQLError('Not permitted to delete this track.')

        track.delete()

        return DeleteTrack(track_id=track_id)


class Mutation(graphene.ObjectType):
    create_track = CreateTrack.Field()
    update_track = UpdateTrack.Field()
    delete_track = DeleteTrack.Field()
