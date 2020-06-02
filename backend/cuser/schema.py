from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType

User = get_user_model()


class UserType(DjangoObjectType):
    class Meta:
        model = User
        only_fields = ('id', 'password', 'username', 'email')


class Query(graphene.ObjectType):
    user = graphene.Field(UserType, id=graphene.Int(required=True))

    def resolve_user(self, info, id):
        return User.objects.get(id=id)


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String()
        username = graphene.String()
        password = graphene.String()

    def mutate(self, info, username, password, email):
        user = User(username=username, email=email)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
