# Generated by Django 4.1.4 on 2023-03-09 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0018_rename_dicephysics_game_dice_physics_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='turn',
            field=models.CharField(blank=True, choices=[('white', 'white'), ('black', 'black')], max_length=5, null=True),
        ),
    ]