# Generated by Django 4.1.4 on 2023-02-13 18:01

from django.db import migrations, models
import game.models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0005_rename_uuid_game_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='board',
            field=models.JSONField(blank=True, default=game.models.SingletonJSONFieldDefault, null=True),
        ),
    ]
