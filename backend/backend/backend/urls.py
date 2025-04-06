from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from store.views import CategoryViewSet, ItemViewSet


router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'items',ItemViewSet, basename='items')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]