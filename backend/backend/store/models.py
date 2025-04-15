from django.db import models
from django.db.models import ForeignKey
from django.db.models.fields import IntegerField
from rest_framework.fields import BooleanField


# Create your models here.
class Category(models.Model):
    category = models.CharField(max_length=100, unique=True)


class Item(models.Model):
    title = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='items'
    )
    hit = models.BooleanField(default=False)
    available = models.BooleanField(default=False)
    preorder = models.BooleanField(default=True)
    amount = models.IntegerField()
