# Generated by Django 4.1.4 on 2023-05-11 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0019_alter_game_turn'),
    ]

    operations = [
        migrations.AddField(
            model_name='ingamemessages',
            name='audio',
            field=models.FileField(null=True, upload_to='messages'),
        ),
    ]