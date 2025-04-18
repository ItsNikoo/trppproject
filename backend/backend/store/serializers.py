from rest_framework import serializers
<<<<<<< HEAD
from .models import Category, Item, Photo
=======
from .models import Category, Item
>>>>>>> b63f5ce7b48603637a510e2e78b66d25a3954c60


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category']


<<<<<<< HEAD
class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'photo_url']


=======
>>>>>>> b63f5ce7b48603637a510e2e78b66d25a3954c60
class ItemSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='category',
        queryset=Category.objects.all()
    )
<<<<<<< HEAD
    photos = PhotoSerializer(many=True, required=False)

    class Meta:
        model = Item
        fields = ['id', 'title', 'price', 'slug', 'description', 'category',
                  'available', 'preorder', 'amount', 'photos']
        read_only_fields = ['slug']

    def create(self, validated_data):
        photos_data = validated_data.pop('photos', [])
        item = Item.objects.create(**validated_data)

        # Создаем фото и добавляем их к товару
        for photo_data in photos_data:
            photo = Photo.objects.create(**photo_data)
            item.photos.add(photo)

        return item

    def update(self, instance, validated_data):
        photos_data = validated_data.pop('photos', None)

        # Обновляем основные поля
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Обновляем фото если они переданы
        if photos_data is not None:
            # Удаляем все текущие фото товара
            instance.photos.all().delete()

            # Добавляем новые фото
            for photo_data in photos_data:
                photo = Photo.objects.create(**photo_data)
                instance.photos.add(photo)

        return instance
=======

    class Meta:
        model = Item
        fields = ['id', 'title', 'price', 'description', 'category', 'available', 'preorder', 'amount']
>>>>>>> b63f5ce7b48603637a510e2e78b66d25a3954c60
