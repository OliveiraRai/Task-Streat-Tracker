from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, register_user 

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('register/', register_user, name='register'), # Verifique esta linha
    path('', include(router.urls)),
]