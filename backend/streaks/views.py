from .models import Task
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from .serializers import TaskSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class TaskViewSet(viewsets.ModelViewSet):
    # 2. which translator (serializer) to use
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # self.request.user is the person currently loged in
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def increment_streak(self, request, pk=None):
        task = self.get_object()
        now = timezone.now()

        if task.last_completed:
            diff = (now.date() - task.last_completed.date()).days

            if diff == 0:
                return Response({'status': 'Já completado hoje!', 'streak': task.streak}, status=200)
            elif diff == 1:
                task.streak += 1  # CORRIGIDO: de =+ para +=
            else:
                task.streak = 1   # Perdeu o streak, recomeça
        else:
            # PRIMEIRA VEZ: Se nunca foi completada, o streak vira 1
            task.streak = 1

        task.last_completed = now
        task.save()
        
        return Response({'streak': task.streak}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny]) # qualquer um pode se cadastrar
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Usuário e senha são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)
    
    # create user cuida da criptografia automaticamente
    User.objects.create_user(username=username, password=password)

    return Response({
        'message': 'Usuário criado com sucesso!'
    }, status=status.HTTP_201_CREATED)
    
