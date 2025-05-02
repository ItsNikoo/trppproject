import uuid

import boto3
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from store.models import Category, Item, Photo
from store.serializers import CategorySerializer, ItemSerializer
from decouple import config


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


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