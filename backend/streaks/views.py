from .models import Task
from .serializers import TaskSerializer
from rest_framework import viewsets, permissions

class TaskViewSet(viewsets.ModelViewSet):
    # 2. which translator (serializer) to use
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # self.request.user is the person currently loged in
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)