# Generated by Django 4.1.4 on 2023-02-09 01:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_alter_game_players_alter_game_start_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='finished',
            field=models.BooleanField(default=False),
        ),
    ]
