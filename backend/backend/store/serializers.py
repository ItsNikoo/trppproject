from rest_framework import serializers
from .models import Category, Item


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category']


class ItemSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='category',
        queryset=Category.objects.all()
    )

    class Meta:
        model = Item
        fields = ['id', 'title', 'price', 'description', 'category', 'available', 'preorder', 'amount']
