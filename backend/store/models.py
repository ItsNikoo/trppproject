from django.db import models
from django.db.models import ForeignKey
from django.db.models.fields import IntegerField
from rest_framework.fields import BooleanField


# Create your models here.
class Category(models.Model):
    category = models.CharField(max_length=100, unique=True)
    category_name = models.CharField(max_length=100, unique=True)


class Photo(models.Model):
    photo_url = models.URLField(max_length=500)


class Item(models.Model):
    title = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    slug = models.CharField(max_length=100, unique=True)
    is_featured = models.BooleanField(default=False)
    description = models.TextField()
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='items'
    )
    available = models.BooleanField(default=False)
    preorder = models.BooleanField(default=True)
    amount = models.IntegerField()
    photos = models.ManyToManyField("Photo", related_name='items')


class CartItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="cart_item")
    size = models.CharField()
    quantity = models.IntegerField()
