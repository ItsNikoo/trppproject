# Generated by Django 5.2 on 2025-04-06 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_alter_category_category_item'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='available',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='item',
            name='preorder',
            field=models.BooleanField(default=True),
        ),
    ]
