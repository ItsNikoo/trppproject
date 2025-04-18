# Generated by Django 5.2 on 2025-04-18 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='photo',
            name='item',
        ),
        migrations.AddField(
            model_name='item',
            name='photos',
            field=models.ManyToManyField(related_name='items', to='store.photo'),
        ),
        migrations.AlterField(
            model_name='item',
            name='slug',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
