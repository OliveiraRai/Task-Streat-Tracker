from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

# create router and register viewset
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

# API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls))
]