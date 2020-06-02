from django.db import models
from django.contrib.auth import get_user_model

from track.models import Track

User = get_user_model()


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, related_name='likes', on_delete=models.CASCADE)

    def __str__(self):
        return self.track.title
