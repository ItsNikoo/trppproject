from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from store.views import CategoryViewSet, ItemViewSet, PhotoUploadView, GetItemBySlug, FeaturedItemsView, \
    UploadMultiplePhotosView, CartViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'items', ItemViewSet, basename='items')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/items/slug/<slug:slug>/', GetItemBySlug.as_view(), name='item-detail-by-slug'),
    path('api/upload-photo/', PhotoUploadView.as_view(), name='upload-photo'),
    path('api/upload-photos/', UploadMultiplePhotosView.as_view(), name='upload-multiple-photos'),
    path('api/featured-items/', FeaturedItemsView.as_view(), name='featured-items'),
]
