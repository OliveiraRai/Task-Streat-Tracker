from .models import Task, Profile
from rest_framework import serializers
from django.contrib.auth.models import User

# 1. User serializer | Who owns a task
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# 2. Task serializer | Main data for the app
class TaskSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'user', 'title', 'streak', 'date'] 