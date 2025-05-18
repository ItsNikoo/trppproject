import uuid

import boto3
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from store.models import Category, Item, Photo, CartItem
from store.serializers import CategorySerializer, ItemSerializer, PhotoSerializer, CartItemSerializer
from decouple import config


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "category"

    @action(detail=True, methods=['get'], url_path='items', url_name='category_items')
    def get_items(self, request, category=None):
        try:
            category = self.get_object()
            items = category.items.all()
            serializer = ItemSerializer(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            return Response(
                {"error": "Категория не найдена"},
                status=status.HTTP_404_NOT_FOUND
            )


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class PhotoUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        file = request.data.get('image')
        folder = request.data.get('folder', 'default')

        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        file_extension = file.name.split('.')[-1]
        file_name = f"{folder}/{uuid.uuid4()}.{file_extension}"

        s3 = boto3.client(
            's3',
            aws_access_key_id=config("AWS_ACCESS_KEY"),
            aws_secret_access_key=config("AWS_SECRET_ACCESS_KEY"),
            endpoint_url=config("AWS_ENDPOINT_URL")
        )
        try:
            s3.upload_fileobj(
                Fileobj=file,
                Bucket=config("AWS_BUCKET_NAME"),
                Key=file_name,
                ExtraArgs={'ACL': 'public-read', 'ContentType': file.content_type}
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        file_url = f"{config('AWS_ENDPOINT_URL')}/{config('AWS_BUCKET_NAME')}/{file_name}"

        photo = Photo.objects.create(photo_url=file_url)

        return Response({'photo_url': photo.photo_url}, status=status.HTTP_201_CREATED)


class GetItemBySlug(APIView):
    def get(self, request, slug):
        item = get_object_or_404(Item, slug=slug)
        serializer = ItemSerializer(item)
        return Response(serializer.data)


class FeaturedItemsView(APIView):
    def get(self, request):
        featured_items = Item.objects.filter(is_featured=True)
        serializer = ItemSerializer(featured_items, many=True)
        return Response(serializer.data)


class UploadMultiplePhotosView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        files = request.FILES.getlist('images')
        folder = request.data.get('folder', 'default')

        if not files:
            return Response({'error': 'No files provided'}, status=status.HTTP_400_BAD_REQUEST)

        photo_objects = []
        s3 = boto3.client(
            's3',
            aws_access_key_id=config("AWS_ACCESS_KEY"),
            aws_secret_access_key=config("AWS_SECRET_ACCESS_KEY"),
            endpoint_url=config("AWS_ENDPOINT_URL")
        )

        for file in files:
            file_extension = file.name.split('.')[-1]
            file_name = f"{folder}/{uuid.uuid4()}.{file_extension}"

            try:
                s3.upload_fileobj(
                    Fileobj=file,
                    Bucket=config("AWS_BUCKET_NAME"),
                    Key=file_name,
                    ExtraArgs={'ACL': 'public-read', 'ContentType': file.content_type}
                )
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            file_url = f"{config('AWS_ENDPOINT_URL')}/{config('AWS_BUCKET_NAME')}/{file_name}"
            photo = Photo.objects.create(photo_url=file_url)
            photo_objects.append(photo)

        serialized_photos = PhotoSerializer(photo_objects, many=True)

        return Response({'photos': serialized_photos.data}, status=status.HTTP_201_CREATED)

class CartViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer